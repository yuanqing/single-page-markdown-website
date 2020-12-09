import { minify } from 'html-minifier'
import * as rehypeSlug from 'rehype-slug'
import * as rehypeStringify from 'rehype-stringify'
import * as remarkGfm from 'remark-gfm'
import * as remarkParse from 'remark-parse'
import * as remarkToRehype from 'remark-rehype'
import * as unified from 'unified'

import { glyphs } from './glyphs'
import { readFrontendLibFileAsync } from './read-frontend-lib-file-async'

const rehypeAutolinkHeadings = require('rehype-autolink-headings')
const remarkEmoji = require('remark-emoji')
const rehypeHighlightJs = require('rehype-highlight')

export async function renderToHtmlAsync({
  title,
  content,
  toc
}: {
  title: null | string
  content: string
  toc: string
}): Promise<string> {
  const htmlTemplate = await readFrontendLibFileAsync('index.html')
  const html = htmlTemplate
    .replace(/\/\*__CSS__\*\//, await readFrontendLibFileAsync('style.css'))
    .replace(/__JS__/, await readFrontendLibFileAsync('script.js'))
    .replace(/__GLYPHS__/, glyphs.join(''))
    .replace(/__TITLE__/, title === null ? '' : title)
    .replace(/__CONTENT__/, await renderMarkdownToHtmlAsync(content))
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
      .use(remarkGfm)
      .use(remarkEmoji)
      .use(remarkToRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        content: {
          type: 'text',
          value: '#'
        },
        properties: {
          ariaHidden: true,
          class: 'header-link',
          tabIndex: -1
        }
      })
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
