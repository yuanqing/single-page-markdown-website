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
  const filePath = require.resolve(
    path.join('@single-page-markdown-website', 'frontend', 'lib', fileName)
  )
  if (typeof filePath === 'undefined') {
    throw new Error(`Could not resolve file: ${fileName}`)
  }
  return filePath
}
