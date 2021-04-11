const path = require('path')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = function (_, argv) {
  const isProduction = argv.mode === 'production'
  return {
    devtool: isProduction === true ? undefined : 'eval-cheap-source-map',
    entry: './src/ts/script.ts',
    mode: argv.mode,
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.ts$/,
          use: 'ts-loader'
        }
      ]
    },
    optimization: {
      minimize: isProduction,
      minimizer: [new TerserWebpackPlugin()]
    },
    output: {
      filename: 'script.js',
      path: path.resolve(__dirname, 'lib')
    },
    resolve: {
      extensions: ['.ts']
    }
  }
}
