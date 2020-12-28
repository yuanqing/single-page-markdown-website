import * as fs from 'fs-extra'
import * as globby from 'globby'
import * as path from 'path'
import * as remarkParse from 'remark-parse'
import * as stringify from 'remark-stringify'
import * as unified from 'unified'
import * as unist from 'unist'
import * as unistUtilVisit from 'unist-util-visit'
import * as vfile from 'vfile'

import { Images } from '../types'
import { resolveNewImageFilePath } from './resolve-new-image-file-path'

const isUrl = require('is-url')

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
const imageElementSrcRegex = /(<img src=)"([^"]+)"/g

type RemarkReplaceLocalImageFilePaths = {
  images: Images
}
const remarkReplaceLocalImageFilePaths: unified.Plugin<
  [RemarkReplaceLocalImageFilePaths]
> = function (options: RemarkReplaceLocalImageFilePaths) {
  return function (node: unist.Node, file: vfile.VFile) {
    const directory = path.dirname(file.path as string)
    function createNewFilePath(imageSrc: string) {
      const originalFilePath = path.join(
        imageSrc[0] === '/' ? process.cwd() : directory,
        imageSrc
      )
      const newFilePath = resolveNewImageFilePath(
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
        function (match, prefix, imageSrc) {
          if (isUrl(imageSrc) === true) {
            return match
          }
          const filePath = createNewFilePath(imageSrc)
          return `${prefix}"${filePath}"`
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
        if (value.indexOf('./') === 0 || value[0] === '/') {
          const directory =
            value[0] === '/' ? process.cwd() : path.dirname(file.path as string)
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
