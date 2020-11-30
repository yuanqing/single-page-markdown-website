const path = require('path')

module.exports = {
  entry: './src/ts/script.ts',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, '..', 'single-page-markdown-website', 'build')
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
