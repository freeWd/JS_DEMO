# Babel 7 入门教程

Tag: [babel][babel] [Babel v7][babel7] [babel 教程]

更多内容查看下面的链接，作者写的特别好，甩官方文档 100 条街

[姜瑞涛的官方网站] https://www.jiangruitao.com/docs/babel/

总结：

一般正常开发中 babel 很少单独用， 都是配合打包工具一起使用，但是它有 N 个 npm 库和插件。

## 了解 Babel 的用途

Babel 的主要工作有两部分

- 语法转换：比如 `箭头函数， class定义类语法， 解构语法` 转化
- 补齐 API：`promise, map, set`

Babel 默认只转换新的 JavaScript 语法（syntax），而不转换新的 API， 要转化 API 需要使用 polyfill（垫片）

polyfill 广义上讲是为环境提供不支持的特性的一类文件或库，狭义上讲是 polyfill.js 文件以及@babel/polyfill 这个 npm 包

## 一定要区分 Babel7 版本与 Babel6，变化还是挺大的

- Babel7 的 npm 包都是放在 babel 域下的，即在安装 npm 包的时候，我们是安装@babel/这种方式，例如@babel/cli、@babel/core 等
- Babel6 安装的包名是 babel-cli，babel-core...

## Babel 配置文件

用来指定 Babel 编译的规则

可以在下面这些文件中来配置规则：
`.babelrc，.babelrc.js，babel.config.js和package.json`

配置文件总结起来就两个配置项：
`plugins和presets` (minified、ignore..这些平时几乎用不到)

plugin 代表插件，preset 代表预设，它们分别放在 plugins 和 presets，每个插件或预设都是一个 npm 包, 所以它有那么多的包

每个插件相当于对某一个 js 特性的转化和处理，插件太多会臃肿，于是就有了 preset，它相当于插件集合

经过总结：
preset 中我们实际用到的有 4 个：

- @babel/preset-env 对 es6 语法的转化
- @babel/preset-flow
- @babel/preset-react 处理 react
- @babel/preset-typescript 翻译 typescript

如果是一个普通的 vue 工程，Babel 官方的 preset 只需要配一个”@babel/preset-env”就可以了

plugins 中的很多都整合到 preset-env 和 preset-react 了，真正用到的可能只有 `@babel/plugin-transform-runtime`

## 使用 babel

### 使用 polyfill

```js
// 方法一： main.js如何文件中导入
import "@babel/polyfill";

// 方法二：或者导入这两个（polyfill由这两个组成）
import "core-js/stable";
import "regenerator-runtime/runtime";

//方法三：如果是用webpack
const path = require("path");
module.exports = {
  // entry: ["core-js/stable", "regenerator-runtime/runtime", "./a.js"],
  entry: ['@babel/polyfill', './a/js']
  output: {
    filename: "b.js",
    path: path.resolve(__dirname, ""),
  },
  mode: "development",
};
```

### 使用@babel/preset-env

@babel/preset-env 的参数项，数量有 10 多个, 重点了解四个：`targets、useBuiltIns、modules和corejs`

**在不需要设置参数时**

```js
// babel.config.js
module.exports = {
  // @babel/env是@babel/preset-env的简写
  presets: ["@babel/env"],
  plugins: [],
};
```

**browserslist**

在 package.json 里设置 browserslist

```json
// chrome 60版本浏览器
"browserslist": [
 "chrome 60"
]

// 市场份额大于1%的浏览器并且不考虑IE8及一下的IE浏览器
"browserslist": [
    "> 1%",
    "not ie <= 8"
]
```

**需要置参数**

- targets (`targets和browserslist`的作用是一样的,设置的时候选择一个设置即可)

  设置转码后语法的浏览器兼容范围

  ```js
  module.exports = {
    presets: [
      [
        "@babel/env",
        {
          targets: {
            chrome: "58",
            ie: "11",
          },
        },
      ],
    ],
    plugins: [],
  };
  ```

- useBuiltIns 取值可以是”usage” 、 “entry” 或 false。如果该项不进行设置，则取默认值 false

  useBuiltIns 这个参数项主要和 polyfill 的行为有关。在我们没有配置该参数项或是取值为 false 的时候，polyfill 会全部引入到最终的代码里

  useBuiltIns 取值为”entry”或”usage”的时候，会根据配置的目标环境找出需要的 polyfill 进行部分引入

  ’entry’与’usage’这两个参数值的区别：’entry’这种方式不会根据我们实际用到的 API 进行针对性引入 polyfill，而’usage’可以做到。另外，在使用的时候，’entry’需要我们在项目入口处手动引入 polyfill，而’usage’不需要

  ```js
  module.exports = {
    presets: [
      [
        "@babel/env",
        {
          useBuiltIns: "usage",
        },
      ],
    ],
    plugins: [],
  };
  ```

- modules 这个参数项的取值可以是”amd”、”umd” 、 “systemjs” 、 “commonjs” 、”cjs” 、”auto” 、false。在不设置的时候，取默认值”auto”

  该项用来设置是否把 ES6 的模块化语法改成其它模块化语法

  我们常见的模块化语法有两种：（1）ES6 的模块法语法用的是 import 与 export；（2）commonjs 模块化语法是 require 与 module.exports

  在该参数项值是’auto’或不设置的时候，会发现我们转码前的代码里 import 都被转码成 require 了

  如果我们将参数项改成 false，那么就不会对 ES6 模块化进行更改，还是使用 import 引入模块

  使用 ES6 模块化语法有什么好处呢。在使用 Webpack 一类的打包工具, 可以进行静态分析，从而可以做 tree shakeing 等优化措施

### @babel/plugin-transform-runtime & @babel/runtime

- @babel/runtime 把所有语法转换会用到的辅助函数都集成在了一起
- @babel/plugin-transform-runtime 有三大作用，其中之一就是自动移除语法转换后内联的辅助函数（inline Babel helpers），使用@babel/runtime/helpers 里的辅助函数来替代。这样就减少了我们手动引入的麻烦


```json
npm install --save @babel/runtime
npm install --save-dev @babel/cli @babel/core  @babel/preset-env

{
  "presets": ["@babel/env"],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

### babel-loader

babel-loader 是用于 webpack 的一个 loader,以便 webpack 在构建的时候用 Babel 对 JS 代码进行转译，这样我们就不用再通过命令行手动转译了

在这里，我们通过options属性给babel-loader传递预设和插件等Babel配置项。我们也可以省略这个options，这个时候babel-loader会去读取默认的Babel配置文件，也就是.babelrc，.babelrc.js，babel.config.js等。

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    },
  ];
}
```
