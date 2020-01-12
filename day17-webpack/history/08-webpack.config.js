// webpack4 内部有一个事件流， tapable
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 提取出css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 对css文件内容压缩
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },

  // entry存放对象的话就是多入口 - 一个entry对应一个chunk（对应多个module）
  // 先找到每个入口(entry)，从各个入口分别出发，找到依赖的模块(module)，然后生成一个代码块（chunk）- 代码块中可能包含很多模块
  // 最后把chunk文件写到文件系统中，就是资源（Assets）
  entry: "./src/main.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[hash:8].js" //打包后的文件名，[name]取entry的文件名 - 未指定时默认文件名是main
  },

  // prod模式最好不要将map文件放到线上
  devtool: "source-map", // 单独文件 能定位到哪一列出错了
  // devtool: 'cheap-module-source-map', // 单独文件 体积更小，只能定位到行
  // devtool: 'eval-source-map', // 不生成单独文件 ，映射放在源码所在文件中
  // devtool: 'cheap-module-eval-source-map', // 不生成单独文件，只定位到行

  //默认false,也就是不开启 - 开启后打包命令行默认不退出，每次修改文件会再次自动打包
  watch: true,
  //只有开启监听模式时，watchOptions才有意义
  watchOptions: {
    //默认为空，不监听的文件或者文件夹，支持正则匹配
    ignored: /node_modules/,
    //监听到变化发生后会等300ms再去执行，默认300ms
    aggregateTimeout: 300,
    //判断文件是否发生变化是通过不停的询问文件系统指定议是有变化实现的，默认每秒问1000次
    poll: 1000
  },

  // loader有三种写法
  /**
   * use
   * loader
   * use + loader
   */
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|gif)/,
        use: [
          {
            loader: "url-loader",
            options: {
              outputPath: "images",
              limit: 10 * 1024, // 将小于10k的图片转化为base64编码
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.less/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true
            }
          },
          "css-loader",
          "less-loader"
        ]
      },
      {
        test: /\.scss/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true
            }
          },
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.css/, // 转化文件的匹配正则
        // css-loader: 用来解析处理css文件中的url路径 & 把css文件变成模块
        include: path.join(__dirname, "./src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true
              // publicPath: '../'  // 影响 css中 url的路径
            }
          },
          "css-loader",
          "postcss-loader" // 给不同核浏览器的css属性自动添加不同的前缀
        ]
      },
      {
        // 处理html中image src的路径引用
        test: /\.(html|htm)/,
        loader: "html-withimg-loader"
      },
      {
        // 编译es6 es7的代码
        test: /\.js/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              ["@babel/plugin-transform-runtime"]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    // 放入插件的实例
    // 在构建之前清除dist中老的文件
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, "dist")]
    }),

    new webpack.ProvidePlugin({
      $: "jquery"
    }),

    // 此插件可以在打包的文件夹中产生html文件
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 指定用作产出的html模板, 不指定的话也会自动创建一个最简单的html
      filename: "index.html", // 产出的html文件名
      title: "html模板的标题 - index",
      hash: true, // 如果每次打包的js文件名称不变，会在引入的js里面加入查询字符串规避缓存问题 - src="bundle.js?3bcc2913511b2549764a",
      minify: {
        removeAttributeQuotes: true
      }
    }),

    new MiniCssExtractPlugin({
      filename: "styles/[name].[hash:8].css", // filename 打包入口文件
      chunkFilename: "[id].css", // chunkFilename 用来打包import('module')方法中引入的模块
      ignoreOrder: false // 启用删除有关冲突顺序的警告
    })
  ],
  // 配置此静态文件服务器，可以预览打包后的项目  webpack-dev-server 启动的项目 打包的文件存储在内存而不是硬盘中
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    host: "localhost",
    port: 8080,
    compress: true // 服务端是否启动gzip
  }
};
