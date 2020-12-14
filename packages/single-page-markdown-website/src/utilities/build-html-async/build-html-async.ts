import * as fs from 'fs-extra'
import * as path from 'path'

import { Options } from '../../types'
import { createMarkdownTocAsync } from './create-markdown-toc-async'
import { renderToHtmlAsync } from './render-to-html-async'

const outputHtmlFileName = 'index.html'

export async function buildHtmlAsync(
  content: string,
  options: Options
): Promise<void> {
  const sections = await createMarkdownTocAsync(content, {
    topLevelHeadingsOnly: true
  })
  const toc =
    options.hideToc === true
      ? null
      : await createMarkdownTocAsync(content, { topLevelHeadingsOnly: false })
  const html = await renderToHtmlAsync(content, {
    description: options.description,
    links: options.links,
    sections,
    title: options.title,
    toc
  })
  const htmlFilePath = path.join(options.outputDirectory, outputHtmlFileName)
  await fs.outputFile(htmlFilePath, html)
}
