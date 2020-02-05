# webpack-core

## 概述

这个阶段我们可以来看看 webpack 内部的打包逻辑和方式

在了解内部逻辑之前，我们要先了解一些概念：

- Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable，webpack 中最核心的负责编译的 Compiler 和负责创建 bundle 的 Compilation 都是 Tapable 的实例。
- 通过事件和注册和监听，触发 webpack 生命周期中的函数方法

> Tapable 库 提供了很多的钩子类, 这些类可以为插件创建钩子。 用 Tapable 可以方便的实现各种不同操作阶段的钩子逻辑

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require("tapable");
```

## tapable 分类

> Hook 类型可以分为同步 Sync 和异步 Async，异步又分为并行和串行

| 类型      | 使用要点                                                                                  |
| --------- | ----------------------------------------------------------------------------------------- |
| Basic     | 不关心监听函数的返回值                                                                    |
| Bail      | 保险式: 只要监听函数中有返回值(不为 undefined)，则跳过之后的监听函数                      |
| Waterfall | 瀑布式: 上一步的返回值交给下一步使用                                                      |
| Loop      | 循环类型: 如果该监听函数返回 true,则这个监听函数会反复执行，如果返回 undefined 则退出循环 |

## webpack 源码打包逻辑

> 重要文件

- Webpack 类似于一个公司
- Compiler 类似于公司的董事长，只把握战略方向
- Compilation 就像各个事业部的总监,负责各个部门的管理
- ModuleFactory 就像各个具体部门了,负责具体工作产出产品

> Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；

2. 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；

3. 确定入口：根据配置中的 entry 找出所有的入口文件

4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；

5. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；

6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；

7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

> webpack内部模块架构图

![image](/static/dependency.jpg)


具体每个阶段的重要代码点请参考：
http://www.zhufengpeixun.cn/2020/html/26.webpack-6-sources.html#t166.%20%E4%B8%BB%E8%A6%81%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B

<html>
    <strong>初始化阶段</strong>
    <table>
        <thead>
            <tr>
                <th style="text-align:left">事件名</th>
                <th style="text-align:left">解释</th>
                <th style="text-align:left">代码位置</th>
            </tr>
        </thead>
        <tbody>
        <tr>
            <td style="text-align:left">读取命令行参数</td>
            <td style="text-align:left">从命令行中读取用户输入的参数</td>
            <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/webpack-cli/bin/cli.js#L241"> require("./convert-argv")(argv)</a></td>
        </tr>
        <tr>
            <td style="text-align:left">实例化 Compiler</td>
            <td style="text-align:left">1.用上一步得到的参数初始化 Compiler 实例<br>2.Compiler 负责文件监听和启动编译<br>3.Compiler 实例中包含了完整的 Webpack 配置，全局只有一个 Compiler 实例。<br></td>
            <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/webpack-cli/bin/cli.js#L443">compiler = webpack(options);</a></td>
        </tr>
        <tr>
            <td style="text-align:left">加载插件</td>
            <td style="text-align:left">1.依次调用插件的 apply 方法，让插件可以监听后续的所有事件节点。<br>同时给插件传入 compiler 实例的引用，以方便插件通过 compiler 调用 Webpack 提供的 API。</td>
            <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/webpack.js#L42-L50">plugin.apply(compiler)</a></td>
        </tr>
        <tr>
            <td style="text-align:left">处理入口</td>
            <td style="text-align:left">读取配置的 Entrys，为每个 Entry 实例化一个对应的 EntryPlugin，为后面该 Entry 的递归解析工作做准备</td>
            <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/WebpackOptionsApply.js#L306">new EntryOptionPlugin().apply(compiler)</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/EntryOptionPlugin.js#L24">new SingleEntryPlugin(context, item, name)</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/SingleEntryPlugin.js#L40-L48">compiler.hooks.make.tapAsync</a></td>
        </tr>
        </tbody>
    </table>
</html>



<html>
    <strong>编译阶段</strong>
    <table>
        <thead>
        <tr>
        <th style="text-align:left">事件名</th>
        <th style="text-align:left">解释</th>
        <th style="text-align:left">代码位置</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td style="text-align:left">run</td>
        <td style="text-align:left">启动一次新的编译</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js#L263-L271">this.hooks.run.callAsync</a></td>
        </tr>
        <tr>
        <td style="text-align:left">compile</td>
        <td style="text-align:left">该事件是为了告诉插件一次新的编译将要启动，同时会给插件传入compiler 对象。</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js#L529-L555">compile(callback)</a></td>
        </tr>
        <tr>
        <td style="text-align:left">compilation</td>
        <td style="text-align:left">当 Webpack 以开发模式运行时，每当检测到文件变化，一次新的 Compilation 将被创建。<br>一个 Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。<br>Compilation 对象也提供了很多事件回调供插件做扩展。</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js#L491-L501">newCompilation(params)</a></td>
        </tr>
        <tr>
        <td style="text-align:left">make</td>
        <td style="text-align:left">一个新的 Compilation 创建完毕主开始编译</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js#L544">this.hooks.make.callAsync</a></td>
        </tr>
        <tr>
        <td style="text-align:left">addEntry</td>
        <td style="text-align:left">即将从 Entry 开始读取文件</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L1027">compilation.addEntry</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L1047">this._addModuleChain</a></td>
        </tr>
        <tr>
        <td style="text-align:left">moduleFactory</td>
        <td style="text-align:left">创建模块工厂</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L933">const moduleFactory = this.dependencyFactories.get(Dep)</a></td>
        </tr>
        <tr>
        <td style="text-align:left">create</td>
        <td style="text-align:left">创建模块</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModuleFactory.js#L369-L409">moduleFactory.create</a></td>
        </tr>
        <tr>
        <td style="text-align:left">factory</td>
        <td style="text-align:left">开始创建模块</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModuleFactory.js#L396-L406">factory(result, (err, module)</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModuleFactory.js#L129">resolver(result</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModuleFactory.js#L159">this.hooks.resolver.tap("NormalModuleFactory"</a></td>
        </tr>
        <tr>
        <td style="text-align:left">resolveRequestArray</td>
        <td style="text-align:left">解析loader路径</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModuleFactory.js#L411">resolveRequestArray</a></td>
        </tr>
        <tr>
        <td style="text-align:left">resolve</td>
        <td style="text-align:left">解析资源文件路径</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_enhanced-resolve%404.1.0%40enhanced-resolve/lib/Resolver.js#L136">resolve</a></td>
        </tr>
        <tr>
        <td style="text-align:left">userRequest</td>
        <td style="text-align:left">得到包括loader在内的资源文件的绝对路径用!拼起来的字符串</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModuleFactory.js#L254-L259">userRequest</a></td>
        </tr>
        <tr>
        <td style="text-align:left">ruleSet.exec</td>
        <td style="text-align:left">它可以根据模块路径名，匹配出模块所需的loader</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModuleFactory.js#L270-L279">this.ruleSet.exec</a></td>
        </tr>
        <tr>
        <td style="text-align:left">_run</td>
        <td style="text-align:left">它可以根据模块路径名，匹配出模块所需的loader</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/RuleSet.js#L485-L558">_run</a></td>
        </tr>
        <tr>
        <td style="text-align:left">loaders</td>
        <td style="text-align:left">得到所有的loader数组</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModuleFactory.js#L338">results[0].concat(loaders, results[1], results[2])</a></td>
        </tr>
        <tr>
        <td style="text-align:left">getParser</td>
        <td style="text-align:left">获取AST解析器</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModuleFactory.js#L357">this.getParser(type, settings.parser)</a></td>
        </tr>
        <tr>
        <td style="text-align:left">buildModule</td>
        <td style="text-align:left">开始编译模块</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L996-L1009">this.buildModule(module</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L602-L656">buildModule(module, optional, origin, dependencies, thisCallback)</a></td>
        </tr>
        <tr>
        <td style="text-align:left">build</td>
        <td style="text-align:left">开始真正编译入口模块</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModule.js#L396-L469">build(options</a></td>
        </tr>
        <tr>
        <td style="text-align:left">doBuild</td>
        <td style="text-align:left">开始真正编译入口模块</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModule.js#L257-L330">doBuild</a></td>
        </tr>
        <tr>
        <td style="text-align:left">执行loader</td>
        <td style="text-align:left">使用loader进行转换</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModule.js#L265">runLoaders</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_loader-runner%402.3.1%40loader-runner/lib/LoaderRunner.js#L242">runLoaders</a></td>
        </tr>
        <tr>
        <td style="text-align:left">iteratePitchingLoaders</td>
        <td style="text-align:left">开始递归执行pitch loader</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_loader-runner%402.3.1%40loader-runner/lib/LoaderRunner.js#L362">iteratePitchingLoaders</a></td>
        </tr>
        <tr>
        <td style="text-align:left">loadLoader</td>
        <td style="text-align:left">加载loader</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_loader-runner%402.3.1%40loader-runner/lib/loadLoader.js#L13">loadLoader</a></td>
        </tr>
        <tr>
        <td style="text-align:left">runSyncOrAsync</td>
        <td style="text-align:left">执行pitchLoader</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_loader-runner%402.3.1%40loader-runner/lib/LoaderRunner.js#L175-L188">runSyncOrAsync</a></td>
        </tr>
        <tr>
        <td style="text-align:left">processResource</td>
        <td style="text-align:left">开始处理资源</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_loader-runner%402.3.1%40loader-runner/lib/LoaderRunner.js#L192">processResource</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_loader-runner%402.3.1%40loader-runner/lib/LoaderRunner.js#L199">options.readResource</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_loader-runner%402.3.1%40loader-runner/lib/LoaderRunner.js#L202">iterateNormalLoaders</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_loader-runner%402.3.1%40loader-runner/lib/LoaderRunner.js#L209-L235">iterateNormalLoaders</a></td>
        </tr>
        <tr>
        <td style="text-align:left">createSource</td>
        <td style="text-align:left">创建源代码对象</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModule.js#L316"> this.createSource</a></td>
        </tr>
        <tr>
        <td style="text-align:left">parse</td>
        <td style="text-align:left">使用parser转换抽象语法树</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/NormalModule.js#L445-L467">this.parser.parse</a></td>
        </tr>
        <tr>
        <td style="text-align:left">parse</td>
        <td style="text-align:left">解析抽象语法树</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Parser.js#2022">parse(source, initialState)</a></td>
        </tr>
        <tr>
        <td style="text-align:left">acorn.parse</td>
        <td style="text-align:left">解析语法树</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Parser.js#L2158">acorn.parse(code, parserOptions)</a></td>
        </tr>
        <tr>
        <td style="text-align:left">ImportDependency</td>
        <td style="text-align:left">遍历并添加添加依赖</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/dependencies/HarmonyImportDependencyParserPlugin.js#L28">parser.state.module.addDependency(clearDep)</a></td>
        </tr>
        <tr>
        <td style="text-align:left">succeedModule</td>
        <td style="text-align:left">生成语法树后就表示一个模块编译完成</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L652">this.hooks.succeedModule.call(module)</a></td>
        </tr>
        <tr>
        <td style="text-align:left">processModuleDependencies</td>
        <td style="text-align:left">递归编译依赖的模块</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L980">this.processModuleDependencies(module</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L663">processModuleDependencies(module, callback)</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L716">this.addModuleDependencies</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L859">buildModule</a></td>
        </tr>
        <tr>
        <td style="text-align:left">make后</td>
        <td style="text-align:left">结束make</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js#L545">this.hooks.make.callAsync(compilation, err =&gt; {}</a></td>
        </tr>
        <tr>
        <td style="text-align:left">finish</td>
        <td style="text-align:left">编译完成</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js#L547">compilation.finish();</a></td>
        </tr>
        </tbody>
    </table>
</html>

<html>
    <strong>结束阶段</strong>
    <table>
        <thead>
        <tr>
        <th style="text-align:left">事件名</th>
        <th style="text-align:left">解释</th>
        <th style="text-align:left">代码位置</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td style="text-align:left">seal</td>
        <td style="text-align:left">封装</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js#L549">compilation.seal</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L1159-L1301">seal(callback)</a></td>
        </tr>
        <tr>
        <td style="text-align:left">addChunk</td>
        <td style="text-align:left">生成资源</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L1400">addChunk(name)</a></td>
        </tr>
        <tr>
        <td style="text-align:left">createChunkAssets</td>
        <td style="text-align:left">创建资源</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L1270">this.createChunkAssets()</a></td>
        </tr>
        <tr>
        <td style="text-align:left">getRenderManifest</td>
        <td style="text-align:left">获得要渲染的描述文件</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/MainTemplate.js#L355-L360">getRenderManifest(options)</a></td>
        </tr>
        <tr>
        <td style="text-align:left">render</td>
        <td style="text-align:left">渲染源码</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compilation.js#L2369">source = fileManifest.render();</a></td>
        </tr>
        <tr>
        <td style="text-align:left">afterCompile</td>
        <td style="text-align:left">编译结束</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js##L552">this.hooks.afterCompile</a></td>
        </tr>
        <tr>
        <td style="text-align:left">shouldEmit</td>
        <td style="text-align:left">所有需要输出的文件已经生成好，询问插件哪些文件需要输出，哪些不需要。</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js##L215">this.hooks.shouldEmit</a></td>
        </tr>
        <tr>
        <td style="text-align:left">emit</td>
        <td style="text-align:left">确定好要输出哪些文件后，执行文件输出，可以在这里获取和修改输出内容。</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js##L228">this.emitAssets(compilation</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js##L363-L367">this.hooks.emit.callAsync</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js##L308-L361">const emitFiles = err</a><br><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js##L338">this.outputFileSystem.writeFile</a></td>
        </tr>
        <tr>
        <td style="text-align:left">this.emitRecords</td>
        <td style="text-align:left">写入记录</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js##L249">this.emitRecords</a></td>
        </tr>
        <tr>
        <td style="text-align:left">done</td>
        <td style="text-align:left">全部完成</td>
        <td style="text-align:left"><a href="https://github.com/zhufengnodejs/webpack-analysis/blob/master/node_modules/_webpack%404.20.2%40webpack/lib/Compiler.js##L255">this.hooks.done.callAsync</a></td>
        </tr>
        </tbody>
    </table>
</html>
