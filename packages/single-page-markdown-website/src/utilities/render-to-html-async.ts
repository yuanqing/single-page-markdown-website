import * as fs from 'fs-extra'
import { minify } from 'html-minifier'
import * as unified from 'unified'

import { resolveFrontendLibFilePathAsync } from './resolve-frontend-lib-file-path-async'

const remarkParse = require('remark-parse')
const remarkToRehype = require('remark-rehype')
const rehypeStringify = require('rehype-stringify')
const rehypeAutolinkHeadings = require('rehype-autolink-headings')
const rehypeHighlightJs = require('rehype-highlight')
const rehypeSlug = require('rehype-slug')

export async function renderToHtmlAsync({
  title,
  content,
  toc
}: {
  title: null | string
  content: string
  toc: string
}): Promise<string> {
  const htmlTemplate = await fs.readFile(
    await resolveFrontendLibFilePathAsync('index.html'),
    'utf8'
  )
  const html = htmlTemplate
    .replace(/__CONTENT__/, await renderMarkdownToHtmlAsync(content))
    .replace(/__TITLE__/, title === null ? '' : title)
    .replace(/__TOC__/, await renderMarkdownToHtmlAsync(toc))
    .trim()
  return minify(html, {
    collapseWhitespace: true,
    minifyJS: true,
    removeTagWhitespace: true
  })
}

async function renderMarkdownToHtmlAsync(content: string): Promise<string> {
  return new Promise(function (resolve, reject) {
    unified()
      .use(remarkParse)
      .use(remarkToRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings)
      .use(rehypeHighlightJs)
      .use(rehypeStringify)
      .process(content, function (error, file) {
        if (error) {
          reject(error)
          return
        }
        resolve(file.toString())
      })
  })
}
