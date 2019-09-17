优化SEO的方法： （一下内容都是基于vue来实现的）

# 预渲染
**原理**
- 先在本地跑一个无头浏览器 - 提前将内容渲染出来，获取渲染后的完整的dom元素存储到html里面去，爬虫的原理 
- 不实时，只适用于纯静态的页面，如果是有请求数据的动态页面，它获取到数据后存起来，build后访问的就是上次构建的存储过的静态页面的数据。
Vue预渲染的基本使用：
```
npm install prerender-spa-plugin 

// -- vue.config.js
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const path = require('path');
// 会默认下载一个开发版的chrome
module.export = {
    configureWebpack: {
        plugins: [
            new PrerenderSPAPlugin({
                staticDir: path.join(__dirname, 'dist'),
                // 将 路由为 “ / 和 about ”的内容构建为完整的html静态页面
                routes: [ '/', '/about',],
            })
        ]
    }
}

// 运行npm run build 构建静态页面
```


# SSR
放在服务器进行就是服务器渲染，放在浏览器进行就是浏览器渲染  
- 客户端渲染不利于 SEO 搜索引擎优化
- 服务端渲染是可以被爬虫抓取到的，客户端异步渲染是很难被爬虫抓取到的
- SSR直接将HTML字符串传递给浏览器。大大加快了首屏加载时间。
- SSR占用更多的CPU和内存资源
- 一些常用的浏览器API可能无法正常使用
- 在vue中只支持beforeCreate和created两个生命周期
![image](../static/ssr.png)

## SSR基本实现
通过vue-server-renderer 配合 express看看vue ssr的基本实现情况
```js
// -- server.js
const Vue = require('vue');
const VueServerRender = require('vue-server-renderer');
const express = require('express');
const fs = require('fs');

//  new一个vue实例，构建想要渲染的模板
let vm = new Vue({
    data: {
        msg: 'hello world'
    },
    template: ('<h1>{{msg}} 123</h1>')
});
let app = express();
app.listen(3000);

// --- 方法一 直接渲染
// 通过VueServerRender创建一个render渲染器，利用renderToString渲染出vue实例转化后的字符串
let render = VueServerRender.createRenderer();
app.get('/', (req, resp) => {
    render.renderToString(vm, function(err, html) {
        resp.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Document</title>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `)
    })
});

// --- 方法二 模板渲染 
// 需要在对应的html中要被替换内容的地方添加  <!---vue-ssr-outlet-->标记,
// 方法一种的html基本骨架标签都是在 send的时候手写的，实际有更好的办法能处理，就是提前写好一个index.html模板
// 在createRenderer时候将模板的值传递进去
let template = fs.readFileSync('index.html','utf8');
let render = VueServerRender.createRenderer(template);
app.get('/', (req, resp) => {
    render.renderToString(vm, function(err, html) {
        resp.send(html);
    })
});

// 启动web服务器
nodemon server.js 
```

上面两种方法实现上没有问题，但实际的开发中是通过这种方式在server中写vue模板渲染的代码是不方便的，真正实际的开发需要配合webpack去做

## webpack ssr
安装的模块
- webpack webpack-cli webpack-dev-server webpack需要的
- babel-loader @babel/core @babel/preset-env 处理es6语法的
- vue vue-loader vue-template-compiler 处理编译vue的
- vue-style-loader css-loader 处理样式的 （与 style-loader用法一致，但相比于style-loader 它能用于服务端渲染）
- html-webapck-plugin 处理html的
- webpack-merge 合并webpack配置 configureWebpack

**npx webpack-dev-server ** 用于启动web服务


**下面这个与ssr无关只是准备工作：不使用vue-cli，使用webpack启动一个 .vue书写的项目**
```js
// -- src/app.js
import Vue from 'vue';
import App from './App.vue';

let vm = new Vue({
    el: '#app',
    render: (h) => h(App)
});

