#!/usr/bin/env node

import { createCli } from '@yuanqing/cli'
import chokidar from 'chokidar'
import { readFileSync } from 'fs'
import open from 'open'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { buildAsync } from './build-async.js'
import { Options } from './types/types.js'
import { log } from './utilities/log.js'
import { readConfigAsync } from './utilities/read-config-async.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageJsonFilePath = resolve(__dirname, '..', 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonFilePath, 'utf8'))

const cliConfig = {
  name: packageJson.name,
  version: packageJson.version
}

const commandConfig = {
  description: `${packageJson.description}.`,
  examples: ['', "'*.md'", '--open', '--output dist', '--watch'],
  options: [
    {
      aliases: ['o'],
      default: './build',
      description: "Set the output directory. Defaults to './build'.",
      name: 'output',
      type: 'STRING'
    },
    {
      aliases: ['p'],
      default: false,
      description:
        "Whether to open the generated page in the default web browser. Defaults to 'false'.",
      name: 'open',
      type: 'BOOLEAN'
    },
    {
      aliases: ['w'],
      default: false,
      description:
        "Whether to watch for changes and regenerate the page. Defaults to 'false'.",
      name: 'watch',
      type: 'BOOLEAN'
    }
  ],
  positionals: [
    {
      default: 'README.md',
      description:
        "One or more globs of Markdown files. Defaults to 'README.md'.",
      name: 'files',
      type: 'STRING'
    }
  ]
}

async function main() {
  try {
    const result = createCli(cliConfig, commandConfig)(process.argv.slice(2))
    if (typeof result !== 'undefined') {
      const { positionals, options, remainder } = result
      const globPatterns = [positionals.files as string, ...remainder]
      let opened = false
      async function buildCommandAsync() {
        log.info('Building...')
        const config = await readConfigAsync()
        const htmlFilePath = await buildAsync(globPatterns, {
          outputDirectory: options.output,
          ...config
        } as Options)
        if (options.open === true && opened === false) {
          await open(htmlFilePath)
          opened = true
        }
        log.success('Done')
      }
      if (options.watch === false) {
        await buildCommandAsync()
        return
      }
      const watcher = chokidar.watch([...globPatterns, './'], {
        ignored: [options.output, 'node_modules']
      })
      async function onChangeAsync() {
        await buildCommandAsync()
        log.info('Watching...')
      }
      watcher.on('ready', onChangeAsync)
      watcher.on('change', async function (file: string) {
        log.info(`Changed: ${file}`)
        await onChangeAsync()
      })
    }
  } catch (error: any) {
    log.error(error.message)
    process.exit(1)
  }
}
main()
