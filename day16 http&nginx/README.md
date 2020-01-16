## 当我们输入网址后发生了什么
Client --request--> Server
Client <--response-- Server
发送请求 --》 网关 确认是否能从局域网到互联网
IPV4 - int型来表示区分标志 - 最大能提供2的32次方数量的IP地址
DNS服务器 - 用于转化域名和IP地址
获取到IP后找到对应IP的主机，路上会经过不同路由的转发
多个服务器可能会共用一个IP地址 （利用反向代理）

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

## DNS详解
域名解析，用于将域名解析为IP
顶级域名：xinhuanet.com (新华网，前面没有www); 

> 如何解析域名
![image](/static/dns-parse.png)

- Root Server - 根服务器 - 全球只有十几台，中国没有。
- TLD Server - 管理顶级域名
- Name Server - 管理非顶级域名：二级域名，三级域名...

- PC携带域名(www.google.com)访问DNS服务器询问IP地地址（DNS服务器是运营商负责维护的，我们的计算机只需要设置对应的DNS服务器地址既可以实现域名的解析）
    - 如果缓存了地址，直接返回该地址
    - 如果DNS服务器没有此域名的缓存地址，就去询问Root Server, Root Server检查域名后缀，看此后缀归哪个TLD服务器维护，并返回TLD服务器的信息。com = 1.1.1.1
        - DNS服务器继续向此TLD服务器继续询问，返回域名所在的顶级域名（google.com）归哪个服务器维护（Name Server）
            - DNS服务器最后向此Name服务器询问，返回www.google.com对应的IP
                - DNS获取到内容后，先缓存，再返回给PC
                （如果IP地址修改，就涉及到数据的同步和更新）


## TCP的三次握手和四次挥手
网络传输的协议模型类似于洋葱模型，一层一层的嵌套（扒开），每一层对上一层负责, 每一层向下传递时都把自己的协议和特性加上
> 应用层 (应用层+表示层+会话层) -> 传输层 -> 网络层 -> 数据链路层 -> 物理层

![image](/static/net-layer.png)
- TCP是面向连接的（举例：打电话，双方打招呼 喂喂喂，确认连接稳定再传输）
- UDP无连接（举例：局域网的广播，只管发送，不管是否接受到）

> TCP协议头信息展示  

![image](/static/TCP.png)

> 握手和挥手 （主动发起连接的就是客户端，等待别人连接的是服务端）
- 三次握手：（三次握手的目的是连接服务器指定端口，建立 TCP 连接，并同步连接双方的序列号和确认号，交换 TCP 窗口大小信息。在 socket 编程中，客户端执行 connect() 时。将触发三次握手。）
    - 第一次握手：SYN seq=x  
    客户端发起连接请求，SYN填在上方TCP协议头的Option处。以及初始序号 X,保存在包头的序列号(Sequence Number)字段里。发送完毕后，客户端进入 SYN_SEND 状态。
    - 第二次握手：(SYN seq=y, ACK=x+1):      
    服务器发回确认包(ACK)应答。即 SYN 标志位和 ACK 标志位均为1。服务器端选择自己 ISN 序列号，放到 Seq 域里，同时将确认序号(Acknowledgement Number)设置为客户的 ISN 加1，即X+1。 发送完毕后，服务器端进入 SYN_RCVD 状态。
    - 第三次握手(ACK=y+1)  
    客户端再次发送确认包, 把服务器发来 ACK 的序号字段+1，放在确定字段中发送给对方。

发送完毕后，客户端进入 ESTABLISHED 状态，当服务器端接收到这个包时，也进入 ESTABLISHED 状态，TCP 握手结束。
握手结束后进行多次通信，每次通信，顺序号都会进行增长，当数据发送完毕后就要断开连接了（减少性能消耗）。

