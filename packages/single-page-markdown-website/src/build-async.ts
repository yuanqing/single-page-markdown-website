import { Options } from './types'
import { buildHtmlAsync } from './utilities/build-html-async/build-html-async'
import { copyImageFilesAsync } from './utilities/copy-image-files-async'
import { readMarkdownFilesAsync } from './utilities/read-markdown-files-async'
import { resolveNewImageFilePath } from './utilities/resolve-new-image-file-path'

const isUrl = require('is-url')

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
    options.shareImage = shareImageFilePath
  }
  await copyImageFilesAsync(images, {
    outputDirectory: options.outputDirectory
  })
  const htmlFilePath = await buildHtmlAsync(files.join('\n\n'), options)
  return htmlFilePath
}
