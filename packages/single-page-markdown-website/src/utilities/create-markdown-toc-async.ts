import * as unified from 'unified'
import * as unist from 'unist'

const mdastUtilToc = require('mdast-util-toc')
const remarkParse = require('remark-parse')
const remarkStripBadges = require('remark-strip-badges')
const remarkStringify = require('remark-stringify')

export async function createMarkdownTocAsync(
  content: string
): Promise<null | string> {
  return new Promise(function (resolve, reject) {
    unified()
      .use(remarkParse)
      .use(remarkStripBadges)
      .use(remarkToc)
      .use(remarkStringify)
      .process(content, function (error, file) {
        if (error) {
          reject(error)
          return
        }
        const result = file.toString()
        resolve(result === '' ? null : result)
      })
  })
}

const remarkToc: unified.Plugin<[]> = function () {
  return function (node: unist.Node) {
    const { map } = mdastUtilToc(node, {
      tight: true
    })
    node.children = map === null ? [] : [map]
  }
}
