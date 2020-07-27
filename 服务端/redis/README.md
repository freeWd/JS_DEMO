# Redis 入门
Redis 是完全开源免费的，遵守BSD协议，是一个高性能的key-value数据库。

## 优势：
* 性能极高 – Redis能读的速度是110000次/s,写的速度是81000次/s 。
- 丰富的数据类型 – Redis支持二进制的字符串、列表、哈希值、集合和有序集合等数据类型操作。
- 原子性 – Redis的所有操作都是原子性的，意思就是要么成功执行要么失败完全不执行
- 单个操作是原子性的。多个操作也支持事务，即原子性，通过MULTI和EXEC指令包起来。
- 丰富的特性 – Redis还支持 发布/订阅, 通知, key 过期等等特性。

## 使用场景
每次客户端请求服务器，获取db中的数据，如果多次访问，每次都要读取db，性能上相对不高
我们可以在db和server之间再加一层：redis。每次请求的时候先从server到redis，如果redis没有就访问db，redis将结果缓存起来，
下次再访问就直接从redis中查询给server。

## mac安装redis
```
brew install redis
```

## 启动
```sh
# 在后台启动的server
brew services start redis

# 使用配置文件启动server
redis-server /usr/local/etc/redis.conf

# 直接启动server
reids-server &

# 启动客户端
redis-cli
```
