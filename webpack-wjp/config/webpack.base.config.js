const { resolve, join } = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HappyPack = require('happypack');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const config = require('../wjp.config');

// 外部配置设置通用配置
const commonConfig = {};
// 配置输出文件名
if (config.name) {
  commonConfig.output = {
    path: resolve(__dirname, '../dist'),
    filename: `js/${config.name}.[contenthash:10].js`
  };
  // 判断是否是watch模式
  if (process.env.ENV === 'watch') {
    commonConfig.output.filename = `js/${config.name}.js`;
    commonConfig.watch = true;
  }
}

const baseConfig = {
  entry: './src/index',
  output: {
    path: resolve(__dirname, '../dist'),
    filename: 'js/[name].[contenthash:10].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['happypack/loader?id=babel']
      },
      {
        test: /.(png|jpg|gif|svg|pdf)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name].[hash:10].[ext]',
            limit: 10240
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin(),
    new HappyPack({
      id: 'babel',
      loaders: [
        {
          loader: 'babel-loader'
        }
      ],
      threads: 5
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [{
        module: 'lodash',
        entry: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.js',
        global: '_'
      }]
    })
  ],
  resolve: {
    alias: {
      pages: join(__dirname, '../src/pages')
    },
    extensions: ['.js', '.jsx']
  }
};

module.exports = merge(baseConfig, commonConfig);