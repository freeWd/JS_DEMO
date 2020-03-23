const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/script/index.js"
  },
  output: {
    publicPath: "/",
    path: path.join(__dirname, "dist"),
    filename: "[name]:[hash:8].js"
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          chunks: "initial",
          name: 'commons',
          minSize: 0,//最小提取字节数
          minChunks: 1, //最少被几个chunk引用
          priority: -20,
          reuseExistingChunk: true//    如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html"
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "./dist"),
    host: "localhost",
    port: 3333,
    hot: true
  }
};
