import fs from 'fs-extra'
import path from 'path'

import { Config } from '../types/types.js'

const configKey = 'single-page-markdown-website'

const defaultConfig = {
  baseUrl: null,
  description: null,
  faviconImage: null,
  links: [],
  sections: true,
  shareImage: null,
  title: null,
  toc: true,
  version: null
}

export async function readConfigAsync(): Promise<Config> {
  const packageJsonFilePath = path.resolve(process.cwd(), 'package.json')
  if ((await fs.pathExists(packageJsonFilePath)) === false) {
    return defaultConfig
  }
  const lernaJsonFilePath = path.resolve(process.cwd(), 'lerna.json')
  const lernaJson =
    (await fs.pathExists(lernaJsonFilePath)) === true
      ? JSON.parse(await fs.readFile(lernaJsonFilePath, 'utf8'))
      : {}
  const packageJson = JSON.parse(await fs.readFile(packageJsonFilePath, 'utf8'))
  const config = {
    description:
      typeof packageJson.description === 'undefined'
        ? null
        : packageJson.description,
    links:
      typeof packageJson.homepage === 'undefined'
        ? []
        : [
            {
              text: 'GitHub',
              url: packageJson.homepage
            }
          ],
    title: typeof packageJson.name === 'undefined' ? null : packageJson.name,
    version:
      typeof lernaJson.version === 'undefined'
        ? typeof packageJson.version === 'undefined'
          ? null
          : `v${packageJson.version}`
        : `v${lernaJson.version}`,
    ...(typeof packageJson[configKey] === 'undefined'
      ? {}
      : packageJson[configKey])
  }
  return {
    ...defaultConfig,
    ...config
  }
}
