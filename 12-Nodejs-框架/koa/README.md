## 啥是KOA?
 Koa 相当于是ES6版的 Express, 原班人马, 只是把ES5语法改成ES6, 并且换了个名. 目前新的 Koa 版本是 Koa2.

 Koa 是一个比较有代表性的 Node.js 框架, 经过几年的发展, 已经有丰富的插件扩展, 甚至还有在它的基础上又封装了一层的框架, 例如阿里的 Egg.js.

 ## 来个Hello world
 **npm install koa --save**
 ```js
const koa = require('koa')
const app = new koa()

app.use(async (ctx, next) => {
  ctx.response.status = 200
  ctx.response.body = 'hi, koa'
  await next()
})

app.listen(3000)
 ```

- 中间件
中间件是 Koa 一个重要的概念，它是一个执行的链条，整个链条组成了一个运行的周期，这样说有点抽象，我们看代码理解。

```js
const koa = require('koa2')
const app = new koa()

// 访问权限
app.use(async (ctx, next) => {
  console.log('权限验证通过...')
  await next() // 执行下一个中间件
})

// 日志记录
app.use(async (ctx, next) => {
  console.log('日志记录完成...')
  await next() // 执行下一个中间件
})

// 响应处理
app.use(async (ctx, next) => {
  ctx.response.status = 200
  ctx.response.body = 'hi, koa'
  await next()
})

app.listen(3000)
```
每一个中间件负责特定的小模块，互相配合，组合成一条完整的业务通道。中间件的功能也为 Koa 项目的扩展提供了很大的便利性，因为一些特定成熟的功能可以抽象成一个个模块共享出来，比如 路由模块、模版引擎 ... 让我们可以站在巨人的肩膀，直接在项目中导入使用这些成熟的模块。

- 上下文
中间件函数中另外一个参数 ctx，是一个环境上下文参数，解决了中间件之间的依赖问题，是中间件之间的全局变量。
两个作用，ctx 包含了 HTTP 的请求和响应处理
```js
app.use(async (ctx, next) => {
  ctx.a = 1
  await next() 
})

app.use(async (ctx, next) => {
  console.log(ctx.a) // 1
  await next()
})
```

## Koa HTTP 协议
Koa 的文档 只要一页，很快就能看完，其中大幅在介绍 HTTP的请求和响应 方法，我们做些举例。
```js
// -- Koa Request
// header
ctx.request.headers  
ctx.request.protocol
ctx.request.type
ctx.request.charset

// method
ctx.request.method
ctx.request.query // get
ctx.request.body // post | 依赖 koa-bodyparse 第三方模块，后面章节有描述

// path
ctx.request.url // path/?get=
ctx.request.path // path

// host
ctx.request.host // hostname:port
ctx.request.hostname // hostname
ctx.request.ip
crx.request.subdomains 

// cookie
ctx.cookies.get('name') // 获取 cookie
ctx.cookies.set(name, value, { // 设置 cookie
  'expires': new Date() // 时间
  'path' : '/' // 路径
  'domain': '0.0.0.0' // 域
  'httpOnly': false // 禁止js获取
})

// error
ctx.throw(404, 'Not found');

// -- Koa Response
// header
ctx.set({})

// status
ctx.response.status = 200

// type
ctx.response.type = 'text/html; charset=utf-8' // defaule

// redirect
ctx.response.redirect(url)
```

## Koa 路由
我们第一步需要做的，就是将具体的访问路径，指向特定的功能模块，这是路由的工作。
```js
const koa = require('koa2')
const app = new koa()

app.use(async (ctx, next) => {
    if (ctx.request.path === '/') { // 首页
      ctx.response.status = 200
      ctx.response.body = 'index'
    } else if (ctx.request.path === '/list') { // 列表页
      ctx.response.status = 200
      ctx.response.body = 'list'
    } else {
    	ctx.throw(404, 'Not found') // 404
    }
  await next()
})

app.listen(3000)
```
当然了，我们可以根据 ctx.request.path 这样一直的判断下去，但是这样是很繁琐的。类似这样繁琐的工作，已经有人封装成特定的插件共享到社区，解决我们这个问题的模块，叫做 koa-router，接下来我们引入它

- koa-router  这是一个路由管理模块，我们新建一个目录 urls 存放我们的控制器，然后这些控制器通过 app.js 的 koa-router 模块加载。

