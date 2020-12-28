import * as fs from 'fs-extra'
import * as path from 'path'

import { Config } from '../types'

const configKey = require('../../package.json').name

const defaultConfig = {
  baseUrl: null,
  description: null,
  links: [],
  sections: true,
  shareImage: null,
  title: null,
  toc: true
}

export async function readConfigAsync(): Promise<Config> {
  const packageJsonFilePath = path.resolve(process.cwd(), 'package.json')
  if ((await fs.pathExists(packageJsonFilePath)) === false) {
    return defaultConfig
  }
  const packageJson = JSON.parse(await fs.readFile(packageJsonFilePath, 'utf8'))
  const packageJsonConfig = {
    baseUrl:
      typeof packageJson.homepage === 'undefined' ? null : packageJson.homepage,
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
    title: typeof packageJson.name === 'undefined' ? null : packageJson.name
  }
  const config = packageJson[configKey]
  return {
    ...defaultConfig,
    ...packageJsonConfig,
    ...(typeof config === 'undefined' ? {} : config)
  }
}
