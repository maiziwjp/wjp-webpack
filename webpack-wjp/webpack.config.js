const portFinder = require('portfinder');
const { join } = require('path');
const { merge } = require('webpack-merge');
const devConfig = require('./config/webpack.dev.config.js'); // 开发环境下的配置文件
const prodConfig = require('./config/webpack.prod.config.js'); // 生产环境下的配置文件
const config = require('./wjp.config');

// 外部配置设置通用配置
let commonConfig = {};
// 配置alias
if (config.alias) {
    let alias = {};
    Object.keys(config.alias).map(item => {
        alias[item] = join(process.cwd(), config.alias[item])
    })
    commonConfig.resolve = {
        alias: alias,
        extensions: ['.js', '.jsx']
    };
}

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        portFinder.getPort({ port: 8000, stopPort: 9999 }, function (err, port) {
            if (!err) {
                devConfig.devServer.port = port;
            }
        });
        return merge(devConfig, commonConfig);
    } else {
        return merge(prodConfig, commonConfig);
    }
};