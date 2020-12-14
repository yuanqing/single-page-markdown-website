export interface Options extends Config {
  outputDirectory: string
}

export interface Config {
  title: null | string
  description: null | string
  toc: boolean
  sections: boolean
  links: Array<Link>
}

export interface Link {
  text: string
  url: string
}

export type MarkdownFile = {
  content: string
  filePath: string
  weight: number
}

export type Images = {
  [key: string]: string
}
