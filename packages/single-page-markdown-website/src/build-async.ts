import * as fs from 'fs-extra'
import * as path from 'path'

import { Options } from './types'
import { buildHtmlPageAsync } from './utilities/build-html-page-async'
import { resolveFrontendLibFilePathAsync } from './utilities/resolve-frontend-lib-file-path-async'

export async function buildAsync(
  globs: Array<string>,
  options: Options
): Promise<void> {
  if (globs.length === 0) {
    throw new Error('Need a Markdown file or glob')
  }
  await buildHtmlPageAsync(globs, options)
  await copyFrontendLibFileAsync('style.css', options.outputDirectory)
  await copyFrontendLibFileAsync('script.js', options.outputDirectory)
}

export async function copyFrontendLibFileAsync(
  fileName: string,
  outputDirectory: string
): Promise<void> {
  const filePath = await resolveFrontendLibFilePathAsync(fileName)
  await fs.copy(filePath, path.join(outputDirectory, fileName))
}
