export interface Options extends Config {
  outputDirectory: string
  open: boolean
}

export interface Config {
  baseUrl: null | string
  description: null | string
  faviconImage: null | string
  links: Array<Link>
  sections: boolean
  shareImage: null | string
  title: null | string
  toc: boolean
  version: null | string
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
