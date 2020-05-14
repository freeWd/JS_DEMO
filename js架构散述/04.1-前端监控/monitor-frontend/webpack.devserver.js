const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname),
    filename: "[name]-monitor.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: "/.js/",
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/transform-runtime"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      title: "html模板的标题 - index",
      hash: true,
      inject: 'head',
      minify: {
        removeAttributeQuotes: true,
      },
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname),
    host: "localhost",
    port: 8080,
    compress: true,
  },
};
