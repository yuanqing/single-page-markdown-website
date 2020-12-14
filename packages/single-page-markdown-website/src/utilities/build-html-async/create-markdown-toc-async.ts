import * as mdastUtilToc from 'mdast-util-toc'
import * as remarkParse from 'remark-parse'
import * as remarkStringify from 'remark-stringify'
import * as unified from 'unified'
import * as unist from 'unist'

const remarkStripBadges = require('remark-strip-badges')

export async function createMarkdownTocAsync(
  content: string,
  options: { topLevelHeadingsOnly: boolean }
): Promise<null | string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkStripBadges)
    .use(remarkExtractToc, options)
    .use(remarkStringify)
    .process(content)
  const result = file.toString()
  return result === '' ? null : result
}

type RemarkExtractTocOptions = {
  topLevelHeadingsOnly: boolean
}

const remarkExtractToc: unified.Plugin<[RemarkExtractTocOptions]> = function (
  options: RemarkExtractTocOptions
) {
  return function (node: unist.Node) {
    const { map } = mdastUtilToc(node, {
      maxDepth: options.topLevelHeadingsOnly === true ? 1 : 6,
      tight: true
    })
    node.children = map === null ? [] : [map]
  }
}
