# Rollup.js

## 概述

Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。

Rollup 只引入最基本最精简代码，所以可以生成轻量、快速，以及低复杂度的 library 和应用程序

当然Rollup也有自己的插件来丰富自己的打包逻辑

Rollup 已被许多主流的 JavaScript 库使用，也可用于构建绝大多数应用程序。但是 Rollup 还不支持一些特定的高级功能，尤其是用在构建一些应用程序的时候，特别是代码拆分和运行时态的动态导入 dynamic imports at runtime. 如果你的项目中更需要这些功能，那使用 Webpack可能更符合你的需求。


## 基本使用

```bash
npm install rollup --global

# -f 选项（--output.format 的缩写）指定了所创建 bundle 的类型——这里是 CommonJS（在 Node.js 中运行）。由于没有指定输出文件，所以会直接打印在 stdout 中
rollup src/main.js -f cjs

# 也可以像下面一样将 bundle 保存为文件
rollup src/main.js -o dist/bundle.js -f cjs
```

### 使用配置文件(Using config files)

在项目中创建一个名为 `rollup.config.js` 的文件，增加如下代码

```js
// rollup.config.js
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs' // commonjs
  }
};
```

我们用 `--config 或 -c` 来使用配置文件

同样的命令行选项将会覆盖配置文件中的选项：

`rollup -c -o dist/bundle-2.js`  -o覆盖了配置文件中的输出文件名

如果愿意的话，也可以指定与默认 rollup.config.js 文件不同的配置文件：

```js
rollup --config rollup.config.dev.js
rollup --config rollup.config.prod.js
```


### 使用插件(Using plugins)

随着构建更复杂的 bundle，通常需要更大的灵活性——引入 npm 安装的模块、通过 Babel 编译代码、和 JSON 文件打交道等

为此，我们可以用 插件(plugins) 在打包的关键过程中更改 Rollup 的行为

#### @rollup/plugin-json

以`@rollup/plugin-json`插件为例，令 Rollup 从 JSON 文件中读取数据

```js
import json from '@rollup/plugin-json';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [ json() ]
};
```

#### @rollup/plugin-node-resolve

用来解析node_modules 文件夹中的软件包，它以告诉 Rollup 如何查找外部模块，但只适用于es module import / export的第三方项目, 比如 `lodash-es`

```js
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [json(), resolve() ]
};
```

#### @rollup/plugin-commonjs

但是目前， npm 中的大多数包都是以 CommonJS 模块的形式出现的。 在它们更改之前，我们需要将 CommonJS 模块转换为 ES2015 供 Rollup 处理。

这个 `@rollup/plugin-commonjs` 插件就是用来将 CommonJS 转换成 ES2015 模块的

请注意，@rollup/plugin-commonjs 应该用在其他插件转换你的模块之前 - 这是为了防止其他插件的改变破坏 CommonJS 的检测。

```js
// 先用commonjs解析 lodash，转化为es6模块。再用resolve解析
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [commonjs(), json(), resolve()]
};
```



#### @rollup/plugin-babel

许多开发人员在他们的项目中使用 Babel ，以便他们可以使用未被浏览器和 Node.js 支持的将来版本的 JavaScript 特性

```js
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from '@rollup/plugin-babel';

export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
  plugins: [
    commonjs(),
    json(),
    resolve(),
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ],
};
```

### 输出插件 rollup-plugin-terser 

```js
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';

export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.min.js",
    format: "iife",
    name: 'version',
    plugins: [terser()]
  },
  plugins: [
    commonjs(),
    json(),
    resolve(),
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ],
};

```

上面这些都是官网中简单介绍的一些内容，虽然rollupjs核心代码很轻量级，但是它的插件也是非常丰富的，灵活的使用插件和rollup配置文件是用好它的关键吧。

> rollupjs 插件合集：https://github.com/rollup/plugins

> rollup 教程： https://github.com/JohnApache/rollup-usage-doc
