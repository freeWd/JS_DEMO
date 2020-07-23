## webpack流程

<html>
    <hr />
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
    <hr />
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
    <hr />
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