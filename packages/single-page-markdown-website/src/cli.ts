#!/usr/bin/env node

import { createCli } from '@yuanqing/cli'

import { buildAsync } from './build-async'
import { Options } from './types'
import { readConfigAsync } from './utilities/read-config-async'

const packageJson = require('../package.json')

const cliConfig = {
  name: packageJson.name,
  version: packageJson.version
}

const commandConfig = {
  description: `${packageJson.description}.`,
  examples: ["'*.md'", "'*.md' --output dist"],
  options: [
    {
      aliases: ['o'],
      default: './build',
      description: "Set the output directory. Defaults './build'.",
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
      await buildAsync(globPatterns, {
        outputDirectory: options.output,
        ...config
      } as Options)
    }
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
    process.exit(1)
  }
}
main()
