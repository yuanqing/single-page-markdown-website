#!/usr/bin/env node

import { createCli } from '@yuanqing/cli'
import * as chokidar from 'chokidar'

import { buildAsync } from './build-async'
import { Options } from './types'
import { log } from './utilities/log'
import { readConfigAsync } from './utilities/read-config-async'

const packageJson = require('../package.json')

const cliConfig = {
  name: packageJson.name,
  version: packageJson.version
}

const commandConfig = {
  description: `${packageJson.description}.`,
  examples: ['', "'*.md'", "'*.md' --output dist", "'*.md' --watch"],
  options: [
    {
      aliases: ['o'],
      default: './build',
      description: "Set the output directory. Defaults to './build'.",
      name: 'output',
      type: 'STRING'
    },
    {
      aliases: ['w'],
      default: false,
      description:
        'Whether to rebuild the site on changes to the Markdown files.',
      name: 'watch',
      type: 'BOOLEAN'
    }
  ],
  positionals: [
    {
      default: '*.md',
      description: "One or more globs of Markdown files. Defaults to '*.md'.",
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
      async function buildCommandAsync() {
        log.info('Building...')
        const config = await readConfigAsync()
        await buildAsync(globPatterns, {
          outputDirectory: options.output,
          ...config
        } as Options)
        log.success('Done')
      }
      if (options.watch === false) {
        await buildCommandAsync()
        return
      }
      const watcher = chokidar.watch([...globPatterns, 'package.json'])
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
  } catch (error) {
    log.error(error.message)
    process.exit(1)
  }
}
main()
