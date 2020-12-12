export interface Options extends Config {
  outputDirectory: string
}

export interface Config {
  title: null | string
  description: null | string
  hideToc: boolean
}

export type MarkdownFile = {
  content: string
  filePath: string
  weight: number
}
