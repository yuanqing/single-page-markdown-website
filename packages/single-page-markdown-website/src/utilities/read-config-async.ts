import * as fs from 'fs-extra'
import * as path from 'path'

import { Config } from '../types'

const configKey = 'single-page-markdown-website'
const defaultConfig = {
  hiddenTocHeadings: [] as Array<string>,
  title: null
}

export async function readConfigAsync(): Promise<Config> {
  const packageJsonFilePath = path.resolve(process.cwd(), 'package.json')
  if ((await fs.pathExists(packageJsonFilePath)) === false) {
    return defaultConfig
  }
  const packageJson = require(packageJsonFilePath)
  const config = packageJson[configKey]
  if (typeof config === 'undefined') {
    return defaultConfig
  }
  return config
}
