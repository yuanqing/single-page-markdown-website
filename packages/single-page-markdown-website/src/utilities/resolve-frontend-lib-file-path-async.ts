import * as findUp from 'find-up'
import * as path from 'path'

export async function resolveFrontendLibFilePathAsync(
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
