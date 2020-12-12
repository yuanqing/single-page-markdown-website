import * as fs from 'fs-extra'
import * as path from 'path'

import { Config } from '../types'

const configKey = 'single-page-markdown-website'

const defaultConfig = {
  description: null,
  hideToc: false,
  title: null
}

export async function readConfigAsync(): Promise<Config> {
  const packageJsonFilePath = path.resolve(process.cwd(), 'package.json')
  if ((await fs.pathExists(packageJsonFilePath)) === false) {
    return defaultConfig
  }
  const packageJson = require(packageJsonFilePath)
  const packageJsonConfig = {
    description:
      typeof packageJson.description === 'undefined'
        ? null
        : packageJson.description,
    title: typeof packageJson.name === 'undefined' ? null : packageJson.name
  }
  const config = packageJson[configKey]
  return {
    ...defaultConfig,
    ...packageJsonConfig,
    ...(typeof config === 'undefined' ? {} : config)
  }
}
