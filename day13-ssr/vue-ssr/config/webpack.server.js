let base = require('./webpack.base');
let merge = require('webpack-merge');
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = merge(base, {
    target: 'node', // 打包的结果给node使用，如果不加这个配置，像fs等也会被打包
     entry: {
        server: path.resolve(__dirname, '../src/server-entry.js')
    },
    output: {
        // 打包出来不是使用闭包函数 而是module.export = server.entry.js.... 这样的nodejs的用法
        libraryTarget: 'commonjs2'
    }
    // plugins: [
    //     // 把public目录下的index-ssr内容拷贝到dist目录
    //     new HtmlWebpackPlugin({
    //         filename: 'index-ssr.html',
    //         template: path.resolve(__dirname, '../public/index-ssr.html'),
    //         excludeChunks: ['server']
    //     }) 
    // ]
});