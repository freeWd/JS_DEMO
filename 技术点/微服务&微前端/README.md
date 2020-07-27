## Docker Vs VM

VM存在的一些缺点

由于虚拟机存在这些缺点，Linux 发展出了另一种虚拟化技术：Linux 容器（Linux Containers，缩写为 LXC）
Linux 容器不是模拟一个完整的操作系统，而是对进程进行隔离。或者说，在正常进程的外面套了一个保护层。对于容器里面的进程来说，它接触到的各种资源都是虚拟的，从而实现与底层系统的隔离

Docker 虚拟操作系统
VM 虚拟硬件，在硬件上安装操作系统

VM 隔离性强
Docker 部署的程序涉及系统调用，会穿透容器，与底层操作系统交互



Docker是CS架构的程序，内部使用的和VM一样的虚拟化技术，外面套的壳不一样，是用GO语言写的

Docker 属于 Linux 容器的一种封装，提供简单易用的容器使用接口。它是目前最流行的 Linux 容器解决方案。
Docker 将应用程序与该程序的依赖，打包在一个文件里面。运行这个文件，就会生成一个虚拟容器。程序在这个虚拟容器里运行，就好像在真实的物理机上运行一样。有了 Docker，就不用担心环境问题。

Docker有两个概念
- Docker daemon 
    - 运行在宿主机上
    - 是Docker的守护进程
    - 用户通过Docker Client(命令行，也有界面的)与它交互
- Docker client
    - Docker 命令行程序，是使用docker的主要方式
    - Docker client与daemon交互，将通信结果返回给用户
    - clent也可以通过Socker 或者 RestFul api远程访问daemon


镜像 -- 容器

- Image 文件可以看作是容器的模板
- Docker 把应用程序及其依赖，打包在 image 文件里面。只有通过这个文件，才能生成 Docker 容器
- Docker 根据 image 文件生成容器的实例
- 同一个 image 文件，可以生成多个同时运行的容器实例
- 一个 image 文件往往通过继承另一个 image 文件，加上一些个性化设置而生成

- 一个镜像（自低向上）
 - 打一个低包（linux shell 环境 + 基础的库）
 - Debin
 - 自己程序的环境
 - 软件集成的库
 - app

dockerfile 一个文件，写的是怎么创建镜像（脚本）

dockerfile让守护进程处理，处理过程中生成镜像，镜像转化为容器

docker命令名和服务名都叫docker

dockerfile鱼龙混杂【有带官方的标签】

linux安装/启动docker服务：
```
yum -y install docker-io
docker version

systemctl start docker
```


docker 命令
- images相关 
```sh
# 展示本地镜像
docker images

# 获取镜像
docker pull ${image_name}:${tag} #tag可以不写，默认是latest

# 查找镜像
docker search ${image_name}

# 推送镜像
docker push ${image_name}

# 创建镜像 （前提是在要打包的代码目录下，且有 Dockerfile, .dockerignore等文件）
docker build -t ${image_name} .  # -t 表示可以添加标签在imagename后面，最后的 . 表示当前目录

# 删除
docker rmi ${image_id} # 删除镜像
docker rmi `docker images -q` # 删除本地所有镜像
```

- container 容器相关 (将镜像实例化为一个容器，能直接访问)
```sh
# 启动 【创建一个新的容器并运行一个命令】
docker run ${image_name}
# 常见的可选参数：i t d p
# -i: 交互式操作。
# -t: 终端
# -d: 后台运行并打印容器id
# -p: 映射端口

# example:
# docker run -t -i ubuntu:15.10 /bin/bash # 使用版本为15.10的ubuntu系统镜像来运行容器
# docker run -d -p 8080:3000 test_web  # 8080是宿主机端口，3000是内部端口

# 将一个已经终止的容器启动运行起来
docker start ${container_id}

# 查看
docker ps # 显示当前正在运行的容器
docker ps -a # 显示所有状态的容器
docker ps -s # 显示容器文件大小

# 删除
docker rm -f ${container_id}
docker rm -f `docker ps -a -q` # 删除本地所有容器

## 其他
docker stop [containerId]  # 终止容器运行
docker exec [containerId] # 进入一个正在运行的 docker 容器

## 查看运行容器的相关信息
docker inspect ${ID/NAMES} # 查看所有状态信息
docker inspect --format='{{.NetworkSettings.IPAddress}}' ID/NAMES # 查看容器ip地址
docker inspect --format '{{.Name}} {{.State.Running}}' ID/NAMES # 容器运行状态
docker top NAMES # 查看进程信息
docker port ID/NAMES # 查看端口

```

- Dockerfile相关内容
```js
// 项目所在文件夹：/Users/free_wd/getting-started

// 一段内容：
// 从仓库下载node环境
FROM node:12-alpine  

// 构建一个docker工作目录叫app, 并cd进去
WORKDIR /app  

// 将/Users/free_wd/getting-started/app里面的内容 都 复制到 docker的工作目录 /app里面去
// 前一个路径 app/. 是 当前电脑相对路径（真是的），后面一个 . 是代表docker工作目录路径
COPY app/. .  

RUN yarn install --production

// 如果启动出现问题，可以先注释掉
CMD ["node", "/app/src/index.js"]


# 一些含义
FROM	继承的镜像	          FROM node
COPY	拷贝	             COPY ./app /app
WORKDIR	指定工作路径	       WORKDIR /app
RUN	    编译打包阶段运行命令	RUN npm install
EXPOSE	暴露端口	          EXPOSE 3000
CMD	    容器运行阶段运行命令	CMD npm run start
```


## dcoker打包调试技巧：
- 先注释掉CMD启动命令，打包镜像app，然后用sh命令启动并进入容器
- docker run -ti ${image_name} sh


## 安装私有仓库遇到的问题
大体教程：https://blog.csdn.net/qq_42114918/article/details/81609465

问题
- 不知道如何提交的问题
```sh
# 比如本地有个test_dev的image想提交到私有服务器
docker tag 2712da33806d[image id] 192.168.0.104:5000/test_web
docker push 192.168.0.104:5000/test_web

# http与https的问题，导致提交失败
在本地的daemon配置文件中配置： 
"insecure-registries": ["192.168.0.104:5000"]
并重启本地docker服务

# 提交过程中一直retrying - 500的错误
服务器的安全服务导致的问题 (SELinux)，临时解决方法：
setenforce 0  - 将其关闭
```



