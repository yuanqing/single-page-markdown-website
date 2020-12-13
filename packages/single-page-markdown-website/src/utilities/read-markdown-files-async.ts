import * as fs from 'fs-extra'
import * as globby from 'globby'
import * as path from 'path'
import * as remarkParse from 'remark-parse'
import * as stringify from 'remark-stringify'
import * as unified from 'unified'
import * as unist from 'unist'
import * as unistUtilVisit from 'unist-util-visit'
import * as vfile from 'vfile'

import isUrl = require('is-url')
import { Images } from '../types'

export async function readMarkdownFilesAsync(
  globs: Array<string>,
  images: Images = {}
): Promise<{ files: Array<string>; images: Images }> {
  const files: Array<string> = []
  const filePaths = await globby(globs)
  if (filePaths.length === 0) {
    throw new Error(`No files found for: ${globs.join(', ')}`)
  }
  for (const filePath of filePaths) {
    const { fileContent, fileImages } = await readMarkdownFileAsync(
      filePath,
      images
    )
    files.push(fileContent)
    for (const originalFilePath in fileImages) {
      images[originalFilePath] = fileImages[originalFilePath]
    }
  }
  return { files, images }
}

async function readMarkdownFileAsync(
  filePath: string,
  images: Images
): Promise<{ fileContent: string; fileImages: Images }> {
  const value = await fs.readFile(filePath, 'utf8')
  const file = await unified()
    .use(remarkParse)
    // `remarkReplaceLocalImageFilePaths` must come before `remarkTransclude`
    .use(remarkReplaceLocalImageFilePaths, { images })
    .use(remarkTransclude)
    .use(stringify)
    .process(vfile({ contents: value, path: filePath }))
  return {
    fileContent: file.toString(),
    fileImages: file.images as Images
  }
}

// Naive regex to parse out the `src` attribute from `img` elements in raw HTML
const imageElementSrcRegex = /(<img src=)(["'])(.+)\2/

type RemarkReplaceLocalImageFilePaths = {
  images: Images
}
const remarkReplaceLocalImageFilePaths: unified.Plugin<
  [RemarkReplaceLocalImageFilePaths]
> = function (options: RemarkReplaceLocalImageFilePaths) {
  return function (node: unist.Node, file: vfile.VFile) {
    const directory = path.dirname(file.path as string)
    function createNewFilePath(imageSrc: string) {
      const originalFilePath = path.resolve(directory, imageSrc)
      const newFilePath = resolveNewFilePath(
        imageSrc,
        Object.values(options.images)
      )
      options.images[originalFilePath] = newFilePath
      return newFilePath
    }
    unistUtilVisit(node, ['html', 'image'], function (node) {
      if (node.type === 'image') {
        const imageSrc = node.url as string
        if (isUrl(imageSrc) === true) {
          return
        }
        node.url = createNewFilePath(imageSrc)
        return
      }
      const html = node.value as string
      node.value = html.replace(
        imageElementSrcRegex,
        function (_, prefix, quote, imageSrc) {
          const filePath = createNewFilePath(imageSrc)
          return `${prefix}${quote}${filePath}${quote}`
        }
      )
    })
    file.images = options.images
  }
}

const remarkTransclude: unified.Plugin<[]> = function () {
  return async function (node: unist.Node, file: vfile.VFile) {
    if (typeof file.images === 'undefined') {
      throw new Error('`file.images` is `undefined`')
    }
    const fileImages = file.images as Images
    let result: Array<unist.Node> = []
    for (const childNode of (node as unist.Parent)
      .children as Array<unist.Parent>) {
      if (
        childNode.type === 'paragraph' &&
        childNode.children.length === 1 &&
        childNode.children[0].type === 'text'
      ) {
        const value = childNode.children[0].value as string
        if (value[0] === '/') {
          const directory = path.dirname(file.path as string)
          const glob = path.join(directory, value.slice(1))
          const { files, images } = await readMarkdownFilesAsync(
            [glob],
            fileImages
          )
          const tree = unified().use(remarkParse).parse(files.join('\n'))
          result = result.concat((tree as unist.Parent).children)
          for (const originalFilePath in images) {
            fileImages[originalFilePath] = images[originalFilePath]
          }
          continue
        }
      }
      result.push(childNode)
    }
    node.children = result
  }
}

const imagesDirectoryName = 'images'

function resolveNewFilePath(
  imageSrc: string,
  usedFilePaths: Array<string>
): string {
  let newFilePath = path.join(imagesDirectoryName, path.basename(imageSrc))
  if (usedFilePaths.indexOf(newFilePath) === -1) {
    return newFilePath
  }
  // Add a numeric suffix (eg. `-1`, `-2`) to create a unique file name if we
  // find that `newFilePath` was already used
  const extension = path.extname(newFilePath)
  const basename = path.basename(newFilePath, extension)
  let index = 0
  do {
    index += 1
    newFilePath = path.join(
      imagesDirectoryName,
      `${basename}-${index}${extension}`
    )
  } while (usedFilePaths.indexOf(newFilePath) !== -1)
  return newFilePath
}
