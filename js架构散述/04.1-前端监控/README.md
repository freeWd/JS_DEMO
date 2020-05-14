前端监控:

- 技术监控
  - 页面性能监控
  - 静态资源性能监控
  - 错误监控
  - 接口性能监控

- 行为监控
  - 用户行为路径
  - 打点监控
  - log 上报策略
  - 时效策略

MDN:

- https://developer.mozilla.org/zh-CN/docs/Web/API/Window/performance
- https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming

先看下 url 从输入到网页加载的一个全过程图
![image](/static/performance.png)

在 Performance 分析中一些关键的参数：
参数 | 含义 | 默认值 | 备注
---|--- | --- | ---
navigationStart | 前一个页面卸载的时间 | fetchStart |
unloadEventStart | 前一个网页 unload 事件开始 | 0 |
unloadEventEnd | 前一个网页 unload 事件结束 | 0
redirectStart | 重定向开始 | 0 | 需要同域
redirectEnd | 重定向结束 | 0 | 需要同域
`server部分的性能检测` |
fetchStart | 开始请求网页 | |
domainLoopupStart | DNS 查询开始 | fetchStart |
domainLoopupEnd | DNS 查询结束 | fetchStart |
connectStart | 向服务器建立握手开始 | fetchStart |
connectEnd | 向服务器建立握手结束 | fetchStart |
securityConnectionStart | 安全握手开始 | 0 | 非 https 没有
requestStart | 向服务器发送请求开始
responseStart | 服务器返回数据开始
responseEnd | 服务器返回数据结束
`Frontend部分的性能检测` |
domLoading | 解析 dom 开始 | | document.readState 为 loading
domInteractive | 解析 dom 结束 | | document.readState 为 interactive (dom 文档解析结束，但不考虑图片等资源是否都加载成功)
DOMContentLoadedEventStart | Contentloaded 开始 | | DOMContentLoaded 所有回调开始运行
DOMContentLoadedEventEnd | Contentloaded 结束 | | DOMContentLoaded 所有回调结束运行
domComplete | 文档解析完成
loadEventStart | load 事件发送前
loadEventEnd | load 事件发送后

浏览器对页面的加载细节：https://www.cnblogs.com/gg-qq/p/11327972.html

一些模糊点的区别

- 加载小细节：加载和解析

  - 加载可以理解为下载
  - 解析（构建）可以理解为将下载下来的文本按照其对应的类型由浏览器编译成对应的“东西”或者“结构”
  - 浏览器执行的顺序
    - 浏览器会对整个的 html 文件进行编译，转化成类似树形的结构
    - 浏览器会对转化后的数据结构自上而下进行分析
      - 首先开启下载线程，对所有的资源进行优先级排序下载（注意，这里仅仅是下载。
      - 同时主线程会对文档进行解析
    - 遇到 link，检测是否已下载，没下载就下载，下载了就构建 CSSOM（构建是不阻塞主线程对 dom 的解析的）
    - 遇到 script, 检测是否下载，没下载就下载，下载了就执行代码（script 构建是阻塞主线程的解析的）
    - 在 body 的第一个 script 资源下载完成之前，浏览器会进行首次渲染，将 script 标签之前的 DOM 和 CSSOM 合并为一颗 Render 树，渲染到页面，这是页面从白屏到首次渲染的时间节点，script 之后的 dom 要等到 script 解析之后才继续执行

- 监听事件： DOMContentLoaded 和 load 的区别

  - DOMContentLoaded:

    - 当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完成加载。
    - 注意：DOMContentLoaded 事件必须等待其所属 script 之前的样式表加载解析完成才会触发。`其所属脚本`指的得是编写了监听 DOMContentLoaded 事件的 script 文件
    - 这是来自 MDN 的定义，可能觉得前后有点矛盾，实际上是没有问题的，前提是要比较清楚的了解浏览器对 DOM 加载以及其中出现外链 link,script 的加载逻辑，可以看上面的链接
    - 无需等待子框架的完成,但是 DOMContentLoaded 事件在 html 文档加载完毕，并且 html 所引用的内联 js、以及外链 js 的同步代码都执行完毕后触发

  - load: 应该仅用于检测一个完全加载的页面, 页面的 html、css、js、图片等资源都已经加载完之后才会触发 load 事件

## 页面性能监控

> 参考文档：https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming

> 代码文件目录: monitor-sdk/performance.js

 (性能分析文件： `perfromance.js`中主要逻辑就是写在这两个监听函数里面 【DOMContentLoaded, Load】)


 ## 静态资源监控
`resource.js`文件处理静态资源监控

主要通过 `const observer = new PerformanceObserver()`来实现

```js
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const resourceInfoArr = Util.format(entries);
  console.log("=====> resource ====>");
  callBackFn(resourceInfoArr);
});
observer.observe({ entryTypes: ["resource"] });
```

 ## 错误监控
`errorCatch.js`文件处理错误信息的监控

主要是针对 `onerror` 和 `onunhandledrejection` 函数的重写

关于异常的信息获取还有要考虑 现代化的使用webpack打包后的应用，应用的代码都被混淆压缩，无法准确获取错误信息
关于这类错误，需要保留打包后的sourceMap文件，通过工具将编译后的代码转化为源码
查看 `app-source-map.js`文件 查看此类问题的demo

 ## 接口性能监控
`xhr.js`文件处理接口性能监控

> https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest

`更多现代浏览器，包括 Firefox，除了可以设置 on* 属性外，也提供标准监听器 addEventListener() API 来监听XMLHttpRequest 事件。`

- 监听xhr的三个事件 (这三个是xhr内部的事件，注意和windows的全局事件区分开)
 - load: XMLHttpRequest请求成功完成时触发
 - error: 当request遭遇错误时触发
 - abort: 当 request 被停止时触发，例如当程序调用 XMLHttpRequest.abort() 时

某些情况下还需要关注的属性：`XMLHttpRequest.onreadystatechange` (通常在写js原生ajax时对于返回的结果需要重写此函数)

## 用户