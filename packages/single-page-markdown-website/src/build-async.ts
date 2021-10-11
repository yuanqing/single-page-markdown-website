import isUrl from 'is-url'

import { Options } from './types/types'
import { buildHtmlAsync } from './utilities/build-html-async/build-html-async.js'
import { copyImageFilesAsync } from './utilities/copy-image-files-async.js'
import { readMarkdownFilesAsync } from './utilities/read-markdown-files-async.js'
import { resolveNewImageFilePath } from './utilities/resolve-new-image-file-path.js'

export async function buildAsync(
  globs: Array<string>,
  options: Options
): Promise<string> {
  const { files, images } = await readMarkdownFilesAsync(globs)
  if (options.shareImage !== null && isUrl(options.shareImage) === false) {
    const shareImageFilePath = resolveNewImageFilePath(
      options.shareImage,
      Object.values(images)
    )
    images[options.shareImage] = shareImageFilePath
    options.shareImage = createImageUrl(shareImageFilePath, options.baseUrl)
  }
  if (options.faviconImage !== null && isUrl(options.faviconImage) === false) {
    const faviconImageFilePath = resolveNewImageFilePath(
      options.faviconImage,
      Object.values(images)
    )
    images[options.faviconImage] = faviconImageFilePath
    options.faviconImage = createImageUrl(faviconImageFilePath, options.baseUrl)
  }
  await copyImageFilesAsync(images, {
    outputDirectory: options.outputDirectory
  })
  const htmlFilePath = await buildHtmlAsync(files.join('\n\n'), options)
  return htmlFilePath
}

function createImageUrl(imageFilePath: string, baseUrl: null | string): string {
  if (baseUrl === null) {
    return imageFilePath
  }
  return [baseUrl, imageFilePath].join('/').replace(/(?<!:)\/+/g, '/')
}
