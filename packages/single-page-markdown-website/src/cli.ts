#!/usr/bin/env node

import { createCli } from '@yuanqing/cli'

import { buildHtmlPageAsync } from './build-html-page-async'
import { CliOptions } from './types'
import { readConfigAsync } from './utilities/read-config-async'

const packageJson = require('../package.json')

const cliConfig = {
  name: packageJson.name,
  version: packageJson.version
}

const commandConfig = {
  description: `${packageJson.description}.`,
  examples: ["'docs/*.md' --output 'build/index.html'"],
  options: [
    {
      aliases: ['o'],
      default: null,
      description:
        'Set the output file path. Defaults to writing to `stdout` if not specified.',
      name: 'output',
      type: 'STRING'
    }
  ],
  positionals: [
    {
      description: 'One or more globs of Markdown files.',
      name: 'files',
      required: true,
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
      const config = await readConfigAsync()
      await buildHtmlPageAsync(globPatterns, config, options as CliOptions)
    }
  } catch (error) {
    console.error(error.message) // eslint-disable-line no-console
    process.exit(1)
  }
}
main()
