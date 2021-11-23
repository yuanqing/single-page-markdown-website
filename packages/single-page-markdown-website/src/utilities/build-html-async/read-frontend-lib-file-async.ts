import { findUp } from 'find-up'
import fs from 'fs-extra'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function readFrontendLibFileAsync(
  fileName: string
): Promise<string> {
  const resolvedFilePath = await findUp(
    path.join(
      'node_modules',
      '@single-page-markdown-website',
      'frontend',
      'lib',
      fileName
    ),
    { cwd: __dirname }
  )
  if (typeof resolvedFilePath === 'undefined') {
    throw new Error(`Could not resolve file: ${fileName}`)
  }
  return fs.readFile(resolvedFilePath, 'utf8')
}
