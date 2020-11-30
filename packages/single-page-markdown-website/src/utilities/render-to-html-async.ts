import * as fs from 'fs-extra'
import { minify } from 'html-minifier'
import * as path from 'path'
import * as unified from 'unified'

const remarkParse = require('remark-parse')
const remarkToRehype = require('remark-rehype')
const rehypeStringify = require('rehype-stringify')
const rehypeAutolinkHeadings = require('rehype-autolink-headings')
const rehypeHighlightJs = require('rehype-highlight')
const rehypeSlug = require('rehype-slug')

const htmlTemplateFileName = 'template.html'
const cssFileName = 'style.css'
const jsFileName = 'script.js'

export async function renderToHtmlAsync({
  title,
  content,
  toc
}: {
  title: null | string
  content: string
  toc: string
}): Promise<string> {
  const htmlTemplate = await readFileFromBuildDirectoryAsync(
    htmlTemplateFileName
  )
  const css = await readFileFromBuildDirectoryAsync(cssFileName)
  const js = await readFileFromBuildDirectoryAsync(jsFileName)
  const html = htmlTemplate
    .replace(/__TITLE__/, title === null ? '' : title)
    .replace(/__CSS__/, css)
    .replace(/__JS__/, js)
    .replace(/__CONTENT__/, await renderMarkdownToHtmlAsync(content))
    .replace(/__TOC__/, await renderMarkdownToHtmlAsync(toc))
    .trim()
  return minify(html, {
    collapseWhitespace: true,
    minifyJS: true,
    removeTagWhitespace: true
  })
}

async function readFileFromBuildDirectoryAsync(
  fileName: string
): Promise<string> {
  const filePath = path.resolve(__dirname, '..', '..', 'build', fileName)
  return fs.readFile(filePath, 'utf8')
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
