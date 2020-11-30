import * as unified from 'unified'
import * as unist from 'unist'

const mdastUtilToc = require('mdast-util-toc')
const remarkParse = require('remark-parse')
const remarkStringify = require('remark-stringify')

export async function createMarkdownTocAsync(
  content: string,
  hiddenTocHeadings: Array<string>
): Promise<string> {
  return new Promise(function (resolve, reject) {
    unified()
      .use(remarkParse)
      .use(remarkToc, { hiddenTocHeadings })
      .use(remarkStringify)
      .process(content, function (error, file) {
        if (error) {
          reject(error)
          return
        }
        resolve(file.toString())
      })
  })
}

type RemarkTocOptions = { hiddenTocHeadings: Array<string> }

const remarkToc: unified.Plugin<[RemarkTocOptions]> = function ({
  hiddenTocHeadings
}: RemarkTocOptions) {
  return function (node: unist.Node) {
    const { map } = mdastUtilToc(node, {
      skip: hiddenTocHeadings.join('|'),
      tight: true
    })
    node.children = [map]
  }
}
