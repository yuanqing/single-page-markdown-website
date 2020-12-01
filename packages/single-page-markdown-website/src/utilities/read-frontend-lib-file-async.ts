import * as findUp from 'find-up'
import * as fs from 'fs-extra'
import * as path from 'path'

export async function readFrontendLibFileAsync(
  fileName: string
): Promise<string> {
  const resolvedFilePath = await resolveFrontendLibFilePathAsync(fileName)
  return fs.readFile(resolvedFilePath, 'utf8')
}

async function resolveFrontendLibFilePathAsync(
  fileName: string
): Promise<string> {
  const filePath = path.join(
    'node_modules',
    '@single-page-markdown-website',
    'frontend',
    'lib',
    fileName
  )
  const resolvedFilePath = await findUp(filePath)
  if (typeof resolvedFilePath === 'undefined') {
    throw new Error(`Could not resolve file: ${filePath}`)
  }
  return resolvedFilePath
}
