import * as fs from 'fs-extra'
import * as globby from 'globby'
import * as path from 'path'
import * as unified from 'unified'
import * as unist from 'unist'
import * as vfile from 'vfile'

const remarkParse = require('remark-parse')
const stringify = require('remark-stringify')

export async function readMarkdownFilesAsync(
  globs: Array<string>
): Promise<Array<string>> {
  const result: Array<string> = []
  const filePaths = await globby(globs)
  for (const filePath of filePaths) {
    result.push(await readMarkdownFileAsync(filePath))
  }
  return result
}

async function readMarkdownFileAsync(filePath: string) {
  const value = await fs.readFile(filePath, 'utf8')
  const vFile = await unified()
    .use(remarkParse)
    .use(remarkTransclude)
    .use(stringify)
    .process(vfile({ contents: value, path: filePath }))
  return vFile.toString()
}

const remarkTransclude: unified.Plugin<[]> = function () {
  return async function (node: unist.Node, file: vfile.VFile) {
    let result: Array<unist.Node> = []
    for (const childNode of (node as unist.Parent)
      .children as Array<unist.Parent>) {
      if (
        childNode.type === 'paragraph' &&
        childNode.children.length === 1 &&
        childNode.children[0].type === 'text'
      ) {
        const value = childNode.children[0].value as string
        if (value[0] === '/') {
          const directory = path.dirname(file.path as string)
          const glob = path.join(directory, value.slice(1))
          const markdown = await readMarkdownFilesAsync([glob])
          const tree = unified().use(remarkParse).parse(markdown.join('\n'))
          result = result.concat((tree as unist.Parent).children)
          continue
        }
      }
      result.push(childNode)
    }
    node.children = result
  }
}
