> 目前市面上常见到的一些管理工具：
1 webpack - 目前垄断主流 - 包管理工具 （核心loader）
2 rollupjs - 可以稍微关注，比较新的工具,可以将小块代码编译成大块复杂的代码，一般非业务的库性质的代码更适合使用它
3 gulp / grunt (同一时期的，gulp基于流，更快，适合打包node，比较干净)
4 yeoman 从0开始的脚手架-项目构建工具
5 brower 管理安装依赖包
6 browserify 能让前端使用由它build之后的node端的js文件

一个文件就是一个chunk, chunk和module是多对多的关系 

## webpack
WebPack可以看做是模块打包机：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其打包为合适的格式以供浏览器使用。

了解一些常见的概念：
- module：对于webpack来说，所有的资源(.js、.css、.png)都是module
- chunk：是webpack内部`运行时`的概念；一个chunk是对依赖图的部分进行封装的结果。这是webpack内部的一个特殊定义的词语，用于描述webpack打包过程的模块文件叫做chunk,例如异步加载一个模块就是一个chunk
- bundle: bundle是最后打包后的文件(bundles 包含了早已经过加载和编译的最终源文件版本),最终文件可以和chunk长的一模一样,但是部分情况下他是多个chunk的集合。

eg:
```js
{
  entry: {
    foo: ['webpack/hot/only-dev-server.js', './src/foo.js'],
    bar: ['./src/bar.js']
  },
  output: {
    path: './dist',
    filename: '[name].js'
  }
}
// 上面的例子中只提供了入口文件的配置,操作了三个模块,输出了两个文件.
// Modules: webpack/hot/only-dev-server.js, ./src/foo.js, ./src/bar.js 以及他们内部深入引用的其他文件
// Chunks: foo, bar
// Bundles: foo, bar (如何三个文件中没有引入其他文件，那么bundles和chunk的内容一致)
// 为了优化最后生产出的bundle数量可能不等于chunk的数量因为有可能多个chunk被组合到了一个Bundle中
```


可以做的事情：
> 代码转换， 文件优化， 代码分割，模块合并，自动刷新，代码校验，自动发布

> npm install webpack webpack-cli -D

**配置文件webpack.config.js**
- entry：配置入口文件的地址
- output：配置出口文件的地址
- module：配置模块,主要用来配置不同文件的加载器
- plugins：配置插件
- devServer：配置开发服务器

所有的配置信息请参考history文件夹 和 http://www.zhufengpeixun.cn/2020/html/26.webpack-1-basic.html

历史文件的检索：
- 01-webpack.config.js
    ```js
    // 第一个webpack配置文件，一个入口文件index.js, js中导入css文件
    // 使用css-loader解析css为模块，用来解析处理css文件中的url路径 & 把css文件变成模块(临时)
    // 使用style-loader - 在执行js时将css以<style></style>方式插入html中
    // devServer 配置webpack-dev-server，将文件打包到内存中以http方式访问
    // 没有index.html文件 需要手动创建
    ```

- 02-webpack.config.js
    ```js
    // 使用了HtmlWebpackPlugin插件，用于在打包后的dist文件夹中生成html文件
    // 插件的一些配置，包括 hash, title - <%= htmlWebpackPlugin.options.title %>
    ```

- 03-webpack.config.js
    ```js
    // 新增CleanWebpackPlugin插件的使用，在每次打包之前自动删除上次打包文件夹中的内容
    ```

- 04-webpack.config.js
    ```js
    // 多入口文件，key对应打包后的[name], 之前单文件打包默认为main
    // 多文件对应的HtmlWebpackPlugin也需要new多此，可以直接for, 注意HtmlWebpackPlugin中的chunks配置
    // webpack.ProvidePlugin 插件用于打包第三方库为全局的变量
    // require('expose-loader?$!jquery'); expose-loader也能打包第三方库 
    ```
- 05-webpack.config.js
    ```js
    // 使用file-loader 或者 css-loader 和 html-withimg-loader 处理image等静态资源
    // file-loader 解析图片的地址，把图片从源路径中拷贝到目标位置, 可以处理任意的二进制，包括字体等文件
    // url-loader处理图片
    // html-withimg-loader 处理html中src图片文件路径

    // TIPS:
    // file-loader vs url-loader ? url-loader内置了file-loader
    // url-loader工作分两种情况：1.文件大小小于limit参数，url-loader将会把文件转为DataURL；2.文件大小大于limit，url-loader会调用file-loader进行处理，参数也会直接传给file-loader。因此我们只需要安装url-loader即可
    ```

- 06-webpack.config.js
    ```js
    // mini-css-extract-plugin 提取出css文件 - 在plugins中new MiniCssExtractPlugin, 同时module处理css的loader中用 MiniCssExtractPlugin。 此插件用来替换 style-loader （因为它可以将css提取出来， style-loader只是将css通过style标签内置在html中）
    // (1) optimize-css-assets-webpack-plugin - OptimizeCSSAssetsPlugin
    // (2) terser-webpack-plugin - TerserJSPlugin 在optimization中压缩css和js文件
    ```
- 07-webpack.config.js
    ```js
    // less-loader, sass-loader 处理 less和sass文件
    // postcss-loader 给不同核浏览器的css属性自动添加不同的前缀, 注意要配置一个postcss.config.js配置文件
    ```
- 08-wenpack.config.js
    ```js
    // babel-loader @babel/preset-env @babel/preset-stage-0 处理es6 代码
    // babel-plugin-transform-runtime 默认情况下会被添加到每一个需要它的文件中。你可以引入 @babel/runtime 作为一个独立模块，来避免重复引入 
    ```

- 09-webpack.config.js
    ```js
    // copy-webpack-plugin 拷贝静态文件 - 有时项目中没有引用的文件也需要打包到目标目录
    // watch 当代码发生修改后可以自动重新编译
    ```


image-webpack-loader可以帮助我们对图片进行压缩和优化
ts-loader - 转化typescript代码

