# pwa
webapp用户体验差（不能离线访问），用户粘性低（无法保存入口），pwa就是为了解决这一系列问题（Progressive Web Apps）,让webapp具有快速，可靠，安全等特点

**PWA一系列用到的技术**
- Web App Manifest - 将网站添加到桌面、更类似native的体验
- Service Worker (核心) - 离线存储
- Push Api & Notification Api
- App Shell & App Skeleton - 显示效果，数据还没载入时，页面上填充类似内容的灰色区域
    - 配置webpack插件 vue-skeleton-webpack-plugin，针对不同的页面加载不同的loading页面
    - 在index.html的标签内加入自定义的loading内容
    ```html
    <div id="app">
    <!-- custom loading content -->
    ...
    </div>
    ``` 
...

# Web App Manifest - 将网站添加到桌面、更类似native的体验
### Web App Manifest设置
```
// index.html
<link rel="manifest" href="/manifest.json">

// config信息
{
    "name":"课堂", // 应用名称  
    "short_name":"课堂", // 桌面应用的名称  ✓
    "display":"standalone", // fullScreen (standalone) minimal-ui browser ✓
    "start_url":"/index.html", // 打开时的网址  ✓
    "icons":[{
        "src": "manifest.png",
        "sizes": "144x144",
        "type": "image/png"
    }], // 设置桌面图片 icon图标 修改图标需要重新添加到桌面icons:[{src,sizes,type}]
    "background_color":"#aaa", // 启动画面颜色
    "theme_color":"#aaa" // 状态栏的颜色
}
```

### ios meta/link 私有属性设置
```html
// 图标icon
<link rel="apple-touch-icon" href="apple-touch-icon-iphone.png"/>
// 添加到主屏后的标题 和 short_name一致
<meta name="apple-mobile-web-app-title" content="标题"> 
// 隐藏safari地址栏 standalone模式下默认隐藏
<meta name="apple-mobile-web-app-capable" content="yes" /> 
// 设置状态栏颜色
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /> 
```



# Service Worker - pwa的核心
有啥用？

- Service Worker（以下简称sw）是基于WEB Worker而来的。Web Worker 的作用,就是为 JavaScript 创造多线程环境,允许主线程创建 Worker 线程,将一些任务分配给后者运行。sw便是在web worker的基础上增加了离线缓存的能力。

- sw是由事件驱动的,具有生命周期，可以拦截处理页面的所有网络请求(fetch)，可以访问cache和indexDB，支持推送，并且可以让开发者自己控制管理缓存的内容以及版本，为离线弱网环境下的 web 的运行提供了可能，让 web 在体验上更加贴近 native



### Service Worker简介：
- 不能访问／操作dom
- 会自动休眠，不会随浏览器关闭所失效(必须手动卸载)
- 离线缓存内容开发者可控
- 必须在https或者localhost下使用
- 所有的api都基于promise

service worker的生命周期
![image](/static/worker.png)

- 安装( installing )：这个状态发生在 Service Worker 注册之后，表示开始安装，触发 install 事件回调指定一些静态资源进行离线缓存。
- 安装后( installed )：Service Worker 已经完成了安装，并且等待其他的 Service Worker 线程被关闭。
- 激活( activating )：在这个状态下没有被其他的 Service Worker 控制的客户端，允许当前的 worker 完成安装，并且清除了其他的 worker 以及关联缓存的旧缓存资源，等待新的 Service Worker 线程被激活。
- 激活后( activated )：在这个状态会处理 activate 事件回调 (提供了更新缓存策略的机会)。并可以处理功能性的事件 fetch (请求)、sync (后台同步)、push (推送)。
- 废弃状态 ( redundant )：这个状态表示一个 Service Worker 的生命周期结束。

**serviceWorker中的方法**  
- self.skipWaiting():表示强制当前处在 waiting 状态的 Service Worker 进入 activate 状态
- event.waitUntil()：传入一个 Promise 为参数，等到该 Promise 为 resolve 状态为止。
- self.clients.claim()：在 activate 事件回调中执行该方法表示取得页面的控制权, 这样之后打开页面都会使用版本更新的缓存。旧的 Service Worker 脚本不再控制着页面，之后会被停止。



