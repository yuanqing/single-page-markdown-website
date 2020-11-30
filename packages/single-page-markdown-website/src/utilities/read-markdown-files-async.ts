import * as fs from 'fs-extra'
import * as globby from 'globby'
import * as grayMatter from 'gray-matter'

import { MarkdownFile } from '../types'

export async function readMarkdownFilesAsync(
  globs: Array<string>
): Promise<Array<MarkdownFile>> {
  const filePaths = await globby(globs)
  const files = await readFilesAsync(filePaths)
  return files
    .map(function (file) {
      const { content, data } = grayMatter(file.content)
      return {
        content,
        filePath: file.filePath,
        weight: typeof data.weight === 'undefined' ? -1 : data.weight
      }
    })
    .sort(sortMarkdownFilesComparator)
}

async function readFilesAsync(
  filePaths: Array<string>
): Promise<Array<{ filePath: string; content: string }>> {
  return Promise.all(
    filePaths.map(async function (filePath) {
      return {
        content: await fs.readFile(filePath, 'utf8'),
        filePath
      }
    })
  )
}

function sortMarkdownFilesComparator(a: MarkdownFile, b: MarkdownFile): number {
  const weightCompareResult = a.weight - b.weight
  if (weightCompareResult === 0) {
    return a.filePath.localeCompare(b.filePath)
  }
  return weightCompareResult
}
