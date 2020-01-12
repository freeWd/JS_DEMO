## webpack打包优化

### webpack常见的优化方案
1 尽量减小搜索的范围
当引入一个模块的时候要进行解析
- resolve
    - extensions - 指定extension之后可以不用在require或是import的时候加文件扩展名,会依次尝试添加扩展名进行匹配
    - alias - 配置别名可以加快webpack查找模块的速度
    - modules - 对于直接声明依赖名的模块（如 react ），webpack 会类似 Node.js 一样进行路径搜索，搜索node_modules目录, 这个目录就是使用resolve.modules字段进行配置的 默认配置
    - mainFields 默认情况下package.json 文件则按照文件中 main 字段的文件名来查找文件

```js
// 善于使用resolve配置减少检测次数
resolve: {
    extensions: [".js",".jsx",".json",".css"],
    alias:{
       "bootstrap":"node_modules/_bootstrap@3.3.7@bootstrap/dist/css/bootstrap.css"
    },
    modules: ['node_modules'],
    mainFields: ['browser', 'module', 'main']
}

// module 减少搜索范围
exclude 和 incluede
```

2 定义DLL