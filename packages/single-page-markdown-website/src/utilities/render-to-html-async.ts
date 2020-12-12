import { minify } from 'html-minifier'
import * as mustache from 'mustache'
import * as rehypeSlug from 'rehype-slug'
import * as rehypeStringify from 'rehype-stringify'
import * as remarkGfm from 'remark-gfm'
import * as remarkParse from 'remark-parse'
import * as remarkToRehype from 'remark-rehype'
import * as unified from 'unified'

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
  toc: null | string
}): Promise<string> {
  const htmlTemplate = await readFrontendLibFileAsync('index.html')
  const html = mustache.render(htmlTemplate, {
    content: await renderMarkdownToHtmlAsync(content),
    css: await readFrontendLibFileAsync('style.css'),
    js: toc === null ? null : await readFrontendLibFileAsync('script.js'),
    title,
    toc: toc === null ? null : await renderMarkdownToHtmlAsync(toc)
  })
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
        behavior: 'append',
        content: {
          children: [
            {
              type: 'text',
              value: '#'
            }
          ],
          properties: {
            class: 'header-link__text'
          },
          tagName: 'span',
          type: 'element'
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
