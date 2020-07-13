const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { HotModuleReplacementPlugin, NamedModulesPlugin } = require('webpack');

module.exports = {
  entry: "./src/script/index1.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[hash:8].js"
  },
  module: {
    rules: [
      {
        test: /\.css/,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, "dist")]
    }),

    new HtmlWebpackPlugin({
        template: './src/index1.html',
        filename: 'index.html'
    }),

    new NamedModulesPlugin(),
    new HotModuleReplacementPlugin()
  ],
  devServer: {
    open: true,
    contentBase: path.join(__dirname, "dist"),
    host: "localhost",
    port: 8080,
    compress: true,
    // watchContentBase: true,
    hot: true // 启用 webpack 的模块热替换特性
  },
};
