module.exports = {
  entry: {
    // 第一个打包，打包出commonjs的最简单的代码
    // "01-common-main": './01-commonjs/common-main.js'

    // 第二个打包，打包出ES module的最简单的代码
    // "02-es-main": "./02-esmodule/es-main.js",

    // 第三个打包 打包出异步导入的最简单的代码
    "03-async-import": "./03-async-import/async-main.js"
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
