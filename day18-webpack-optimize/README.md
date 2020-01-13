## webpack打包优化

### webpack常见的优化方案

#### 1 尽量减小搜索的范围
当引入一个模块的时候要进行解析
- resolve
    - extensions - 指定extension之后可以不用在require或是import的时候加文件扩展名,会依次尝试添加扩展名进行匹配
    - alias - 配置别名可以加快webpack查找模块的速度
    - modules - 对于直接声明依赖名的模块（如 react ），webpack 会类似 Node.js 一样进行路径搜索，搜索node_modules目录, 这个目录就是使用resolve.modules字段进行配置的 默认配置
    - mainFields 默认情况下package.json 文件则按照文件中 main 字段的文件名来查找文件

```js
// 善于使用resolve配置减少检测次数
resolve: {
    // extensions:默认值是[".js", ".json"]
    extensions: [".js",".jsx",".json",".css"],
    // 取别名
    alias:{
       "bootstrap":"node_modules/_bootstrap@3.3.7@bootstrap/dist/css/bootstrap.css"
    },
    // 告诉 webpack 解析模块时应该搜索的目录 默认值是["node_modules"]
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    // 当从 npm 包中导入模块时（例如，import * as D3 from "d3"），此选项将决定在 package.json 中使用哪个字段导入模块。根据 webpack 配置中指定的 target 不同，默认值也会有所不同
    // 当 target 属性设置为 webworker, web 或者没有指定，默认值为 mainFields: ["browser", "module", "main"]
    // 对于其他任意的 target（包括 node），默认值为：mainFields: ["module", "main"]
    // 这意味着当我们 import * as D3 from "d3"，实际从 browser 属性解析文件。在这里 browser 属性是最优先选择的，因为它是 mainFields 的第一项
    mainFields: ['browser', 'module', 'main']
}

// module 减少搜索范围
exclude 和 incluede
```

#### purgecss-webpack-plugin 可以去除未使用的 css，一般与 glob、glob-all 配合使用


#### 定义DLL
.dll为后缀的文件称为动态链接库，在一个动态链接库中可以包含给其他模块调用的函数和数据

- 把基础模块独立出来打包到单独的动态连接库里
- 当需要导入的模块在动态连接库里的时候，模块无需再次被打包，而是去动态连接库里获取

1.定义Dll
- DllPlugin插件： 用于打包出一个个动态连接库
- DllReferencePlugin: 在配置文件中引入DllPlugin插件打包好的动态连接库
``` js
// config.js
const path=require('path');
const DllPlugin=require('webpack/lib/DllPlugin');
module.exports={
    entry: {
        react:['react','react-dom']
    },// 把 React 相关模块的放到一个单独的动态链接库
    output: {
        path: path.resolve(__dirname,'dist'),// 输出的文件都放到 dist 目录下
        filename: '[name].dll.js',//输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称
        library: '_dll_[name]',//存放动态链接库的全局变量名称,例如对应 react 来说就是 _dll_react
    },
    plugins: [
        new DllPlugin({
            // 动态链接库的全局变量名称，需要和 output.library 中保持一致
            // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
            // 例如 react.manifest.json 中就有 "name": "_dll_react"
            name: '_dll_[name]',
            // 描述动态链接库的 manifest.json 文件输出时的文件名称
            path: path.join(__dirname, 'dist', '[name].manifest.json')
        })
    ]
}

// dll.config.js
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')
plugins: [
  new DllReferencePlugin({
    manifest:require('./dist/react.manifest.json')
  })
]

// 在html中插入，或者使用add-asset-html-webpack-plugin自动插入
<script src="react.dll.js"></script>
<script src="bundle.js"></script>
```


#### 多进程处理
- HappyPack 快乐打包
    - 构建需要解析和处理文件,文件读写和计算密集型的操作太多后速度会很慢
    - Node.js 之上的 Webpack 是单线程模型
    - happypack 就能让Webpack把任务分解给多个子进程(js, css...)去并发的执行，子进程处理完后再把结果发送给主进程。
- thread-loader也能启动相同的效果 


#### 区分环境 - 为开发和生成环境设置不同的打包配置
