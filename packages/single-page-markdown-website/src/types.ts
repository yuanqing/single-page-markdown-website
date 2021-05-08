export interface Options extends Config {
  outputDirectory: string
  open: boolean
}

export interface Config {
  baseUrl: null | string
  title: null | string
  description: null | string
  toc: boolean
  sections: boolean
  links: Array<Link>
  socialMediaPreviewImage: null | string
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
