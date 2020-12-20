# Single Page Markdown Website [![npm Version](https://img.shields.io/npm/v/single-page-markdown-website?cacheSeconds=1800)](https://www.npmjs.com/package/single-page-markdown-website) [![build](https://github.com/yuanqing/single-page-markdown-website/workflows/build/badge.svg)](https://github.com/yuanqing/single-page-markdown-website/actions?query=workflow%3Abuild)

> Create a single page website from one or more Markdown files

## Quick start

*Requires [Node.js](https://nodejs.org).*

```sh
$ npx single-page-markdown-website '*.md' --open
```

The above command does the following:

- Concatenates the given globs of Markdown files (`'*.md'`) and renders the result as a single page website to `build/index.html`.
- Copies any referenced local image files to the `build/images` directory.
- Opens the rendered page in your default web browser (because of the `--open` flag).

## Configuration

Configuration is via the **`"single-page-markdown-website"`** key of your `package.json` file.

### Example

```json
{
  "single-page-markdown-website": {
    "title": "Single Page Markdown Website",
    "description": "Create a single page website from a directory of Markdown files",
    "toc": true,
    "sections": true,
    "links": [
      {
        "text": "GitHub",
        "url": "https://github.com/yuanqing/single-page-markdown-website"
      }
    ]
  }
}
```

### Options

Single Page Markdown Website works without configuration out of the box; all configuration options are optional.

#### `"title"`

(*`string`*)

The title of the page.

- Defaults to `packageJson.name`

#### `"description"`

(*`string`*)

The `meta` description of the page.

- Defaults to `packageJson.description`

#### `"toc"`

(*`boolean`*)

Whether to render a Table of Contents.

- Defaults to `true`

#### `"sections"`

(*`boolean`*)

Whether to render section shortcuts in the menu.

- Defaults to `true`

Sections are the level-one headers (`# `) in the Markdown. If there is only one level-one header, then sections are the level-two headers (`## `).

#### `"links"`

(*`Array<{ text: string, url: string }>`*)

A list of links to add to the menu.

- Defaults to `[{ text: 'GitHub', url: packageJson.homepage }]`

## CLI

<!-- ``` markdown-interpolate: ts-node --project packages/single-page-markdown-website/tsconfig.json packages/single-page-markdown-website/src/cli.ts --help -->
```

  Create a single page website from one or more Markdown files.

  Usage:
    $ single-page-markdown-website <files> [options]

  Arguments:
    <files>  One or more globs of Markdown files. Defaults to 'README.md'.

  Options:
    -h, --help     Print this message.
    -p, --open     Whether to open the generated page in the default web
                   browser. Defaults to 'false'.
    -o, --output   Set the output directory. Defaults to './build'.
    -v, --version  Print the version.
    -w, --watch    Whether to watch for changes and regenerate the page.
                   Defaults to 'false'.

  Examples:
    $ single-page-markdown-website
    $ single-page-markdown-website '*.md'
    $ single-page-markdown-website --open
    $ single-page-markdown-website --output dist
    $ single-page-markdown-website --watch

```
<!-- ``` end -->

## Tips

### Embedding files

Use the following syntax to embed a local file `bar.md` in your Markdown:

```

./bar.md

```

Note the `./` prefix and the empty lines immediately before and after. The path is resolved relative to the directory containing the current file.

### Deploying to GitHub Pages

To host your single page website on [GitHub Pages](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), either:

1. Commit and push the `./build` directory. Then, set the `build` directory as the publishing source in your GitHub repository settings.

2. Use the [`gh-pages`](https://github.com/tschaub/gh-pages) CLI to deploy the `./build` directory:

    ```sh
    $ npx gh-pages --dist build
    ```

    Then, set the `gh-pages` branch as the publishing source in your GitHub repository settings.

## License

MIT