-  四次挥手：（客户端或服务器均可主动发起挥手动作，在 socket 编程中，任何一方执行 close() 操作即可产生挥手操作。）
    - 第一次挥手：FIN seq=x1，ACK=y1  
        假设客户端想要关闭连接，客户端发送一个 FIN 标志位置为1的包，表示自己已经没有数据可以发送了，但是仍然可以接受数据。发送完毕后，客户端进入 FIN_WAIT_1 状态。
    - 第二次挥手：ACK=x1+1 (服务端发客户端)  
        通知客户端自己这边知道了
    - 第三次挥手：FIN seq=y1 (也是服务端发客户端)  
        服务端处理完手动的事情，再发送给客户端，说这边处理完毕可以结束
    - 第四次挥手：ACK=y1+1 （客户端发服务端）  
        客户端发送一个确认包，并进入 TIME_WAIT状态，等待可能出现的要求重传的 ACK 包。
        服务器端接收到这个确认包之后，关闭连接，进入 CLOSED 状态。
        客户端等待了某个固定时间（两个最大段生命周期，2MSL，2 Maximum Segment Lifetime）之后，没有收到服务器端的 ACK ，认为服务器端已经正常关闭连接，于是自己也关闭连接，进入 CLOSED 状态。

为什么挥手要四次，因为服务器要收尾，它自己的事情也要做完，为了避免超时，所以先发送自己已经知道了的信息，在处理完成自己这边的事情后，再发送给客户端通知自己这边的事情已经处理完了，可以断了。

![image](/static/tcp-inter.png)


## CDN 
> CDN的全称是Content Delivery Network，即内容分发网络。
根据所处位置的不同，访问某个站点（域名）时将最近的一个，耗时最短的一个该站点所在服务器的IP地址返回客户端内容。



## HTTPS协议分析 
Http和Https是两种协议，相比于Http, Https多了加密模块。
Https: 可理解为基于SSL的HTTP协议。HTTPS协议安全是由SSL协议实现的。
TLS协议是SSL协议的后续版本，SSL协议默认是TLS协议1.2版本。
加密方式：非对称加密
数字证书：是互联网通信中标识双方身份信息的数字文件，由CA签发

大致流程：
- ClientHello (client ---> server) 发送客户端的连接参数
- ServerHello (client <--- server) 选中客户端连接参数并发送服务端连接参数
- Certificate (client <--- server) 发送服务端证书供客户端校验身份
- ServerKeyExchange(可无)(client <--- server) 发送由服务端提供的秘钥生成参数
- ServerHelloDone (client <--- server) 声明服务端数据发送完毕
- ClientKeyExchange (client ---> server) 发送客户端提供的秘钥参数
- ChangeCipherSpec (client ---> server) 客户端已生成秘钥，后续通信需要加密
- Finished (client ---> server) 发送往来消息签名，确认未被篡改
- ChangeCipherSpec (client <--- server) 服务端已生成秘钥，后续通信需要加密
- Finished (client <--- server) 发送往来消息签名，确认未被篡改

## HTTP2协议分析
下一代的Http协议
标志: (1) 响应头：x-client-proto-ver: HTTP/2.0， （2）头的有的key值以冒号：开头

它与http的区别：
- 使用二进制格式传输，更高效，更紧凑
- 对报头进行压缩，降低开销，（http 1.1只能对报文压缩）
- 多路复用，一个网络连接实现并行请求 （http 1.1是串行传输）
- 服务器主动推送，减少请求延迟
- 默认使用加密

Http2伪头字段: 伪头部字段是http2内置的几个特殊的以”:”开始的 key，用于替代HTTP/1.x中请求行/响应行中的信 息，比如请求方法，响应状态码等
- :method 目标URL模式部分(请求)
- :scheme 目标URL模式部分(请求)
- :authority 目标RUL认证部分(请求)
- :path 目标URL的路径和查询部分(绝对路径 产生式和一个跟着"?"字符的查询产生式)。 (请求)

## 了解HTTP3 
HTTP-over-QUIC被更名为HTTP 3 （QUIC协议是什么(Quick UDP Internet Connection)）
处于测试中，Google推出，底层协议基于UTP，而不是TCP，和 http1.1 http2没什么关系
HTTP 3将会是一个全新的WEB协议

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

nginx 服务器重启命令，关闭
nginx -s reload ：修改配置后重新加载生效
nginx -s reopen ：重新打开日志文件
nginx -t -c /path/to/nginx.conf 测试nginx配置文件是否正确

关闭nginx：
nginx -s stop :快速停止nginx
quit ：完整有序的停止nginx

其他的停止nginx 方式：
ps -ef | grep nginx
kill -QUIT 主进程号 ：从容停止Nginx
kill -TERM 主进程号 ：快速停止Nginx
pkill -9 nginx ：强制停止Nginx



