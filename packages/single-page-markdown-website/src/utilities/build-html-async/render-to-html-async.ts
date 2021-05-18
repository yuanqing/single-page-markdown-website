import htmlMinifier from 'html-minifier'
import lodashTemplate from 'lodash.template'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlightJs from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkEmoji from 'remark-emoji'
import remarkExternalLinks from 'remark-external-links'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkToRehype from 'remark-rehype'
import unified from 'unified'

import { Link } from '../../types/types.js'
import { readFrontendLibFileAsync } from './read-frontend-lib-file-async.js'

export async function renderToHtmlAsync(
  content: string,
  {
    baseUrl,
    description,
    links,
    sections,
    socialMediaPreviewImage,
    title,
    toc,
    version
  }: {
    baseUrl: null | string
    description: null | string
    title: null | string
    links: Array<Link>
    sections: null | string
    socialMediaPreviewImage: null | string
    toc: null | string
    version: null | string
  }
): Promise<string> {
  const htmlTemplate = await readFrontendLibFileAsync('index.html')
  const html = lodashTemplate(htmlTemplate)({
    content: await renderMarkdownToHtmlAsync(content),
    css: await readFrontendLibFileAsync('style.css'),
    description,
    js: await readFrontendLibFileAsync('script.js'),
    links,
    sections:
      sections === null ? null : await renderMarkdownToHtmlAsync(sections),
    socialMediaPreviewImage,
    title,
    titleUrl: baseUrl === null ? 'index.html' : baseUrl,
    toc: toc === null ? null : await renderMarkdownToHtmlAsync(toc),
    version
  })
  return htmlMinifier.minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeTagWhitespace: true
  })
}

async function renderMarkdownToHtmlAsync(content: string): Promise<string> {
  return new Promise(function (resolve, reject) {
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkExternalLinks, { rel: 'nofollow', target: '_blank' })
      .use(remarkEmoji)
      .use(remarkToRehype, {
        allowDangerousHtml: true
      })
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
      .use(rehypeHighlightJs, {
        subset: false
      })
      .use(rehypeStringify, {
        allowDangerousHtml: true
      })
      .process(content, function (error, file) {
        if (error) {
          reject(error)
          return
        }
        resolve(file.toString())
      })
  })
}
