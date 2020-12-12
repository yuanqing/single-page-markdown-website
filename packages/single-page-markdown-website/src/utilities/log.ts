/* eslint-disable no-console */

import * as kleur from 'kleur'

function error(message: string): void {
  console.log(`${kleur.red().bold('error')} ${message}`)
}

function info(message: string): void {
  console.log(`${kleur.blue().bold('info')} ${message}`)
}

function success(message: string): void {
  console.log(`${kleur.green().bold('success')} ${message}`)
}

export const log = {
  error,
  info,
  success
}
