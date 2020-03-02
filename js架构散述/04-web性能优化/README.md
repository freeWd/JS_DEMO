# WEB性能优化 
> 可以先看day 16中关于http的内容，了解哪些地方可以优化

## 代码层面注意的事项
> 雅虎军规 (一共35条，下面展示部分相对重要的， 完整的查看 https://www.cnblogs.com/xianyulaodi/p/5755079.html)

### 内容部分
1.尽量减少HTTP请求数 （80%的终端用户响应时间都花在了前端上，其中大部分时间都在下载页面上的各种组件）  
- 合并文件，把所有脚本放在一个文件中的方式来减少请求数的
- CSS Sprites 减少图片的请求数量。把背景图片都整合到一张图片中，然后用CSS的background-image和background-position属性来定位要显示的部分
- 　行内图片（Base64编码）用data: URL模式来把图片嵌入页面
- 图像映射 可以把多张图片合并成单张图片，总大小是一样的，但减少了请求数并加速了页面加载
```html
<img src="planets.jpg" border="0" usemap="#planetmap" alt="Planets" />
<map name="planetmap" id="planetmap">
    <area shape="circle" coords="180,139,14" href ="venus.html" alt="Venus" />
    <area shape="circle" coords="129,161,10" href ="mercur.html" alt="Mercury" />
    <area shape="rect" coords="0,0,110,260" href ="sun.html" alt="Sun" />
</map>
```

2.减少DNS查找 (DNS是有成本的，它需要20到120毫秒去查找给定主机名的IP地址。在DNS查找完成之前，浏览器无法从主机名下载任何东西) 把组件分散在2到4个主机名下，这是同时减少DNS查找和允许高并发下载的折中方案。

3.减少重定向(牢记重定向会拖慢用户体验，在用户和HTML文档之间插入重定向会延迟页面上的所有东西，页面无法渲染，组件也无法开始下载，直到HTML文档被送达浏览器。)  
有一种常见的极其浪费资源的重定向，而且web开发人员一般都意识不到这一点，就是URL尾部缺少一个斜线的时候。例如，跳转到http://astrology.yahoo.com/astrology会返回一个重定向到http://astrology.yahoo.com/astrology/的301响应（注意添在尾部的斜线）。在Apache中可以用Alias，mod_rewrite或者DirectorySlash指令来取消不必要的重定向。

4.让Ajax可缓存 - 对于短时间不会更改，或者有特定条件的请求的数据可以将它缓存起来，下次直接拿缓存中的数据

5.延迟加载组件 (可以凑近看看页面并问自己：什么才是一开始渲染页面所必须的？其余内容都可以等会儿。)     
html5中给script标签引入了 async 和 defer 属性。async和defer都是异步加载
- async谁先加载完谁执行，和DOMContentLoaded的先后顺序对比不确定 (不能使用document.write方法)  
    - 浏览器开始解析页面
    - 遇到有sync属性的script标签，会继续往下解析，并且同时另开进程下载脚本
    - 脚本下载完毕，浏览器停止解析，开始执行脚本，执行完毕后继续往下解析
- defer (不能使用document.write方法) 
    - 浏览器开始解析HTML页面
    - 遇到有defer属性的script标签，浏览器继续往下面解析页面，且会并行下载script标签的外部js文件
    - 解析完HTML页面，再执行刚下载的js脚本（在DOMContentLoaded事件触发前执行，即刚刚解析完</html>，且可保证执行顺序就是他们在页面上的先后顺序）
    
6.预加载组件

7.减少DOM元素的数量

8.尽量少用iframe 用iframe可以把一个HTML文档插入到父文档里，重要的是明白iframe是如何工作的并高效地使用它。
- 优点
    - 引入缓慢的第三方内容，比如标志和广告
    - 安全沙箱
    - 并行下载脚本
- 缺点
    - 代价高昂，即使是空白的iframe
    - 阻塞页面加载
    - 非语义

9 CSS使用Link标签，放在顶部

10 JS脚本放在底部

11 不要用HTML缩放图片 (不要因为在HTML中可以设置宽高而使用本不需要的大图。如果需要那么图片本身应该是100x100px的)


### 对于静态资源的缓存
静态资源分为两大类：
- 不常变的，类似工具类，公共类的代码，直接设置Cache-Control, Expire响应头 99年
- 变动比较频繁的，类似逻辑，业务类的代码。 不设置Cache-Control, Expire。 直接设置Last-Modify或者Etag。因为设置强制缓存时间不好把握，也会让用户销毁更多的存储空间。
```js
// 对于变动频繁的代码，etag虽然可行，但为进一步提高性能。可以配合localstorage存储
// 下面是伪代码
1. let obj = {
    'a.js': 'a.xxxx1.js' // md5或版本号
}

2. active.js

3. a.js

4. active('a.js')

5. localStorege['a.js']  // 每个域名最大存储空间5M
    -> script src = 'a.js' (没有存过)
        script src = 'a.js' -> localStorage['a.js'] = "a.xxxx1.js"
                            -> localStorage['a.xxxx1.js'] = 'js代码'
    
    -> localStorage['a.js'] = abj['a.js'] (存储过了)
        -> eval(localStorage['a.xxxx1.js'])
        -> 请求并重新缓存

// 操作相关代码库：
// 前端ORM存储⽅案: localForage
// basket.js 使用localStorage缓存和加载脚本 
```

### 响应头缓存信息设置优先级
Cache-Control > Expires > Etag > Last-Modify
![image](/static/cache.png)

除了响应头的缓存之外，http1.1 还可以设置一个请求头

- connection:keep-alive（同一域名的多次请求用一个TCP连接）

  可以实现一个TCP连接中，可以发送多个http请求，这样浏览器可以继续通过相同的TCP连接发送多次请求，可以避免多次建立/释放tcp带来的损耗。  

    - 当你的Server内存充足时，KeepAlive =On还是Off对系统性能影响不大。
    - 当你的Server上静态网页(Html、图片、Css、Js)居多时，建议打开KeepAlive 
    - 当你的Server多为动态请求(连接数据库，对文件系统访问较多)，KeepAlive 关掉，会节省一定的内存，节省的内存正好可以作为文件系统的Cache(vmstat命令中cache一列)，降低I/O压力。

上面Connection是Http1.1中的请求头，在Http2.0中已经实现了多路复用，可以在原来基础上进一步优化。
原来的http1.x是基于文本的，内容是串行发送的
http2升级了，基于流。带上帧的顺序标志，可以交错发送。达到内容可以并行发送的效果。


## 重绘和重排，网页整体渲染过程(渲染中的性能优化)
1. 获取dom  按层来分割（整个页面是一层一层堆叠上去的）
2. 根据每层的节点结算样式结果 Recalculate Style （重新计算样式） 【F12开发者工具 -> Performence -> 底部菜单 Call Track】
3. 为每个节点生成图形和位置： Layout （元素位置排布布局）
4. 将每个节点绘制填充到当前帧的图层位图中 Paint (绘制)
5. 将上面绘制出来的图层位图上传到GPU上面, GPU BitMap(位图) 专门处理图像
6. 显卡根据我们的要求将符合要求的图层合并成图像最终生成出来。Composite Layers

> 总结上面渲染部分大体分为三个大阶段：Layout 排 -》 Paint 绘制 -》 Composite Layers合成输出

- 页面分很多层，什么情况会分层？
    - 根元素（RenderLayer），网页的root节点，带有Position属性， overview, transform, 半透明，滤镜，Canvas, Video
        - 按照上面的步骤可以看出来。页面的分层GPU会参与，如果我们跳过浏览器的 排和绘的过程。直接交给GPU渲染，就能省钱全面步骤的时间，从而提高渲染的性能。
    - 如何才能让GPU直接参与渲染呢？
        - CSS 3D, Video, webGl, transform, 滤镜 （硬件加速）,Canvas, z-index大于某个相邻节点的layer元素， Animation
        【F12开发者工具 -> Performence -> 底部菜单 Summary (Idle - 空闲状态)】

- RenderLayer --> RenderObject --> GraphicsContext
- Compositor ---> 渲染层子树的图形层（GraphicsLayer）---> RenderLayer ---> RenderObject

Compositor将拥有图层进行合成，合成过程中GPU进行参与，合成完毕后就能将纹理映射到一个网络结构之上。Chrome能将纹理将页面中的内容按块分发给GPU，以很低的代价映射到不同的位置上，而且能以很低的代价把它们应用到一个非常简单的矩形网格中进行变形。

网页生成的时候，至少会渲染一次，用户访问的过程中还会不断的重新渲染。以下三种情况会导致网页的重新渲染。
- 修改DOM
- 修改样式表
- 用户事件 
重新渲染就是需要重新生成布局和重新绘制，前置是重排，后者是重绘。

- 重排一定会引起重绘，重绘不一定会引起重排，重绘和重排的的DOM元素层级越高，成本就越高
    - 什么属性是重绘？
        - box-shadow, color ...
    - 什么属性是重排（条件比较多）
        - 添加和删除元素
        - 元素位置变化
        - 元素尺寸变化（盒子）
        - 页面的初始化
        - ！！！js读取某些元素的时候也会引起重排
            - 比如：读取clientHeight、offsetHeight、scrollHeight、offsetTop、scrollTop, width, height... 不敢不重排，为什么? 【读取的值要使用时才会重排，不使用不会】
            ```js
            // 伪代码
            var h1 = $('#h1').clientHeight;
            
            // 浏览器不会那么傻，在每次设置一次属性就重新渲染，而是对你的多次设置进行合成，统一渲染。
            // 如果在设置中间插入读取某些属性的操作，就会破坏这种合并，立即渲染。
            // 为什么立即渲染？ 这些属性是网页的其他影响的一些变化，如果不重排，等到后面再渲染，中间如果元素的高度发生变化，就会导致最终渲染的不准确。
            $('xx').css('height', h1);
            h1 = $('#h1').offsetHeight;
            $('xx').css('width', h1)

            // 为了避免上面这种情况(破坏浏览器优化)的出现，使用requestAnimationFrame，等到下一帧的时候再统一的读，统一的写
            // requestAnimationFrame(callBackFn); 
            ```
`window.requestAnimationFrame()` 告诉浏览器——你希望执行一个动画，并且要求浏览器在`下次重绘`之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。


> 综上我们的目标就是减少不必要的重排（reflow）和重绘 (repaint)    
- 减少重排：
    - 样式表越简单，越快
    - 少用table元素，table元素的重排，重绘成本大于div
    - 尽量读操作和写操作分开，不写在一个语句里面
    - 统一改变样式
    - 缓存重排的结果
    - 离线DOM Fragment / clone
    - 虚拟DOM React
    - 必要的时候 display:none

- 减少重绘：
    - 对于一些暂不显示的区域可以使用display:none, 将这一快暂时隐藏。(避免不必要的绘制)
    - 减少绘制区域，为大范围的绘制的元素，分解成独立的Layout, 用来减少绘制的范围。

https://csstriggers.com/
http://jankfree.org/


### 页面加载中的性能优化
要开始页面加载的性能优化，需要先了解一些基本概念。
- TTFB (Time To First Byte 首字节时间)
- FP（First Paint 首次绘制）- 第一个样式出现
- FCP(First Contentful Paint 首次内容绘制) - 第一个内容渲染出现
- FMP(First Meaningful Paint 首次有意义的绘制) - 主观：不同应用定义的角度不一样
- TTI(Time To Interactive 可交互时间) - 页面呈现后用户可以与网页元素进行交互的时间。
- Long tasks(超过50ms的任务)
- SSR & CSR （服务端渲染 & 客户端渲染）

下面展示了页面处在不同阶段的渲染情况和
![image](/static/loading.png)
![image](/static/loading-time.png)

> 上面FP的这段时间就是页面的白屏时间, 为什么会出现白屏？
白屏所属的时间区间内，主要包含下面的一些行为：
CSS，JS文件的获取 & JS文件的解析 & DOM生成 & CSSDOM的生成... 

对比客户端渲染，预渲染，服务端渲染，同构的优缺点
![image](/static/ssr&csr.png)



## 引起nodejs内存泄露的情况
- 全局变量需要进程退出才能释放
- 闭包引用中间函数，中间函数不会释放，会使得原始的作用域不会释放，作用域不被释放它产生的内存占用也不会被释放，所以使用后设置为null等待垃圾回收
- 谨慎使用内存当做缓存，建议采用Redis或者Memcached,外部缓存软件有成熟的缓存策略和内存管理，不影响node的主线程性能。减少内部常驻的对象数量能提高垃圾回收的效率，进程间共享缓存。

node如何调试：
- node --inspect app.js 
- chrome浏览器访问 chrome://inspect/#devices
- 选择inspect打开新的开发者工具用于调试node







 












