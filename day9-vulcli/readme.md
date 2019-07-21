```linux
sudo npm install @vue/cli -g
sudo npm install -g @vue/cli-service-global
```
全局安装 vue/cli 和 vue-cli-service

编写vue代码，新建文件.vue， 里面分三部分：
1 template - html
2 script - js
3 style - css

执行：vue serve filename.vue


利用cli创建一个完整的vue项目：
vue create 项目名称、 或者使用vue ui - GUI界面选择创建
自定义打包和运行配置：vue-config.js  - 基于node 注意：node不支持import语法
常用到的配置：
```js
let path = require('path')
module.exports = {
    /**
     * 发布路径 - 部署应用包时的基本 URL
     * Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/。
     * 默认使用 vue-cli-service build就是产线环境。 打包后的index.html上关于路径的引用的链接都会加上/vue-project路径
     * /
    publicPath:process.env.NODE_ENV === 'production'? '/vue-project':'/',

    // 输出路径 - 默认是dist
    outputDir:'myassets', 

    // 生成静态目录的文件夹 - 默认打包后dist的文件夹下就是js,img,css。 使用assetsDir后就移植static文件夹下面
    assetsDir:'static',

     // 是否可以使用template模板
     // 我们可以看下main.js - new Vue是通过render函数将App导入进来的。 如果某些情况下我们就是想要template来渲染而不是render函数，就会报异常。因为默认启动server使用runtion-only build。模板不可以，下面参数为true可以使得模板可用，但会增加100k
    runtimeCompiler: true,

    // 多余1核cpu时 启动并行压缩。 - 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
    parallel:require('os').cpus().length > 1,

    //生产环境下 不使用soruceMap。 
    //默认打包后的代码js文件夹下面每一个js文件都对应一个map映射文件。配置后生产环境打包不生产map文件
    productionSourceMap:false,

    // https://github.com/neutrinojs/webpack-chain
    // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。 - 注意和下面configureWebpack的区别，一个是修改一个是新增
    chainWebpack:config=>{
        // 控制webpack内部配置，再增加一些自己的逻辑
        // 下面是配置目录别名 
        config.resolve.alias.set('component',path.resolve(__dirname,'src/components'));

    },

    // https://github.com/survivejs/webpack-merge
    // 在原来webpack基础上新增一些新功能。 将你在此处的配置与内部的webpack配置做一个合并
    configureWebpack:{
        // 新增插件等
        plugins:[],
        module: {

        }
    },

    devServer:{ // 配置代理
        proxy:{
            '/api':{
                target:'http://a.zf.cn:3000',
                changeOrigin:true
            }
        }
    },

    // 第三方插件配置
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                // 插入全局样式
                path.resolve(__dirname,'src/assets/common.less'), 
            ],
        }
    }
}
```



### 完整的导航解析流程
导航被触发。
在失活的组件里调用离开守卫。
调用全局的 beforeEach 守卫。
在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
在路由配置里调用 beforeEnter。
解析异步路由组件。
在被激活的组件里调用 beforeRouteEnter。
调用全局的 beforeResolve 守卫 (2.5+)。
导航被确认。
调用全局的 afterEach 钩子。
触发 DOM 更新。
用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。


