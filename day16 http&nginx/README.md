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



