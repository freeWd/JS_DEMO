// webpack4 内部有一个事件流， tapable
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: ["./src/index.js", "./src/base.js"], // 多个文件都会打包到一个文件中 - bundle.js
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[hash:8].js" //打包后的文件名，[name]取entry的文件名 - 未指定时默认文件名是main
  },
  module: {
    rules: [
      {
        test: /\.css/, // 转化文件的匹配正则
        // css-loader: 用来解析处理css文件中的url路径 & 把css文件变成模块
        // style-loader: 用来将css文件变成style标签插入head中
        loader: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [ // 放入插件的实例
    // 在构建之前清除dist中老的文件
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'dist')],
    }),
    // 此插件可以在打包的文件夹中产生html文件
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 指定用作产出的html模板, 不指定的话也会自动创建一个最简单的html
      filename: "index.html", // 产出的html文件名
      title: 'html模板的标题',
      hash: true, // 如果每次打包的js文件名称不变，会在引入的js里面加入查询字符串规避缓存问题 - src="bundle.js?3bcc2913511b2549764a"
    })
  ],
  // 配置此静态文件服务器，可以预览打包后的项目  webpack-dev-server 启动的项目 打包的文件存储在内存而不是硬盘中
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    host: "localhost",
    port: 8080,
    compress: true // 服务端是否启动gzip
  }
};
