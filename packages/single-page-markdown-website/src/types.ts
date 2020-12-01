export interface Options extends Config {
  outputDirectory: string
}

export interface Config {
  hiddenTocHeadings: Array<string>
  title: null | string
}

export type MarkdownFile = {
  content: string
  filePath: string
  weight: number
}
