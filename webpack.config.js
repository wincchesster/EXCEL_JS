const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const sass = require('sass')
const path = require('path')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

console.log('is prod', isProd)
console.log('is dev', isDev)

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`


module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: ['@babel/polyfill','./index.js'],
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname,'src'),
            '@core': path.resolve(__dirname,'src/core')
        }
    },

    //source-map does not work
    devtool: isProd ? 'source-map' : false,
    devServer: {
        port: 3000,
        hot: isDev
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd
            }
        }),
        new CopyPlugin({
            patterns: [
              { 
                  from: path.resolve(__dirname, 'src/favicon.ico'), 
                  to: path.resolve(__dirname, 'dist')
              },
            ],
          }),
          new CleanWebpackPlugin(),
          new MiniCssExtractPlugin({
              filename: filename('css')
          }),

    ],
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    hmr: isDev,
                    reloadAll: true
                }
              },
              'css-loader',
              'sass-loader'
            ],
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      }

} 