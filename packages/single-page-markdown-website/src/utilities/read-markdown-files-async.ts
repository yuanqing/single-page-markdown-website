import fs from 'fs-extra'
import { globby } from 'globby'
import isUrl from 'is-url'
import { Content, Root } from 'mdast'
import path from 'path'
import remarkParse from 'remark-parse'
import stringify from 'remark-stringify'
import { Plugin, unified } from 'unified'
import { visit } from 'unist-util-visit'
import { VFile } from 'vfile'

import { Images } from '../types/types.js'
import { resolveNewImageFilePath } from './resolve-new-image-file-path.js'

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
    .process(new VFile({ path: filePath, value }))
  return {
    fileContent: file.toString(),
    fileImages: file.data.images as Images
  }
}

// Naive regex to parse out the `src` attribute from `img` elements in raw HTML
const imageElementSrcRegex = /(<img src=)"([^"]+)"/g

type RemarkReplaceLocalImageFilePaths = {
  images: Images
}
const remarkReplaceLocalImageFilePaths: Plugin<
  [RemarkReplaceLocalImageFilePaths],
  Root
> = function (options: RemarkReplaceLocalImageFilePaths) {
  return function (node: Root, file: VFile) {
    const directory = path.dirname(file.path)
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
    visit<Root, Array<string>>(
      node,
      ['html', 'image'],
      function (node: Root | Content) {
        if (node.type === 'image') {
          const imageSrc = node.url
          if (isUrl(imageSrc) === true) {
            return
          }
          node.url = createNewFilePath(imageSrc)
          return
        }
        if (node.type === 'html') {
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
        }
      }
    )
    file.data.images = options.images
  }
}

const remarkTransclude: Plugin<[], Root> = function () {
  return async function (node: Root, file: VFile) {
    if (typeof file.data.images === 'undefined') {
      throw new Error('`file.data.images` is `undefined`')
    }
    const fileImages = file.data.images as Images
    let result: Array<Content> = []
    for (const childNode of node.children) {
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
          const tree: Root = unified().use(remarkParse).parse(files.join('\n'))
          result = result.concat(tree.children)
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
