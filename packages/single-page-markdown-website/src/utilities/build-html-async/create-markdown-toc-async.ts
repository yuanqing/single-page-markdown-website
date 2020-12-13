import * as mdastUtilToc from 'mdast-util-toc'
import * as remarkParse from 'remark-parse'
import * as remarkStringify from 'remark-stringify'
import * as unified from 'unified'
import * as unist from 'unist'

const remarkStripBadges = require('remark-strip-badges')

export async function createMarkdownTocAsync(
  content: string
): Promise<null | string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkStripBadges)
    .use(remarkExtractToc)
    .use(remarkStringify)
    .process(content)
  const result = file.toString()
  return result === '' ? null : result
}

const remarkExtractToc: unified.Plugin<[]> = function () {
  return function (node: unist.Node) {
    const { map } = mdastUtilToc(node, {
      tight: true
    })
    node.children = map === null ? [] : [map]
  }
}
