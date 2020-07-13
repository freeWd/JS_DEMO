const path = require("path");
const DllReferencePlugin = require("webpack/lib/DllReferencePlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require("glob");
const PurgecssPlugin = require("purgecss-webpack-plugin");

// 配置dll自动将dll.js文件插入打包后的html中
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

const HappyPack = require("happypack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["happypack/loader?id=js"]
      },
      {
        test: /\.css/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: true
          }
        }, "happypack/loader?id=css"]
      }
    ]
  },
  plugins: [
    new HappyPack({
      //ID是标识符的意思，ID用来代理当前的happypack是用来处理一类特定的文件的
      id: "js",
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      ]
    }),
    new HappyPack({
      //ID是标识符的意思，ID用来代理当前的happypack是用来处理一类特定的文件的
      id: "css",
      use: [
        {
          loader: "css-loader"
        }
      ],
      // threads: 4, //你要开启多少个子进程去处理这一类型的文件
      verbose: true //是否要输出详细的日志 verbose
    }),

    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "base.html"
    }),

    new MiniCssExtractPlugin({
      filename: "[name].[hash:8].css",
      chunkFilename: "[id].css"
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${path.join(__dirname, "src")}/**/*`, { nodir: true }) // 不匹配目录，只匹配文件
    }),

    new DllReferencePlugin({
      manifest: path.resolve(__dirname, "dist", "react.manifest.json")
    }),
    new AddAssetHtmlPlugin({ filepath: require.resolve("./dist/react_dll.js") })
  ]
};
