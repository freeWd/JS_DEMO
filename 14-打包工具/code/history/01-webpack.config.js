// webpack4 内部有一个事件流， tapable
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css/, // 转化文件的匹配正则
        // css-loader: 用来解析处理css文件中的url路径 & 把css文件变成模块
        // style-loader: 用来将css文件变成style标签插入head中
        // 多个loader的加载有顺序的要求，从右往左写，因为转化的时候是从右向左执行的
        loader: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [],
  // 配置此静态文件服务器，可以预览打包后的项目  webpack-dev-server 启动的项目 打包的文件存储在内存而不是硬盘中
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    host: "localhost",
    port: 8080,
    compress: true // 服务端是否启动gzip
  }
};
