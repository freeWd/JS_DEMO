const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { HotModuleReplacementPlugin, NamedModulesPlugin } = require("webpack");
const webpack = require("webpack");


module.exports = {
  entry: "./src/script/index1.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[hash:8].js"
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      },
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
      template: "./src/index1.html",
      filename: "index.html",
    }),

    // 开启 Scope Hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),

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
  }
};
