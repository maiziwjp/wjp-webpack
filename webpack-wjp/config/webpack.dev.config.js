const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { resolve } = require('path');
const HappyPack = require('happypack');
const commonConfig = require('./webpack.base.config.js');

const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  watchOptions: {
    aggregateTimeout: 600,
    ignored: ['/study', '/node_modules/'],
    poll: 1000, // 每秒检查一次变动
  },
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    writeToDisk: true,
    port: 8086,
    open: true,
    compress: true
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['happypack/loader?id=less']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new HappyPack({
      id: 'less',
      loaders: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                require('autoprefixer')
              ]
            }
          }
        },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true
            }
          }
        }
      ],
      threads: 3
    })
  ]
};

module.exports = merge(commonConfig, devConfig);