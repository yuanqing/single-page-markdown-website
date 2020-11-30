import * as fs from 'fs-extra'

import { CliOptions, Config } from './types'
import { createMarkdownTocAsync } from './utilities/create-markdown-toc-async'
import { readMarkdownFilesAsync } from './utilities/read-markdown-files-async'
import { renderToHtmlAsync } from './utilities/render-to-html-async'

export async function buildHtmlPageAsync(
  globs: Array<string>,
  config: Config,
  options: CliOptions
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
  const toc = await createMarkdownTocAsync(content, config.hiddenTocHeadings)
  const html = await renderToHtmlAsync({ content, title: config.title, toc })
  if (options.output === null) {
    console.log(html) // eslint-disable-line no-console
    return
  }
  await fs.outputFile(options.output, html)
}
