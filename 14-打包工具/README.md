> 渔得鱼心满意足，樵得樵眼笑眉舒 - 胡祗遹 《沉醉东风》

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [webapck](#webapck)
  - [webpack 基本概念](#webpack-基本概念)
  - [webpack 使用](#webpack-使用)
  - [webpack 优化](#webpack-优化)
    - [提高开发过程的效率](#提高开发过程的效率)
    - [代码打包兼容性考虑](#代码打包兼容性考虑)
    - [减少 Webpack 打包时间](#减少-webpack-打包时间)
      - [尽量减小搜索的范围](#尽量减小搜索的范围)
      - [多进程处理](#多进程处理)
      - [定义 DLL](#定义-dll)
      - [其他优化](#其他优化)
    - [减少 Webpack 打包体积](#减少-webpack-打包体积)
      - [提取公共代码 (基础类库，方便长期缓存, 页面之间的公用代码)](#提取公共代码-基础类库方便长期缓存-页面之间的公用代码)
      - [动态导入和懒加载](#动态导入和懒加载)
      - [Scope Hoisting 作用域提升](#scope-hoisting-作用域提升)
      - [Tree Shaking](#tree-shaking)
    - [其他优化](#其他优化-1)

<!-- /code_chunk_output -->

从原始的刀耕火种时代，到 Gulp、Grunt 等早期方案的横空出世，随着前端整体的迅猛发展，逻辑的越来越复杂化。前端工程化是一个绕不过去的大话题，而在整个工程化中，打包构建又是重中之重

**目前市面上常见到的一些管理工具：**

1. webpack - 目前垄断主流 - 包管理工具 （核心是 loader）
2. rollupjs - 可以稍微关注，号称下一代打包工具,可以将小块代码编译成大块复杂的代码，一般非业务的库性质的代码更适合使用它
3. gulp / grunt (同一时期的，gulp 基于流，更快，适合打包 node，比较干净)
4. yeoman 从 0 开始的脚手架-项目构建工具
5. brower 管理安装依赖包
6. browserify 能让前端使用由它 build 之后的 node 端的 js 文件

可以重点关注 `webpack 和 rollupjs`

## webapck

### webpack 基本概念

WebPack 可以看做是模块打包机：它做的事情是，分析你的项目结构，找到 JavaScript 模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript 等），并将其打包为合适的格式以供浏览器使用。

了解 webpack 之前需要了解其对应的一些概念：（这样能更容易理解一些）

- module：对于 webpack 来说，所有的资源(.js、.css、.png)都是 module
- chunk：是 webpack 内部`运行时`的概念；一个 chunk 是对依赖图的部分进行封装的结果。这是 webpack 内部的一个特殊定义的词语，用于描述 webpack 打包过程的模块文件叫做 chunk,例如异步加载一个模块就是一个 chunk
- bundle: bundle 是最后打包后的文件(bundles 包含了早已经过加载和编译的最终源文件版本),最终文件可以和 chunk 长的一模一样,但是部分情况下他是多个 chunk 的集合。

- loader 应用于项目模块源代码的转换，它将按需对文件进行预处理或“加载”, 对文件进行特定的处理
- plugin 一个具有 apply 属性的 javascript 对象。apply 属性通过 webpack 编译器被调用，以访问整个整个编译生命周期。这些 Plugins 通常以一种或另一种方式扩展 webpack 的编译功能。 更复杂，深入到 webpack 不同的生命周期里面去执行更多的逻辑

![image](./images/build-relation.jpg)

`module` 就是没有被编译之前的代码，通过 webpack 的根据文件引用关系生成 `chunk` 文件，webpack 处理好 chunk 文件后，生成运行在浏览器中的代码 `bundle`

loader和plugin的区别:
- 对于loader，它是一个转换器，将A文件进行编译形成B文件，这里操作的是文件，比如将A.scss转换为A.css，单纯的文件转换过程
- plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务

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

webpack 主要能做的事情：

**代码转换， 文件优化， 代码分割，模块合并，自动刷新，代码校验，自动发布**

执行流程：

> Tip: Webpack 启动后会从 Entry 里配置的 Module 开始递归解析 Entry 依赖的所有 Module。 每找到一个 Module， 就会根据配置的 Loader 去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。 这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 Chunk。最后 Webpack 会把所有 Chunk 转换成文件输出。 在整个流程中 Webpack 会在恰当的时机执行 Plugin 里定义的逻辑

---

### webpack 使用

(1) 安装 webpack 包

```
npm install webpack webpack-cli -D
```

(2) 编写配置文件

**默认配置文件名：webpack.config.js**

- entry：配置入口文件的地址
- output：配置出口文件的地址
- module：配置模块,主要用来配置不同文件的加载器
- plugins：配置插件
- devServer：配置开发服务器
- optimization 打包内容的优化
- watch 当代码发生修改后可以自动重新编译

所有的配置信息请参考 history 文件夹 和 http://www.zhufengpeixun.cn/2020/html/26.webpack-1-basic.html

下面描述常见的使用场景和不同 loader，插件的作用；

**历史文件的检索：**

**(1) 01-webpack.config.js**

第一个 webpack 配置文件，一个入口文件 index.js, js 中导入 css 文件

使用`css-loader`解析 css 为模块，用来解析处理 css 文件中的 url 路径 & 把 css 文件变成模块(临时)

使用`style-loader` - 在执行 js 时将 css 以<style></style>方式插入 html 中

devServer 配置 webpack-dev-server，将文件打包到内存中以 http 方式访问

没有 index.html 文件 需要手动创建

多个 loader 的加载有顺序的要求，从右往左写，因为转化的时候是从右向左执行的

---

**(2) 02-webpack.config.js**

使用了`HtmlWebpackPlugin`插件，用于在打包后的 dist 文件夹中生成 html 文件

插件的一些配置，包括 `hash, title - <%= htmlWebpackPlugin.options.title %>`

---

**(3) 03-webpack.config.js**

新增`CleanWebpackPlugin`插件的使用，在每次打包之前自动删除上次打包文件夹中的内容

---

**(4) 04-webpack.config.js**

`多入口文件`，key 对应打包后的[name], 之前单文件打包默认为 main

多文件对应的 HtmlWebpackPlugin 也需要 new 多次，可以直接 for 循环, 注意 HtmlWebpackPlugin 中的`chunks`配置

当在多个不同的模块里面需要使用一个公共库的时候， 比如 jquery

- 方法一 （直接引入）在每个模块中 import \$ from 'jquery'; (这样不合适：每个 js 都很大)
- 方法二 插件引入 webpack 配置`new webpack.ProvidePlugin`后，在使用时将不再需要 import 和 require 进行引入，直接使用即可
- 方法三 `expose-loader` 不需要任何其他的插件配合，只要将下面的代码添加到所有的 loader 之前
  `require('expose-loader?$!jquery');`

---

**(5) 05-webpack.config.js**

`file-loader` 解析图片的地址，把图片从源路径中拷贝到目标位置, 可以处理任意的二进制，包括字体等文件

`url-loader` 和 file-loader 功能类似，也能处理图片

`html-withimg-loader` 处理 html 中 src 图片文件路径引用

TIPS: file-loader vs url-loader?

url-loader 内置了 file-loader
url-loader 工作分两种情况：

- 文件大小小于 limit 参数，url-loader 将会把文件转为 DataURL；
- 文件大小大于 limit，url-loader 会调用 file-loader 进行处理，参数也会直接传给 file-loader。
  **因此我们只需要安装 url-loader 即可**

---

(6) 06-webpack.config.js

`mini-css-extract-plugin` 将 css 文件提取出来

使用：

- 在 plugins 中`new MiniCssExtractPlugin`,
- 在 module 处理 css 的 loader 中用 MiniCssExtractPlugin。 **此插件用来替换 style-loader** （因为它可以将 css 提取出来， style-loader 只是将 css 通过 style 标签内置在 html 中）

`optimize-css-assets-webpack-plugin` 和 `terser-webpack-plugin`
optimization 中压缩 css 和 js 文件

---

(7) 07-webpack.config.js

`less-loader, sass-loader` 处理 less 和 sass 文件

`postcss-loader` 给不同核浏览器的 css 属性自动添加不同的前缀, 注意要配置一个`postcss.config.js`配置文
件

---

(8) 08-wenpack.config.js

`babel-loader @babel/preset-env`处理 es6 代码

`@babel/plugin-transform-runtime` 默认情况下会被添加到每一个需要它的文件中。你可以引入 `@babel/runtime` 作为一个独立模块，来避免重复引入

---

(9) 09-webpack.config.js

`copy-webpack-plugin` 拷贝静态文件 - 有时项目中没有引用的文件也需要打包到目标目录

`image-webpack-loader`可以帮助我们对图片进行压缩和优化

`ts-loader` - 转化 typescript 代码

---

### webpack 优化

关于打包的优化，在满足业务需求的前提下，要抓住下面几个基本点：

- 提高开发过程的效率
- 代码打包兼容性考虑
- 减少 Webpack 打包的时间
- 减小 Webpack 打包后文件的体积


#### **提高开发过程的效率**

HMR 不刷新页面的热加载

HMR 全称是 Hot Module Replacement，即模块热替换

区分 Hot Reloading 和 Hot Module Replacement 的区别？

- Hot Reloading，当代码变更时通知浏览器刷新页面，以避免频繁手动刷新浏览器页面
- HMR 可以理解为增强版的 Hot Reloading，但不用整个页面刷新，而是局部替换掉部分模块代码并且使其生

原理是当一个源码发生变化时，只重新编译发生变化的模块，再用新输出的模块替换掉浏览器中对应的老模块

代码：`code-optimization2/history/01-webpack.config.js`

```js
// index.js
if (module.hot) {
  // 默认接收所有文件的代码
   module.hot.accept();
}

// history/01-webpack.config.js
plugins: [
  // 该插件的作用就是实现模块热替换，实际上当启动时带上 `--hot` 参数，会注入该插件，生成 .hot-update.json 文件。
  new webpack.NamedModulesPlugin(), // 用于启动 HMR 时可以显示模块的相对路径
  new webpack.HotModuleReplacementPlugin(), // Hot Module Replacement 的插件
],
devServer:{
  // 告诉 DevServer 要开启模块热替换模式
  hot: true,
}
```

#### 代码打包兼容性考虑

区分环境 - 为开发和生成环境设置不同的打包配置

大体逻辑如下

- 一个`webpack.base.js`文件，配置通用性的 webpack 内容
- 根据不同的环境生成其对应独有的内容，比如`webpack.dev.config.js` 和 `webpack.prod.config.js`
- 使用`webpack-merge` 配置打包的 script，将不同环境的内容 merge 进来

代码路径：`code-optimization//webpack.base.js等`

#### **减少 Webpack 打包时间**

##### 尽量减小搜索的范围

- 善用 resolve 减少检测次数

  - extensions - 指定 extension 之后可以不用在 require 或是 import 的时候加文件扩展名,会依次尝试添加扩展名进行匹配
  - alias - 配置别名可以加快 webpack 查找模块的速度
  - modules - 对于直接声明依赖名的模块（如 react ），webpack 会类似 Node.js 一样进行路径搜索，搜索 node_modules 目录, 这个目录就是使用 resolve.modules 字段进行配置的 默认配置
  - mainFields 默认情况下 package.json 文件则按照文件中 main 字段的文件名来查找文件

  ```js
  // 常用的resolve配置项
  resolve: {
     // 创建 import 或 require 的别名，来确保模块引入变得更简单
     // 导入此模块时可以直接写成这样：import Utility from 'Utilities';
    alias:{
       Utilities: path.resolve(__dirname, 'src/utilities/')
    },

    // 用户在引入模块时不带扩展时，尝试按顺序解析这些后缀名 默认值是['.wasm', '.mjs', '.js', '.json']
    extensions: [".js",".jsx",".json",".css"],

    // 告诉 webpack 解析模块时应该搜索的目录 默认值是["node_modules"]
    // 可以添加一个目录到模块搜索目录，此目录优先于 node_modules/ 搜索
    modules: [path.resolve(__dirname, "src"), "node_modules"],

    // 此项配置在导入第三方模块时确认从package.json 中使用哪个字段导入模块, 默认值：['module', 'main']
    // 某第三方库的package.json:
    // {
    //  "browser": "build/upstream.js",
    //  "module": "index"
    // }
    mainFields: ['browser', 'module', 'main']
  }
  ```

* 优化 Loader 的文件搜索范围

  module 的 loader 的使用中 减少搜索范围 通过配置 `exclude 和 incluede`

  ```js
  // 对于 Babel 来说，我们肯定是希望只作用在 JS 代码上的，然后 node_modules 中使用的代码都是编译过的，所以我们也完全没有必要再去处理一遍。
  module.exports = {
    module: {
      rules: [
        {
          // js 文件才使用 babel
          test: /\.js$/,
          loader: "babel-loader",
          // 只在 src 文件夹下查找
          include: [resolve("src")],
          // 不会去查找的路径
          exclude: /node_modules/,
        },
      ],
    },
  };
  ```

  我们还可以将 Babel 编译过的文件缓存起来，下次只需要编译更改过的代码文件即可，这样可以大幅度加快打包时间
  `loader: 'babel-loader?cacheDirectory=true'`

##### 多进程处理

- HappyPack 快乐打包

  - 构建需要解析和处理文件,文件读写和计算密集型的操作太多后速度会很慢
  - Node.js 之上的 Webpack 是单线程模型
  - happypack 就能让 Webpack 把任务分解给多个子进程(js, css...)去并发的执行，子进程处理完后再把结果发送给主进程。
  - 查看代码文件 `code-optimization/history/03-webpack.config.js`

  ```js
    module: {
        loaders: [
            {
            test: /\.js$/,
            include: [resolve('src')],
            exclude: /node_modules/,
            // id 后面的内容对应下面
            loader: 'happypack/loader?id=happybabel'
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'happybabel',
            loaders: ['babel-loader?cacheDirectory'],
            // 开启 4 个线程
            threads: 4
        })
    ]
  ```

- thread-loader 也能启动相同的效果

  - 查看代码文件：`code-optimization/history/03-webpack.config-2.js`

##### 定义 DLL

.dll 为后缀的文件称为动态链接库，在一个动态链接库中可以包含给其他模块调用的函数和数据

- 把基础模块独立出来打包到单独的动态连接库里
- 当需要导入的模块在动态连接库里的时候，模块无需再次被打包，而是去动态连接库里获取

例子代码：

`code-optimization/history/02-webpack.dll.config.js`

`code-optimization/history/02-webpack.config.js`

使用：

- DllPlugin 插件： 用于打包出一个个动态连接库
- DllReferencePlugin: 在配置文件中引入 DllPlugin 插件打包好的动态连接库
- AddAssetHtmlWebpackPlugin: 配置 dll 时自动将 dll.js 文件插入打包后的 html 中

如果我们是一个 react 项目，想要将 react, react-dom 单独打包出来

```js
// 单独配置在一个文件中
// webpack.dll.conf.js
const path = require("path");
const webpack = require("webpack");
module.exports = {
  entry: {
    // 想统一打包的类库
    react: ["react", "react-dom"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].dll.js",
    library: "[name]-[hash]",
  },
  plugins: [
    new webpack.DllPlugin({
      // name 必须和 output.library 一致
      name: "[name]-[hash]",
      // 该属性需要与 DllReferencePlugin 中一致
      context: __dirname,
      path: path.join(__dirname, "dist", "[name]-manifest.json"),
    }),
  ],
};
```

然后我们需要执行这个配置文件生成依赖文件，接下来我们需要使用 DllReferencePlugin 将依赖文件引入项目中

```js
// webpack.conf.js
module.exports = {
  // ...省略其他配置
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      // manifest 就是之前打包出来的 json 文件
      manifest: require('./dist/vendor-manifest.json'),
    }),
    new AddAssetHtmlPlugin({ filepath: require.resolve('./dist/react.dll.js') })
  ]
}


// 使用add-asset-html-webpack-plugin后 html中会自动插入
<script src="react.dll.js"></script>
<script src="bundle.js"></script>
```

##### 其他优化

- module.noParse：如果你确定一个文件下没有其他依赖，就可以使用该属性让 Webpack 不扫描该文件，这种方式对于大型的类库很有帮助

#### 减少 Webpack 打包体积

##### 提取公共代码 (基础类库，方便长期缓存, 页面之间的公用代码)

大网站如果是有多个页面的，每个页面由于采用相同技术栈和样式代码，会包含很多公共代码，如果都包含进来会有问题 - 相同的资源被重复的加载，浪费用户的流量和服务器的成本； - 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。 - 如果能把公共代码抽离成单独文件进行加载能进行优化，可以减少网络传输流量，降低服务器成本

代码文件 `code-optimization2/history/02-webpack.config.js` 配置 optimization 进行代码分割

通过代码分割打包的代码中，被重复引用的模块会被抽离到一个公共的 js 中，被其他用到它的 js 共享

##### 动态导入和懒加载

用户当前需要用什么功能就只加载这个功能对应的代码，也就是所谓的按需加载 在给单页应用做按需加载优化时，一般采用以下原则： - 对网站功能进行划分，每一类一个 chunk - 对于首次打开页面需要的功能直接加载，尽快展示给用户,某些依赖大量代码的功能点可以按需加载 - 被分割出去的代码需要一个按需加载的时机

代码文件 `/code-optimization2/history/03-index.js`

```js
// 代码中，当点击按钮的时候才加载lazyload文件，通过
// 异步导入
import("./lazyload").then((result) => {
  console.log(result);
});
```

##### Scope Hoisting 作用域提升

Scope Hoisting 可以让 Webpack 打包出来的代码文件更小、运行的更快， 它又译作 "作用域提升
"，是在 Webpack3 中新推出的功能。

Scope Hoisting 会分析出模块之间的依赖关系，尽可能的把打包出来的模块合并到一个函数中去。

Scope Hoisting 的原理是将所有的模块按照引用顺序放在一个函数作用域里，然后适当地重命名一些变量以防止命名冲突

代码文件： `code-optimization2/history/04-webpack.config.js`

```
// 开启 Scope Hoisting
new webpack.optimize.ModuleConcatenationPlugin(),
```

开启/不开启 区别如下：

```js
// index.js
import { num } from "./print1";
let a = num + 100;
consolg.log(a);

// 不开启：打包后代码：var a = _print1__WEBPACK_IMPORTED_MODULE_0__[\"num\"] + 100;
// 开启：打包后的代码：var num = 100; var a = num + 100;
```

##### Tree Shaking

- 一个模块可以有多个方法，只要其中某个方法使用到了，则整个文件都会被打到 bundle 里面去，tree shaking 就是只把用到的方法打入 bundle,没用到的方法会 uglify 阶段擦除掉
- 原理是利用 es6 模块的特点,只能作为模块顶层语句出现,import 的模块名只能是字符串常量

webpack4 默认支持摇树优化，但需要在 production 模式下生效

使用时注意的事项：

- 使用 ES2015 模块语法（即 import 和 export）
- 确保没有编译器将您的 ES2015 模块语法转换为 CommonJS 的（顺带一提，这是现在常用的 @babel/preset-env 的默认行为，详细信息请参阅文档）
  - 如果我们将 babel 配置中的 modules 参数项改成 false，那么就不会对 ES6 模块化进行更改，还是使用 import 引入模块
  - 想办法是的 babel 的部分逻辑在 tree-sharking 执行完成之后再执行
- 在项目的 package.json 文件中，添加 "sideEffects" 属性
  - "side effect(副作用)" 的定义是，在导入时会执行特殊行为的代码，而不是仅仅暴露一个 export 或多个 export。举例说明，例如 polyfill，它影响全局作用域，并且通常不提供 export

#### 其他优化

- purgecss-webpack-plugin

  - 可以去除未使用的 css，一般与 glob、glob-all 配合使用
  - 必须和`mini-css-extract-plugin`配合使用
  - `paths` 路径是绝对路径

  ```js
  const glob = require('glob');
  const PurgecssPlugin = require('purgecss-webpack-plugin');

  module.exports = {
    module: {
      loaders: [
        {
            test: /\.css/,
            include: path.resolve(__dirname,'src'),
            exclude: /node_modules/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            },'css-loader']
        }
      ]
    },
    plugins: [
        new PurgecssPlugin({
            paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`)
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename:'[id].css'
        })
    ],
  }
  ```

### 其他用到的插件介绍

- DefinePlugin

  DefinePlugin 允许在 编译时 创建配置的全局常量，这在需要区分开发模式与生产模式进行不同的操作时，非常有用。

  ```js
  // webpack.config.js
  new webpack.DefinePlugin({
    PRODUCTION: JSON.stringify(true),
    VERSION: JSON.stringify("5fa3b9"),
    BROWSER_SUPPORTS_HTML5: true,
    TWO: "1+1",
    "typeof window": JSON.stringify("object"),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  });

  // xxx.js
  console.log('Running App version ' + VERSION);
  if(!BROWSER_SUPPORTS_HTML5) require('html5shiv'); // 直接使用全局常量
  ```

- script-ext-html-webpack-plugin 添加async，defer或module属性的<script>元素，甚至他们内联