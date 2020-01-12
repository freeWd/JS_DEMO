## Chrome V8 垃圾回收机制 （分代式垃圾回收机制）
新生代 和 老生代
* 新生代为存活时间较 短对象
    - 新生代的对象主要通过Scavenge算法进行 垃圾回收，再具体实现时主要采用Cheney算法。Cheney算 法是一种采用复制的方式实现的垃圾回收算法。
    - 它将内存 一分为二，每一个空间称为semispace。这两个semispace中 一个处于使用，一个处于闲置。处于使用的称之为From, 闲置的称之为To
    - 分配对象时先分配到From,当开始进行垃 圾回收时，检查From存活对象赋值到To.非存活被释放。 然后互换位置。再次进行回收，发现被回收过直接晋升， 或者发现To空间已经使用了超过25%。
    - 它的缺点是只能使 用堆内存的一半，这是一个典型的空间换时间的办法， 但 是新生代声明周期较短，恰恰就适合这个算法

* 老生代中为存活时间较长的对象。
    - V8老生代主要采用Mark-Sweep和Mark-compact,
    - 再使 用Scavenge不合适。一个是对象较多需要赋值量太大 而且还是没能解决空间问题。
    - Mark-Sweep是标记清除，标记那些死亡的对象，然后清除。但是清除过 后出现内存不连续的情况，所以我们要使用 Mark-compact，它是基于Mark-Sweep演变而来的，他先将 活着的对象移到一边，移动完成后，直接清理边界 外的内存。当CPU空间不足的时候会非常的高效。

## Node 爬虫
自动获取网页内容，是搜索引擎的重要组成部分，搜索引擎的优化相当大一部分是对爬虫的优化

robots.txt是一个文本文件，它是一个协议，不是一个命令，它是爬虫要查看的第一个文件，它告诉爬虫在服务器上什么文件是可以被查看的。搜索机器人就会按照该文件中的内容来确定访问的范围。

爬虫抓取的是html内容，对于传统的爬虫而言是无法获取ajax（异步）请求的渲染后的内容的，在还没放回结构渲染时，爬虫已经获取好html文本了，google据说已经搞定这块了。 这就是为啥SPA的web站点的一个大缺点。

img
![image](/static/reptile.png)


## Node部署 搭配 nginx
pm2动态监测文件(NODE.JS的高级生产过程管理器)
- 能动态的监测文件的上传，0秒热启动
- 能够负载均衡CPU
- 内存的使用，过多的cpu调度，会帮忙重启

**npm install pm2 -g**

// pm2.json - 与 node的app.js紧密相连
```json
// 重要配置项
{
  // Applications part
  "apps" : [{
    "name"      : "API",
    "script"    : "app.js",
    "watch"     : true,  // !! 监控文件和文件夹的变动，重新加载
    "instances" : "max", // !! 要启动的应用程序实例数 max 占满cpu
    "exec_mode" : "cluster" // !! 模式来启动您的应用，可以是“集群 culster”或“fork”，默认为fork ,fork是启一个实例，其他的向其他cpu复制，cluster是多个独立的实例
  }]
}
```

```sh
# 用pm2启动node
pm2 start pm2.json 

# 列出由PM2管理的所有应用程序的状态
pm2 ls  

# 实时展示log
pm2 logs 

 # 终端Dashboard展示
pm2 monit

# --- action
pm2 stop all           # Stop all processes
pm2 restart all        # Restart all processes

pm2 reload all         # Will 0s downtime reload (for NETWORKED apps)

pm2 stop 0             # Stop specific process id
pm2 restart 0          # Restart specific process id

pm2 delete 0           # Will remove process from pm2 list
pm2 delete all         # Will remove all processes from pm2 list

# node第三方库安装
npm install --production
```







