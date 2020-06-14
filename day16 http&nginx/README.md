## HTTP协议详解 
HTTP是超文本传输协议
HTTP协议是由从客户机到服务器的请求(Request)和从服务器到客户机 的响应(response)进行约束和规范
一次操作为一次事务：
1） 短连接：先建立TCP连接  -》 发送请求 -》接收响应 -》 关闭TCP连接
2） 长连接：先建立TCP连接 -》 发送请求 -》 接收响应 -》 发送请求 -》 接收响应 ..... -》 关闭TCP连接
建立、关闭连接有三次握手和四次挥手的过程，对性能开销有一定的影响

## HTTP解析过程的详细描述
![image](/static/http.png)
> 1-3 缓存和准备工作  4-7网络操作  8-9数据获取后的处理

1. Prompt for unload [navigationStart导航开始]
    - 发送老页面准备卸载的提醒
2. redirect & unload 【缓存优化】
    - 本地重定向，先要从缓存中找。
    - 正式卸载老页面
3. App Cache
    - 操作浏览器缓存
4. DNS （域名系统（DNS）是建立在分布式数据库上的分层命名系统。该系统将域名转换为 IP 地址，并可以将域名分配给 Internet 组资源和用户，无论实体的物理位置如何）【CDN优化】
    - 浏览器获取DNS地址（从本机上获取，本机上的DNS是在连接路由器时由路由器将其和动态IP一起给予本机的）
5. TCP （TCP是传输层协议，HTTP是应用层协议，TCP是更底层的协议，连接HTTP必须先连接TCP） 【长连接，HTTP2、3协议】
    - 浏览器通过DNS将域名转化为IP地址，通过IP使用TCP协议连接服务器，可能中间包括安全连接
    - 每次开始连接TCP要进行三次握手
    - 结束后TCP断开连接四次挥手
6. Request 请求 【服务器性能，吞吐量，代码优化】
7. Response 响应 【数据压缩（平衡点-因为压缩和解压缩也要消耗时间）优化 gzip】
8. Processing 进程，解析（以返回HTML为例）
    - 载入DOM到内存 
    - 解析文档，生成DOM
    - DOM交互事件绑定
    - 渲染DOM...【只渲染可视的部分】
9. OnLoad


## CDN 
> CDN的全称是Content Delivery Network，即内容分发网络。
根据所处位置的不同，访问某个站点（域名）时将最近的一个，耗时最短的一个该站点所在服务器的IP地址返回客户端内容。



## 反向代理与WEB服务
代理：科学上网， 帮我们做一些事情 
    client1 -> proxy -> server
    client2 -> proxy -> server

反向代理：多个服务器在一个机房，共用一个网络出口，出口处设置反向代理web服务器，它会收集请求，根据规则匹配将请求转发到此机房中的某个服务器

- 加密(配置https)和SSL加速
- 负载均衡 - （任务分配）多台服务器做同样的事情，缓解压力，横向扩张
    负载均衡策略：内置策略（轮询，加权轮询，IP Hash）,扩展策略-自定义
- 缓存静态内容
- 压缩 - gzip - 在机房内部压缩完再送出机房
- 减速上传 - eg: 百度网盘上传速度被限制
- 安全 - 尽量少的暴露服务器，攻击行为要先走反向代理，才能再攻击服务器
- 外网发布 - 多个webapp在服务器上启动使用不同的端口，对于用户不友好，通过反向代理服务器对外提供一个统一的端口，发布应用


nginx.conf
```sh
worker_processes  // 进程数 - 默认 1 
events {
    worker_connections  1024; // 一个进程最大并发数
}

// upstream 用来配置转发服务
updstream web_crm {
    server 127.0.0.1:8080
}
updstream web_mgrsys {
    server 127.0.0.1:8090
}

// 执行转发逻辑
// ~*^.+$  ~区分大小写，~*不区分大小写
location /crm {
    proxy_pass http://web_crm/crm/;  // import!! web_crm = 上面的127.0.0.1:8080
    
    proxy_redirect off;
    proxy_set_header Host $host;

    proxy_http_version 1.1
    ...
    ...
}
```

#### nginx浏览器请求、响应缓存配置
```sh
http {
    # ...
    #缓存配置信息
    etag  off; #默认是on
    expires 38d; #默认是off
    if_modified_since off;
    add_header Cache-control no-cache;
}
```

nginx 服务器重启命令，关闭
nginx -s reload ：修改配置后重新加载生效
nginx -s reopen ：重新打开日志文件
nginx -t -c /path/to/nginx.conf 测试nginx配置文件是否正确
nginx -c 配置文件 ： 指定配置文件启动

关闭nginx：
nginx -s stop :快速停止nginx
quit ：完整有序的停止nginx

其他的停止nginx 方式：
ps -ef | grep nginx
kill -QUIT 主进程号 ：从容停止Nginx
kill -TERM 主进程号 ：快速停止Nginx
pkill -9 nginx ：强制停止Nginx



