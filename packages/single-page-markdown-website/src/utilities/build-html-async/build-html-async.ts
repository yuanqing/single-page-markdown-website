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
  const toc =
    options.hideToc === true ? null : await createMarkdownTocAsync(content)
  const html = await renderToHtmlAsync(content, {
    description: options.description,
    links: options.links,
    title: options.title,
    toc
  })
  const htmlFilePath = path.join(options.outputDirectory, outputHtmlFileName)
  await fs.outputFile(htmlFilePath, html)
}
