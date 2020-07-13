const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { HotModuleReplacementPlugin, NamedModulesPlugin } = require("webpack");

module.exports = {
  entry: {
    pageA: "./src/script/pageA.js",
    pageB: "./src/script/pageB.js",
    pageC: "./src/script/pageC.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[hash:8].js"
  },
  optimization: {
    splitChunks: {
      chunks: "all",// 默认作用于异步chunk，值为all/initial/async
      minSize: 30000,  // 默认值是30kb,代码块的最小尺寸
      minChunks: 1,  // 被多少模块共享,在分割之前模块的被引用次数
      maxAsyncRequests: 5,  // 按需加载最大并行请求数量
      maxInitialRequests: 3,  // 一个入口的最大并行请求数量
      name: true,  // 打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~
      automaticNameDelimiter:'~',// 默认webpack将会使用入口名和代码块的名称生成命名,比如 'vendors~main.js'
      cacheGroups: { // 缓存组可以继承和/或覆盖splitChunks中的任何选项。但只能在缓存组级别上配置测试，优先级和reuseExistingChunk。 要禁用任何默认缓存组，请将它们设置为false。
        // 设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
        // 公共代码块
        commons: {
          chunks: "initial",
          name: "commons",
          minSize: 0, //最小提取字节数
          minChunks: 1, //最少被几个chunk引用
          priority: -20,
          reuseExistingChunk: true // 如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
        },
        // 第三方代码块
        vendors: {
          chunks: "initial",
          name: "vendors", // 可以通过'name'配置项来控制切割之后代码块的命名,给多个分割之后的代码块分配相同的名称,所有的vendor 模块被放进一个共享的代码块中,不过这会导致多余的代码被下载所以并不推荐
          test: /node_modules/, // 条件
          priority: -10 // 优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
        }
      }
    },
    //runtime包含:在模块交互时,连接模块所需的加载和解析逻辑。包括浏览器中的已加载模块的连接，以及懒加载模块的执行逻辑.
    //设置optimization.runtimeChunk=true ,将每一个入口添加一个只包含runtime的额外代码块.然而设置值为single,只会为所有生成的代码块创建一个共享的runtime文件.runtime:连接模块化应用程序的所有代码.
    // runtimeChunk: {
    //   name: "manifest"
    // }
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
      filename: "pageA.html",
      chunks: ["pageA"]
    }),
    new HtmlWebpackPlugin({
      template: "./src/index1.html",
      filename: "pageB.html",
      chunks: ["pageB"]
    }),
    new HtmlWebpackPlugin({
      template: "./src/index1.html",
      filename: "pageC.html",
      chunks: ["pageC"]
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
  }
};
