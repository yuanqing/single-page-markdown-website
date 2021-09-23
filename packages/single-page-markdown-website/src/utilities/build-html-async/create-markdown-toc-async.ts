import { ListItem, Root } from 'mdast'
import { toc } from 'mdast-util-toc'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkStripBadges from 'remark-strip-badges'
import { Plugin, unified } from 'unified'
import unist from 'unist'

export async function createMarkdownTocAsync(
  content: string,
  options: { sections: boolean }
): Promise<null | string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkStripBadges)
    .use(remarkExtractToc, { sections: options.sections })
    .use(remarkStringify)
    .process(content)
  const result = file.toString()
  return result === '' ? null : result
}

type RemarkExtractTocOptions = {
  sections: boolean
}

const remarkExtractToc: Plugin<[RemarkExtractTocOptions], Root> = function (
  options: RemarkExtractTocOptions
) {
  return function (node: Root) {
    const { map } = toc(node, {
      tight: true
    })
    if (map === null) {
      node.children = []
      delete node.position
      return
    }
    if (options.sections === false) {
      node.children = [map]
      delete node.position
      return
    }
    if ((map.children as Array<unist.Node>).length > 1) {
      const { map } = toc(node, {
        maxDepth: 1,
        tight: true
      })
      if (map === null) {
        node.children = []
        delete node.position
        return
      }
      node.children = [map]
      delete node.position
      return
    }
    const result: Array<ListItem> = []
    for (const node of map.children[0].children) {
      if (node.type === 'list') {
        for (const child of node.children) {
          result.push({
            children: [child.children[0]],
            spread: false,
            type: 'listItem'
          })
        }
      }
    }
    node.children = [
      {
        children: result,
        ordered: false,
        spread: false,
        type: 'list'
      }
    ]
    delete node.position
  }
}
