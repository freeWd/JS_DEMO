> 天下古今之庸人，皆以一惰字致败。天下古今之才人，皆以一傲字致败 - 曾国藩

## Cookie & Session
- cookie 客户端 每次发请求的时候，浏览器正常的请求中会自动将cookie的值放在请求头中带给服务端
- cookie既可以在客户端设置（document.cookie） 也 可以在服务端设置（response header set-cookie）
    - domain 可以访问此cookie的域名。 (默认为设定该Cookie的域名)， 所指定的域名必须是当前发送Cookie的域名的一部分，比如当前访问的域名是example.com，就不能将其设为google.com。只有访问的域名匹配domain属性，Cookie才会发送到服务器。
    - path 字段为可以访问此cookie的页面路径。 比如domain是abc.com,path是/test，那么只有/test路径下的页面可以读取此
    cookie。 mac上可以通过 ==sudo vi /etc/hosts==设置本地映射不同的域名来测试
    - expires/Max-Age 字段为此cookie超时时间。若设置其值为一个时间，那么当到达此时间后，此cookie失效。不设置的话默认值是Session，意思是cookie会和session一起失效。当浏览器关闭(不是浏览器标签页，而是整个浏览器) 后，此cookie失效。
    - httponly HttpOnly属性用于设置该Cookie不能被JavaScript读取. （即document.cookie不会返回这个Cookie的值），只用于向服务器发送。这主要是为了防止XSS攻击盗取Cookie。
    - secure secure属性用来指定Cookie只能在加密协议HTTPS下发送到服务器。 该属性只是一个开关，不需要指定值。如果通信是HTTPS协议，该开关自动打开。

```js
let http = require('http');
let url = require('url');
let querystring = require('querystring');

let server = http.createServer((req, resp) => {
    let url = req.url;
    if (url === '/read') {
        let cookieObj = querystring.parse(req.headers.cookie, '; ');
        resp.end(JSON.stringify(cookieObj));
    } 
    if (url === '/read/2') {
        let cookieObj = querystring.parse(req.headers.cookie, '; ');
        resp.end(JSON.stringify(cookieObj));
    } 
    if (url === '/read2') {
        let cookieObj = querystring.parse(req.headers.cookie, '; ');
        resp.end(JSON.stringify(cookieObj));
    } 
    if (url === '/write') {
        // 如果原来已经有多个cookie，那么新设置的cookie的key如果和之前的某个相同，就替换其值，其他cookie任然不变

        // 设置单个Cookie
        // resp.setHeader('Set-Cookie', 'token=21345');

        // 设置多个Cookie
        // resp.setHeader('Set-Cookie', ['token=21345', 'token2=23412']);

        // 添加domain属性 设置domain后，只有符合当前设置的domain的url才能携带cookie request 到server
        // resp.setHeader('Set-Cookie', 'token=21345; domain=a.test.cn');
        // resp.setHeader('Set-Cookie', 'token=21345; domain=.test.cn');

        // 设置path属性后，符合当前path的url才能读取读取此cookie, 此时 /read /read/2 请求Cookie中会携带token, 其他请求只会携带token2
        // 所以 /read /read/2能读到两个值，/read2只能读到一个值
        // resp.setHeader('Set-Cookie', ['token=123; path=/read', 'token2=1234']);
        

        // expires 绝对时间 / max-age 相对时间
        // resp.setHeader('Set-Cookie', ['token=123; max-age=10', 'token2=234; expires=' + new Date(Date.now() + 10000).toUTCString()]);

        // httponly - 设置完成后， document.cookie 获取到的是空字符串
        resp.setHeader('Set-Cookie', 'toekn=123; httponly=true');
        resp.end('write success');
    }
});

server.listen(3003);
```

> 客户端可以直接看到甚至修改cookie的内容， 严厉禁止将敏感信息存储在cookie中。 就算是一般的信息在存储在cookie中时，我们从安全的角度考虑，一般可以对其进行加密存储

感兴趣可以看下知乎中第一个答案的小故事（和尚，小花和张屠夫），很有意思 虽然讲的是https的东西，但是也涉及到很多加解密的内容：https://www.zhihu.com/question/21518760/answer/19698894

