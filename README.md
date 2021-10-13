![Single-Page Markdown Website](media/single-page-markdown-website.svg)

> Create a nice single-page documentation website from one or more Markdown files

# Features

- Zero configuration
- Render a table of contents, shortcuts to the top-level sections, and custom links
- Include the contents of other Markdown files using a special syntax
- Responsive from mobile and up
- Dark mode

# Quick start

*Requires [Node.js](https://nodejs.org).*

```sh
$ npx --yes -- single-page-markdown-website '*.md' --open
```

The above command does the following:

- Concatenates the given globs of Markdown files (`'*.md'`) and renders the result as a single-page website to `build/index.html`.
- Copies any local image file referenced in the Markdown to `build/images`.
- Opens the rendered page in your default web browser.

# Configuration

Configuration is via the **`"single-page-markdown-website"`** key of your `package.json` file.

- Single-Page Markdown Website works without configuration out of the box; all configuration options are optional.
- Some configuration options default to values specified in your `package.json` or `lerna.json`.

```json
{
  "single-page-markdown-website": {
    "baseUrl": "https://yuanqing.github.io/single-page-markdown-website/",
    "title": "Single-Page Markdown Website",
    "description": "Create a nice single-page documentation website from one or more Markdown files",
    "toc": true,
    "sections": true,
    "links": [
      {
        "text": "GitHub",
        "url": "https://github.com/yuanqing/single-page-markdown-website"
      }
    ],
    "faviconImage": "media/favicon.svg",
    "shareImage": "media/share.png"
  }
}
```

## `"baseUrl"`

(*`null`* or *`string`*)

The base URL of the single-page website.

- Defaults to `null`

## `"title"`

(*`null`* or *`string`*)

The title of the page.

- Defaults to `packageJson.name`, else `null`

## `"description"`

(*`null`* or *`string`*)

The `meta` description of the page.

- Defaults to `packageJson.description`, else `null`

## `"toc"`

(*`boolean`*)

Whether to render a Table of Contents.

- Defaults to `true`

## `"sections"`

(*`boolean`*)

Whether to render sections shortcuts in the menu. (Sections are the level-one headers (`# `) in the Markdown.)

- Defaults to `true`

## `"links"`

(*`Array<{ text: string, url: string }>`*)

A list of links to add to the menu.

- Defaults to `[{ text: 'GitHub', url: packageJson.homepage }]`, else `null`

## `"faviconImage"`

(*`null`* or *`string`*)

The URL or file path of the favicon image to use.

- Defaults to `null`

## `"shareImage"`

(*`null`* or *`string`*)

The URL or file path of the share image to use.

- Defaults to `null`

## `"version"`

(*`null`* or *`string`*)

The version number to show beside the title.

- Defaults to `v${lernaJson.version}`, else `v${packageJson.version}`, else `null`

# Tips

## Including files

Use the following syntax to include the entire contents of a local file `foo.md` in your Markdown:

```

./foo.md

```

Note that an empty line is required immediately before and after the file path.

- If the `./` prefix is used, then the file path is resolved relative to the current Markdown file.
- If the `/` prefix is used, then the file path is resolved relative to the current working directory (ie. `process.cwd()`).

You can also specify a glob to include multiple files:

```

./bar/*.md

```

## Deploying to GitHub Pages

Deploy your single-page website to [GitHub Pages](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) via one of the following two ways:

1. Commit the `./build` directory and push your changes. Then, set the `./build` directory as the publishing source in your GitHub repository settings.

2. Use the [`gh-pages`](https://github.com/tschaub/gh-pages) CLI to deploy the `./build` directory to the `gh-pages` branch:

    ```sh
    $ npx --yes -- gh-pages --dist build
    ```

    Then, set the `gh-pages` branch as the publishing source in your GitHub repository settings.

# CLI

<!-- ``` markdown-interpolate: node packages/single-page-markdown-website/lib/cli.js --help -->
```

  Create a nice single-page documentation website from one or more Markdown files.

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