// -- webpack.config.js
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    // 入口
    entry: path.resolve(__dirname, 'src/app.js'),
    // 出口
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    // 对模块的处理
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            }, {
                test: /\.vue$/,
                use: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'public/index.html')
        })
    ]
}
```


**如果使用webpack构建一个ssr的vue项目呢**
按照以下的顺序操作和思考
* 调整app.js内实例化vue的代码以适应服务端
* 创建两个不同的js入口文件，分别用于服务端和客户端打包代码的配置
* 创建一个index.html文件，用于服务端打包的默认加载模板文件 /public/index-ssr.html
* 创建两个不同的webpack config文件用于服务端和客户端代码的打包
* 构建ssr web服务 server-ssr.js
* package创建新的构建脚本

```js
// -- src/app.js
import Vue from 'vue';
import App from './App.vue';

// 为了兼容服务端 要将这个方法改造成一个新函数 - 服务端中每个用户访问都要单独的new一个实例出来 而不能只用一个实例（单例）
// 前端之所以可以先在这么写，是因为前端是天然分布式的，每个电脑 每个浏览器的每个tab都是相互独立的
// 适用于服务端的新函数，不需要挂载
export default () => {
    let  app = new Vue({
        render: (h) => h(App)
    });
    return {app};
}


// --src/client-entry.js
import createApp from './app';
let { app } = createApp();
app.$mount('#app'); // 挂载对应标签


// --src/server-entry.js
import createApp from './app';

// 服务端会调用此函数产生新的app实例
export default () => {
    let { app } = createApp();
    return app;
}


// -- config/webpack.base.js
// 后面客户端和服务端打包都需要merge的公共配置信息
let path = require('path');
let VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'production',
    // 出口
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    // 对模块的处理
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            }, {
                test: /\.vue$/,
                use: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}


// -- config/webpack.server.js
let base = require('./webpack.base');
let merge = require('webpack-merge');
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(base, {
    target: 'node', // 打包的结果给node使用，如果不加这个配置，像fs等也会被打包
     entry: {
        server: path.resolve(__dirname, '../src/server-entry.js')
    },
    output: {
        // 打包出来不是使用闭包函数 而是module.export = server.entry.js.... 这样的nodejs的用法
        libraryTarget: 'commonjs2'
    }
});


// -- config/webpack.client.js
let merge = require('webpack-merge');
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let base = require('./webpack.base');

module.exports = merge(base, {
    // 入口
    entry: {
        client: path.resolve(__dirname, '../src/client-entry.js')
    },
    plugins: [
        // 把public目录下的index-ssr内容拷贝到dist目录
        new HtmlWebpackPlugin({
            filename: 'index-ssr.html',
            template: path.resolve(__dirname, '../public/index-ssr.html'),
            excludeChunks: ['server']
        }) 
    ]
});


```

**既然是服务端渲染为什么还要打client的包呢？**  
因为服务端包打出来的的js文件是给web服务调用的，虽然通过node server接收处理后能在浏览器显示出页面内容，但只是返回一个字符串，并没有vue的实际功能，如果要让vue的实际功能生效。所以需要client打包通过html插件，将client.js注入到index-ssr.html内。  
这样服务端负责生成渲染的页面，客户端负责加载vue特性和一些交互的事件。

**这样客户端js和服务端js都存在情况下，会不会让页面多渲染一次？**  
不会，这个是有vue-ssr内部做了优化，没有这方面的问题

**按上面的步骤 事件还是不执行的可能原因有什么**  
注意需要在App.vue(根组件)的第一个元素上手动添加 **id="app"** 再打包


```js
// -- server-ssr.js
const express = require('express');
const Vue = require('vue');
const fs = require('fs');
const path = require('path');
const VueServerRender = require('vue-server-renderer');

const app = express();

let serverBundle = fs.readFileSync('./dist/server.bundle.js', 'utf-8');
let template = fs.readFileSync('./dist/index-ssr.html', 'utf-8');
let render = VueServerRender.createBundleRenderer(serverBundle, {
    template
});
app.get('/', (req, resp) => {
    // 把渲染好的字符串传递给客户端，只是返回一个字符串，并没有vue的实际功能
    render.renderToString((err, html) => {
        resp.send(html);
    });
})

// 顺序报在下面, 通过中间件设置路径，允许index-ssr.html加载client.js
app.use(express.static(path.resolve(__dirname, 'dist'))); 

app.listen(3003);
```

### Vue路由 SSR
路由打包

### Vuex SSR

### Vue-Meta


### Event Bus