```js
// 加密用的核心模块 crypto
let http = require('http');
let querystring = require('querystring');
let crypto = require('crypto');

// 加密 签名 cookie
function cryptSignCookie(value) {
    let key = 'a little salt';
    return value + crypto.createHmac('sha256', key).update(value).digest('base64');
} 

http.createServer((req, resp) => {
    const url = req.url;

    req.getCookie = function(key) {
        let cookieObj = querystring.parse(req.headers.cookie, '; ');
        if (key) {
            return cookieObj[key];
        }
        return cookieObj;
    }
    
    req.getCryptCookie = function(key) {
        let cookieObj = querystring.parse(req.headers.cookie, '; ');
        let [value, cryptValue] = cookieObj[key].split('.');
        if (cryptSignCookie(value) === cryptValue) {
            return value;
        } else {
            return 'cooke值疑似被篡改';
        }
    }

    let cookieArr = [];
    resp.setCookie = function(key, value) {
        cookieArr.push(`${key}=${value}`);
        resp.setHeader('Set-Cookie', cookieArr);
    }

    if (url === '/read') {
        resp.end(req.getCookie('token'));
    }

    if (url === '/read2') {
        resp.end(req.getCryptCookie('token'));
    }

    if (url === '/write') {
        let originValue = '12345';
        let cryptValue = cryptSignCookie(originValue);
        resp.setCookie('token', originValue + '.' + cryptValue);
        resp.end('write success');
    }
}).listen(3003);
```

* MD5 和 sha1 都已经不安全，有可能被碰撞成功
* sha256 是不可逆加密，即如果明文一致，加密结果一致，但不能根据密文解密出明文
* sha256 可以添加盐（随机数），盐值不同，即使用的都是sha256, 加密的结果都不一样。 （你不知道我的盐，不可能做出口味和我一样的菜）
* 根据明文加密后的密文对比cookie中的密码，来判断是否内容被篡改


## 浏览器HTTP缓存和304
缓存的作用：
* 减少了冗余的数据传输。节省带宽
* 减少了服务器负担，提高webapp性能
* 加快客户端加载网页的速度

**缓存的分类：**
* 缓存分为强制缓存和对比缓存，强制缓存如果生效，不需要再和服务器发生交互，而对比缓存不管是否生效，都需要与服务端发生交互
* 两类缓存规则可以同时存在，强制缓存优先级高于对比缓存，也就是说，当执行强制缓存的规则时，如果缓存生效，直接使用缓存，不再执行对比缓存规则

1. 强制缓存(首页没法强制缓存)
    * 响应头：Expires  ==resp.setHeader('Expires', new Date(Date.now() + 10000).toUTCString());== 设置到期时间
    * 响应头：Cache-Control 与Expires的作用一致，都是指明当前资源的有效期, 其优先级高于Expires。 ==resp.setHeader('Cache-Control', 'max-age=10');== 设置到期时间

    ![img](/static/cache2.png)

2. 对比缓存
    * 响应头：Last-Modified。
    响应时告诉客户端此资源的最后修改时间
    If-Modified-Since：当资源过期时（使用Cache-Control标识的max-age），发现资源具有Last-Modified声明，则再次向服务器请求时带上头If-Modified-Since。
    服务器收到请求后发现有头If-Modified-Since则与被请求资源的最后修改时间进行比对。若最后修改时间较新，说明资源又被改动过，则响应最新的资源内容并返回200状态码；
    若最后修改时间和If-Modified-Since一样，说明资源没有修改，则响应304表示未更新，告知浏览器继续使用所保存的缓存文件。

    * 响应头：ETag，是实体标签的缩写，根据实体内容生成的一段hash字符串,可以标识资源的状态。当资源发生改变时，ETag也随之发生变化。 ETag是Web服务端产生的，然后发给浏览器客户端。
    客户端想判断缓存是否可用可以先获取缓存中文档的ETag，然后通过If-None-Match发送请求给Web服务器询问此缓存是否可用。
    服务器收到请求，将服务器的中此文件的ETag,跟请求头中的If-None-Match相比较,如果值是一样的,说明缓存还是最新的,Web服务器将发送304 Not Modified响应码给客户端表示缓存未修改过，可以使用。
    如果不一样则Web服务器将发送该文档的最新版本给浏览器客户端

    ![img](/static/cache4.png)
相比较Last-Modified，ETag更准确，但是也最消耗性能。因为每次请求过来都要计算文件的hash与请求头中的If-None-Match的值来比较。

注意下面区别：
- 200 from memory cache
    - 不访问服务器，直接读缓存，从内存中读取缓存。此时的数据时缓存到内存中的，当kill进程后，也就是浏览器关闭以后，数据将不存在。但是这种方式只能缓存派生资源
- 200 from disk cache
    - 不访问服务器，直接读缓存，从磁盘中读取缓存，当kill进程时，数据还是存在。这种方式也只能缓存派生资源
- 304 Not Modified
    - 访问服务器，发现数据没有更新，服务器返回此状态码。然后从缓存中读取数据

下面总结下整个缓存的完整流程：
![img](/static/NetCacheFlow.jpg)