**npm install koa-router --save**
```js
// -- app.js
// 路由模块使用前需要先安装和实例化
const Router = require('koa-router')
const router = new Router()

// 首页
app.use(async (ctx, next) => {
    if (ctx.request.path === '/') {
      ctx.response.status = 200
      ctx.response.body = 'index'
    }
    await next()
})

// 其他页面通过 router 加载
let urls = fs.readDirSync(__dirname + '/urls')
urls.forEach((element) => {
    let module = require(__dirname + '/urls/' + element)
    /*
      urls 下面的每个文件负责一个特定的功能，分开管理
      通过 fs.readdirSync 读取 urls 目录下的所有文件名，挂载到 router 上面
    */
    router.use('/' + element.replace('.js', ''), module.routes(), module.allowedMethods())
})
app.use(router.routes())


// -- urls/home.js
const Router = require('koa-router')
const home = new Router()

// path: /home
home.get('/', async (ctx, next) => {
    ctx.response.status = 200
    ctx.response.body = 'home'
    await next()
})

// path: home/list
home.get('/list', async (ctx, next) => {
    ctx.response.status = 200
    ctx.response.body = 'home-list'
    await next()
})

module.exports = home
```

## Koa 静态文件
像一些静态文件的处理，Koa 也要现成的模块，省去我们自己需要从本地目录读取文件的很多步骤。
**npm i koa-static --save** 安装静态文件模块。
```js
const static_ = require('koa-static')

app.use(static_(
    path.join(__dirname, './static')
))
```
这样的一两句代码，就完成了一个静态服务器的搭建，static 目录下的文件，就能支持通过路径访问。


## Koa bodyparser
这是一个解析 POST 数据的模块，解决了 Koa 原生 ctx 访问 POST 数据不太便利的问题。
安装 **npm i koa-bodyparser --save**
```js
const bodyParser = require('koa-bodyparser')

app.use(bodyParser())

app.use(async (ctx, next) => {
 // 载入使用，post 的数据被挂载到 ctx.request.body，是一个 key => value 的 集合
  await next()
})
```


## koa-views
koa-views 是一个视图管理模块，它的灵活度很高，支持很多的模版引擎，这里我们给它配置的引擎是 ejs
运行 **npm i koa-views --save & npm install ejs --save**

```js
const views = require('koa-views')
const path = require('path')

// 配置视图
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}))

app.use(async (ctx, next) => {
  await ctx.render('index', {message: 'index'}) // render 渲染方法，这里加载到 views/index.ejs 文件 | 第二参数是传参到模版
  await next()
})
```

我们新建一个 views 目录，这里面存放我们的视图文件，在新建一个 index.ejs。
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ejs</title>
</head>
<body>

<%=message%> <!-- ejs 的模版语法，读取变量 message | 是从 render 传递过来 -->

</body>
</html>
```


## Koa 数据库
我们想让项目能够支持 mysql，我们做一个封装。
```js
// utils/mysql.js
const mysql = require('mysql')
let pools = {}
let query = (sql,callback, host = '127.0.0.1') => {
    if (!pools.hasOwnProperty(host)) {
        pools[host] = mysql.createPool({
            host: host,
            port: '3306',
            user: 'root',
            password: ''

        })
    }
    pools[host].getConnection((err, connection) => {
        connection.query(sql, (err, results) => {
            callback(err, results)
            connection.release()
        })
    })
}

module.exports = query
```
这样的一些 工具性 的东西，我们单独的分开出来，放在一个 utils 目录中，然后通过 ctx 关联起来

```js
/*
 通过一个中间件，把所有的工具关联起来
*/
app.use(async (ctx, next) => {
  ctx.util = {
    mysql: require('./utils/mysql')
  }
    await next()
})

// 操作数据库
app.use(async (ctx, next) => {
  ctx.util.mysql('select * from dbname.dbtable', function(err, results) {
    console.log(results)
  })
  await next()
})
```

## Koa日志记录
log4js
我们在创建一个日志记录模块，https://gitee.com/jmjc/koa-base 这个基本的 Koa 开发框架的功能就搭建完成了。日志模块用的是一个第三方的 Node.js 模块 log4js。日志的功能我们也定制成一个工具，存放到 utils 目录。

**npm i log4js** 安装好日志模块，在创建一个 **utils/log.js** 文件，下面是我们封装完成的代码。
```js
const log4js = require('log4js')
const data = new Date()

log4js.configure({
    appenders: {
        everything: { type: 'file', filename: `logs/${new Date().toLocaleDateString()}.log` }
    },
    categories: {
        default: { appenders: [ 'everything' ], level: 'info' }
    }
})

let logger = log4js.getLogger() // logger.info()

module.exports = logger
```

记录日志
```js
// 挂载日志模块
app.use(async (ctx, next) => {
    ctx.util = {
        log: require('./utils/log')
    }
    await next()
})

// 记录日志
app.use(async (ctx, next) => {
	ctx.util.log.info('Something important')
	await next()
})
```

运行完 ctx.util.log.info('Something important') 方法，在项目的根目录会多出一个 logs 文件夹，里面是我们的日志文件，按天分类。

打开里面的文件，可以看到我们刚刚记录的日志信息 [2018-10-30T17:18:51.450] [INFO] default - Something important。



更详细的信息：https://chenshenhai.github.io/koa2-note/



