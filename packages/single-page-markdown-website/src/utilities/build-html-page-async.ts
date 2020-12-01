import * as fs from 'fs-extra'
import * as path from 'path'

import { Options } from '../types'
import { createMarkdownTocAsync } from './create-markdown-toc-async'
import { readMarkdownFilesAsync } from './read-markdown-files-async'
import { renderToHtmlAsync } from './render-to-html-async'

const outputHtmlFileName = 'index.html'

export async function buildHtmlPageAsync(
  globs: Array<string>,
  options: Options
): Promise<void> {
  const files = await readMarkdownFilesAsync(globs)
  const content = files
    .map(function ({ content }) {
      return content
    })
    .join('\n\n')
  const toc = await createMarkdownTocAsync(content, options.hiddenTocHeadings)
  const html = await renderToHtmlAsync({ content, title: options.title, toc })
  const htmlFilePath = path.join(options.outputDirectory, outputHtmlFileName)
  await fs.outputFile(htmlFilePath, html)
}
