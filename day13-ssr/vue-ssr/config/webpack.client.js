let merge = require('webpack-merge');
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

let base = require('./webpack.base');

// module.exports = merge(base, {
//     // 入口
//     entry: {
//         client: path.resolve(__dirname, '../src/client-entry.js')
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             filename: 'index.html',
//             template: path.resolve(__dirname, '../public/index.html')
//         }) 
//     ]
// });


module.exports = merge(base, {
    // 入口
    entry: {
        client: path.resolve(__dirname, '../src/client-entry.js')
    },
    plugins: [
        // 把public目录下的index-ssr内容拷贝到dist目录
        new HtmlWebpackPlugin({
            filename: 'index-ssr.html',
            template: path.resolve(__dirname, '../public/index-ssr.html'),
            excludeChunks: ['server']
        }) 
    ]
});