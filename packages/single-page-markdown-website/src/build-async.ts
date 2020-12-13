import { Options } from './types'
import { buildHtmlAsync } from './utilities/build-html-async/build-html-async'
import { copyImageFilesAsync } from './utilities/copy-image-files-async'
import { readMarkdownFilesAsync } from './utilities/read-markdown-files-async'

export async function buildAsync(
  globs: Array<string>,
  options: Options
): Promise<void> {
  const { files, images } = await readMarkdownFilesAsync(globs)
  await buildHtmlAsync(files.join('\n\n'), options)
  await copyImageFilesAsync(images, {
    outputDirectory: options.outputDirectory
  })
}
