const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWehpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/04-index.js",
  output: {
    publicPath: "./",
    path: path.join(__dirname, "dist"),
    filename: "[name]:[hash:8].js"
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [["import", { library: "lodash" }]]
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, "dist")]
    }),
    new HtmlWehpackPlugin({
      filename: "inde.html"
    })
  ]
};
