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