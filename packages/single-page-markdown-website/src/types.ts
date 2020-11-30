export type CliOptions = {
  output: null | string
}

export type Config = {
  title: null | string
  hiddenTocHeadings: Array<string>
}

export type MarkdownFile = {
  filePath: string
  weight: number
  content: string
}
