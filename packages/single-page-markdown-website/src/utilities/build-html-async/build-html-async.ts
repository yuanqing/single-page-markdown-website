import fs from 'fs-extra'
import path from 'path'

import { Options } from '../../types/types.js'
import { createMarkdownTocAsync } from './create-markdown-toc-async.js'
import { renderToHtmlAsync } from './render-to-html-async.js'

const outputHtmlFileName = 'index.html'

export async function buildHtmlAsync(
  content: string,
  options: Options
): Promise<string> {
  const sections =
    options.sections === false
      ? null
      : await createMarkdownTocAsync(content, {
          sections: true
        })
  const toc =
    options.toc === true
      ? await createMarkdownTocAsync(content, { sections: false })
      : null
  const html = await renderToHtmlAsync(content, {
    baseUrl: options.baseUrl,
    description: options.description,
    faviconImage: options.faviconImage,
    links: options.links,
    sections,
    shareImage: options.shareImage,
    title: options.title,
    toc,
    version: options.version
  })
  const htmlFilePath = path.join(options.outputDirectory, outputHtmlFileName)
  await fs.outputFile(htmlFilePath, html)
  return htmlFilePath
}
