const path = require("path");
const DonePlugin = require("./self/plugin-done");
const AssetPlugin = require("./self/plugin-asset")
const ZipPlugin = require("./self/plugin-zip")

module.exports = {
  entry: {
    main: "./main.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.[hash:5].js",
  },
  // 可以使用 resolveLoader.modules 配置，webpack 将会从这些目录中搜索这些 loaders
  //   resolveLoader: {
  //     modules: [path.resolve('./self'), 'node_modules']
  //   },
  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          {
            loader: path.resolve(__dirname, "./self/loader-file.js"),
            // options: { filename: path.resolve(__dirname, './banner.txt') }
          },
        ],
      },
    ],
  },
  plugins: [
    new DonePlugin({name: 'hello world'}),
    new AssetPlugin(),
    new ZipPlugin({filename: 'demo.zip'})
  ]
};
