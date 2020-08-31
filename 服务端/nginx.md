## 反向代理与 WEB 服务

代理：科学上网， 帮我们做一些事情
client1 -> proxy -> server
client2 -> proxy -> server

反向代理：多个服务器在一个机房，共用一个网络出口，出口处设置反向代理 web 服务器，它会收集请求，根据规则匹配将请求转发到此机房中的某个服务器

- 加密(配置 https)和 SSL 加速
- 负载均衡 - （任务分配）多台服务器做同样的事情，缓解压力，横向扩张
  负载均衡策略：内置策略（轮询，加权轮询，IP Hash）,扩展策略-自定义
- 缓存静态内容
- 压缩 - gzip - 在机房内部压缩完再送出机房
- 减速上传 - eg: 百度网盘上传速度被限制
- 安全 - 尽量少的暴露服务器，攻击行为要先走反向代理，才能再攻击服务器
- 外网发布 - 多个 webapp 在服务器上启动使用不同的端口，对于用户不友好，通过反向代理服务器对外提供一个统一的端口，发布应用

## nignx 安装
http://nginx.org/en/docs/

mac 上的安装：https://segmentfault.com/a/1190000016020328
linux 上的安装：https://segmentfault.com/a/1190000018109309

## nginx 基本命令

```sh
where nginx
nginx -help # 查看基本信息和路径位置

# ==> nginx 服务器重启命令，关闭
nginx -s reload #修改配置后重新加载生效
nginx -s reopen  # 重新打开日志文件
nginx -t -c /path/to/nginx.conf # 测试nginx配置文件是否正确
nginx -c 配置文件 # 指定配置文件启动

# ==> 关闭nginx：
nginx -s stop :快速停止nginx
quit ：完整有序的停止nginx

# ==> 其他的停止nginx 方式：
ps -ef | grep nginx
kill -QUIT 主进程号 ：从容停止Nginx
kill -TERM 主进程号 ：快速停止Nginx
pkill -9 nginx ：强制停止Nginx
```

## nginx 配置信息

### nginx 文件结构

```sh
...              #全局块

events {         #events块
   ...
}

http      #http块
{
    ...   #http全局块
    server        #server块
    {
        ...       #server全局块
        location [PATTERN]   #location块
        {
            ...
        }
        location [PATTERN]
        {
            ...
        }
    }
    server
    {
      ...
    }
    ...     #http全局块
}
```

- 全局块：配置影响 nginx 全局的指令。一般有运行 nginx 服务器的用户组，nginx 进程 pid 存放路径，日志存放路径，配置文件引入，允许生成 worker process 数等
- events 块：配置影响 nginx 服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等
- http 块：可以嵌套多个 server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type 定义，日志自定义，是否使用 sendfile 传输文件，连接超时时间，单连接请求数等
- server 块：配置虚拟主机的相关参数，一个 http 中可以有多个 server
- location 块：配置请求的路由，以及各种页面的处理情况

---

### 配置文件详细信息

```sh
########### 每个指令必须有分号结束。#################
#user administrator administrators;  #配置用户或者组，默认为nobody nobody。
#worker_processes 2;  #允许生成的进程数，默认为1
#pid /nginx/pid/nginx.pid;   #指定nginx进程运行文件存放地址
error_log log/error.log debug;  #制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
events {
    accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
    #use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections  1024;    #最大连接数，默认为512
}
http {
    include       mime.types;   #文件扩展名与文件类型映射表
    default_type  application/octet-stream; #默认文件类型，默认为text/plain
    #access_log off; #取消服务日志
    log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; #自定义格式
    access_log log/access.log myFormat;  #combined为日志格式的默认值
    sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    keepalive_timeout 65;  #连接超时时间，默认为75s，可以在http，server，location块。

    upstream mysvr {
      server 127.0.0.1:7878;
      server 192.168.10.121:3333 backup;  #热备
    }
    error_page 404 https://www.baidu.com; #错误页
    server {
        keepalive_requests 120; #单连接请求上限次数。
        listen       4545;   #监听端口
        server_name  127.0.0.1;   #监听地址
        location  ~*^.+$ {       #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
           #root path;  #根目录
           #index vv.txt;  #设置默认页
           proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表
           proxy_redirect default; # 指定修改被代理服务器返回的响应头中的location头域跟refresh头域数值
           proxy_set_header Host $host; # 修改代理请求头中的host信息
           proxy_http_version 1.1;
           deny 127.0.0.1;  #拒绝的ip
           allow 172.18.5.54; #允许的ip
        }
        
        # ==> webscoket 代理
        location /chat/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

- proxy_redirect：
  - 默认值为 default,将根据 location 和 proxy_pass 参数的设置来决定。
  - 参数为 off 将在这个字段中禁止所有的 proxy_redirect 指令
  - 假设被代理服务器返回 Location 字段为： `http://localhost:8000/two/some/uri/`
    这个指令： proxy_redirect `http://localhost:8000/two/ http://frontend/one/`;
    将 Location 字段重写为`http://frontend/one/some/uri/`。

### nginx 浏览器请求、响应缓存配置

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

### 反向代理 & 负载均衡

https://www.runoob.com/w3cnote/nginx-proxy-balancing.html

负载均衡的策略：
- 热备份
- 轮询
- 加权轮询
- ip_hash: nginx会让相同的客户端ip请求相同的服务器（比如：保存会话）

```sh
# 热备：如果你有2台服务器，当一台服务器发生事故时，才启用第二台服务器给提供服务。服务器处理请求的顺序：AAAAAA突然A挂啦，BBBBBBBBBBBBBB.
upstream mysvr { 
    server 127.0.0.1:7878; 
    server 192.168.10.121:3333 backup;  #热备     
}


# nginx默认就是轮询其权重都默认为1，服务器处理请求的顺序：ABABABABAB
upstream mysvr { 
    server 127.0.0.1:7878;
    server 192.168.10.121:3333;       
}

# 跟据配置的权重的大小而分发给不同服务器不同数量的请求。如果不设置，则默认为1。下面服务器的请求顺序为：ABBABBABBABBABB
upstream mysvr { 
    server 127.0.0.1:7878 weight=1;
    server 192.168.10.121:3333 weight=2;
}

# ip_hash:nginx会让相同的客户端ip请求相同的服务器
upstream mysvr { 
    server 127.0.0.1:7878; 
    server 192.168.10.121:3333;
    ip_hash;
}

```

### 配置https

### 配置http 2
http://nginx.org/en/docs/http/ngx_http_v2_module.html