## Webpack 打包优化 第二阶段讲解


### HMR 不刷新页面的热加载
- HMR 全称是 Hot Module Replacement，即模块热替换
- Hot Reloading，当代码变更时通知浏览器刷新页面，以避免频繁手动刷新浏览器页面
- HMR 可以理解为增强版的 Hot Reloading，但不用整个页面刷新，而是局部替换掉部分模块代码并且使其生效
- 原理是当一个源码发生变化时，只重新编译发生变化的模块，再用新输出的模块替换掉浏览器中对应的老模块

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

### Tree Sharking 摇树优化 (只有 production 模式下优化才生效)
- 一个模块可以有多个方法，只要其中某个方法使用到了，则整个文件都会被打到bundle里面去，tree shaking就是只把用到的方法打入bundle,没用到的方法会uglify阶段擦除掉
- 原理是利用es6模块的特点,只能作为模块顶层语句出现,import的模块名只能是字符串常量

webpack默认支持摇树优化，但需要在production模式下生效

### 代码分割
- 提取公共代码 (基础类库，方便长期缓存, 页面之间的公用代码)
大网站有多个页面，每个页面由于采用相同技术栈和样式代码，会包含很多公共代码，如果都包含进来会有问题
    - 相同的资源被重复的加载，浪费用户的流量和服务器的成本；
    - 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。
    - 如果能把公共代码抽离成单独文件进行加载能进行优化，可以减少网络传输流量，降低服务器成本

> /history/02-webpack.config.js 配置 optimization 进行代码分割


- 动态导入和懒加载
用户当前需要用什么功能就只加载这个功能对应的代码，也就是所谓的按需加载 在给单页应用做按需加载优化时，一般采用以下原则：
    - 对网站功能进行划分，每一类一个chunk
    - 对于首次打开页面需要的功能直接加载，尽快展示给用户,某些依赖大量代码的功能点可以按需加载
    - 被分割出去的代码需要一个按需加载的时机

> /history/03-index.js

```js 
// 异步导入
import('./lazyload').then(result => {
    console.log(result);
});
```

### Scope Hoisting 作用域提升
Scope Hoisting 可以让 Webpack 打包出来的代码文件更小、运行的更快， 它又译作 "作用域提升"，是在 Webpack3 中新推出的功能。
- scope hoisting的原理是将所有的模块按照引用顺序放在一个函数作用域里，然后适当地重命名一些变量以防止命名冲突

> /history/04-webpack.config.js
```
// 开启 Scope Hoisting
new webpack.optimize.ModuleConcatenationPlugin(),
```