/* eslint-disable no-console */

import { blue, bold, green, red } from 'kleur/colors'

function error(message: string): void {
  console.log(`${red(bold('error'))} ${message}`)
}

function info(message: string): void {
  console.log(`${blue(bold('info'))} ${message}`)
}

function success(message: string): void {
  console.log(`${green(bold('success'))} ${message}`)
}

export const log = {
  error,
  info,
  success
}
