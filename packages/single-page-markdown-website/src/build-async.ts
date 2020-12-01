import * as fs from 'fs-extra'
import * as path from 'path'

import { Options } from './types'
import { createMarkdownTocAsync } from './utilities/create-markdown-toc-async'
import { readMarkdownFilesAsync } from './utilities/read-markdown-files-async'
import { renderToHtmlAsync } from './utilities/render-to-html-async'

const outputHtmlFileName = 'index.html'

export async function buildAsync(
  globs: Array<string>,
  options: Options
): Promise<void> {
  if (globs.length === 0) {
    throw new Error('Need a Markdown file or glob')
  }
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
