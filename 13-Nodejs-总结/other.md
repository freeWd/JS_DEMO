> 天下古今之庸人，皆以一惰字致败。天下古今之才人，皆以一傲字致败 - 曾国藩

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Node debug & 远程 debug](#node-debug-远程-debug)
  - [chrmme 调试 server 代码](#chrmme-调试-server-代码)
  - [使用 vs code](#使用-vs-code)
    - [最简单的使用：](#最简单的使用)
    - [配置 launch.json](#配置-launchjson)
  - [远程 debug](#远程-debug)
- [进制的转化 & base64 编码](#进制的转化-base64-编码)
  - [数字在不同进制之间的转化](#数字在不同进制之间的转化)
  - [简单了解 Base64 编码](#简单了解-base64-编码)
- [跨域处理](#跨域处理)
  - [JSONP](#jsonp)
  - [CORS](#cors)
  - [document.domain](#documentdomain)
  - [postMessage](#postmessage)
  - [代理](#代理)
- [Cookie](#cookie)
  - [cookie 客户端](#cookie-客户端)
  - [cookie 在服务端](#cookie-在服务端)
- [JWT](#jwt)
  - [JWT的结构](#jwt的结构)
  - [应用场景](#应用场景)

<!-- /code_chunk_output -->

## Node debug & 远程 debug

node 如何调试：

常用的方法如下

### chrmme 调试 server 代码

```sh
node --inspect app.js
# chrome 浏览器访问 chrome://inspect/#devices
# 选择 inspect 打开新的开发者工具用于调试 node
```

### 使用 vs code

我用 VSCode 写 node，VSCode debug 现在做的真的挺好,用起来很方便。

#### 最简单的使用：

在 package.json script 中写启动脚本，VsCode 在 script 上有提示对哪个命令进行调试

#### 配置 launch.json

创建一个有调试功能的命令行，在此命令行执行某个文件 `node test.js`, 在某个位置打上断点即可

### 远程 debug

有些时候我们需要远程调试服务器上的代码，可以用如下方法

让我们假定你在一台远程机器上运行 Node，譬如 remote.example.com。你想进行调试。在那台机器上你应该启动 node 进程，让监视器仅监听本地（默认）

`node --inspect server.js`

现在，在你本地机器上，从你初始化一个调试客户端连接开始，你创建了一个 SSH 管道：

`ssh -L 9221:localhost:9229 user@remote.example.com`

ssh 管道启动，在你机器上连接到 9221 端口将被重定向到 9229 的 remote.example.com 地址上。你可以附加一个调试器，例如 Chrome 开发工具或者是指向 localhost:9221 的 Visual Studio Code。如果 Node.js 本地正在运行，应该可以调试了

---

## 进制的转化 & base64 编码

### 数字在不同进制之间的转化

```js
// ==> 其他进制 ==> 10进制
// 将二进制111111 转化为10进制的int类型的数字
parseInt("111111", 2);
// 16进制转化为10进制
parseInt("0xff", 16);

// ===》 m进制 ==> n进制
// 10进制转化为2进制
(255)
  .toString(2)(
    // 10进制转化为16进制
    255
  )
  .toString(16)(
    // 16进制转化为10进制
    0xff
  )
  .toString(10);
```

### 简单了解 Base64 编码

它不是加密，仅仅是一种编码方式

`一切能放置路径的地方，都可以使用base64编码`，比如 img.src, background... 好处是不用发请求，如果资源过大 base64 编码的字符串会更大。

```js
// 看看base64的逻辑
let buffer = Buffer.from('测'); // <Buffer e6 b5 8b>

// 将buffer的16进制转化为2进制
(0xe6).toString(2); // 11100110
(0xb5).toString(2); // 10110101
(0x8b).toString(2); // 10001011

// e6 b5 8b = 11100110 10110101 10001011
// 将二进制的24位按每6个位一组来隔断
// 11100110 10110101 10001011 ==> 111001 101011 010110 001011
// 将隔断的前面补0，凑成8个一组 ===》 00111001 00101011 00010110 00001011

// 将新的二进制字节转化为10进制
parseInt("00111001", 2); // 57
parseInt("00101011", 2); // 43
parseInt("00010110", 2); // 22
parseInt("00001011", 2); // 11

let wifiCode = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; // 一个有64个字符

// 根据获得的10进制数据选择字符
console.log("5rWL");
console.log(buffer.toString('base64'));
```

综上就是 base64 编码的过程，所以 base64 中的 64 指的就是 4 组  每组 6 个

> 原来是 3 个字节，转化后变成 4 个字节，理论上比原来大 1/3

---

## 跨域处理

跨域问题其实放在浏览器端讲似乎更合适，但是服务端可以提供关于跨域的某中具体的解决方法，所在在 server 端讲也没什么问题

跨域的原因是浏览器的同源策略引起的，`如果协议、域名或者端口有一个不同就是跨域，Ajax 请求会失败`。

本质上是处于安全的考虑：是用来防止 CSRF 攻击的。简单点说，CSRF 攻击是利用用户的登录态发起恶意请求

没有同源策略的情况下，A 网站可以被任意其他来源的 Ajax 访问到内容。如果你当前 A 网站还存在登录态，那么对方就可以通过 Ajax 获得你的任何信息。当然跨域并不能完全阻止 CSRF

**请求跨域了，那么请求到底发出去没有？**

`请求必然是发出去了，但是浏览器拦截了响应`。你可能会疑问明明通过表单的方式可以发起跨域请求，为什么 Ajax 就不会。因为归根结底，跨域是为了阻止用户读取到另一个域名下的内容，Ajax 可以获取响应，浏览器认为这不安全，所以拦截了响应。但是表单并不会获取新的内容，所以可以发起跨域请求。同时也说明了跨域并不能完全阻止 CSRF，因为请求毕竟是发出去了

常见的解决跨域问题的方法：

### JSONP

虽然 ajax 会被限制，但是 href, src 等加载资源的标签不会被限制，JSONP 本质上就是利用了这个潜在的小漏洞，
通过`<script>`标签指向某一个后端的请求, 该请求会返回一个回调函数并在函数中提供入参，作为当前真正需要的参数。回调函数的执行逻辑由前端开发人员自行编写

```js
// index.html
// 当前url的返回值是
// callbackFunction(
// [
// "customername1",
// "customername2"
// ]
// )
<script src="https://www.runoob.com/try/ajax/jsonp.php?jsoncallback=callbackFunction"></script>
<script>
    function callbackFunction(data) {
    	console.log(data)
	}
</script>
```

### CORS

浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。将白了就是在响应头中设置跨域请求的白名单字段，用官方响应头设置解决问题

```js
//控制请求发送的 Origin - 相当于将此域名加入白名单。可以为*（通配符-表示运行所有域名跨域访问此server）
resp.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

// 如果前端发送的请求不是简单请求，需要设置运行的方法白名单
resp.setHeader(
  "Access-Control-Allow-Methods",
  "GET, POST, DELETE, PUT, OPTIONS"
);

// 如果请求中有自定义请求头，后端需要获取该请求头则要设置请求头白名单
resp.setHeader(
  "Access-Control-Allow-Headers",
  "Content-Type, custom-test",
  "Cookie"
);

// 对于复杂请求来说，首先会发起一个预检请求，该请求是 option 方法的，通过该请求来知道服务端是否允许跨域请求。
// 控制options方法定期发送时间
resp.setHeader("Access-Control-Max-Age", 20);

// 允许请求带上cookie，且要求origin头不能为 *
resp.setHeader("Access-Control-Allow-Credentials", true);
```

### document.domain

该方式只能用于`二级域名相同`的情况下，比如 a.test.com 和 b.test.com 适用于该方式

只需要给页面添加 `document.domain = 'test.com'` 表示二级域名都相同就可以实现跨域

### postMessage

这种方式通常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接收消息

```js
// 发送消息端
window.parent.postMessage("message", "http://test.com");
// 接收消息端
var mc = new MessageChannel();
mc.addEventListener("message", (event) => {
  var origin = event.origin || event.originalEvent.origin;
  if (origin === "http://test.com") {
    console.log("验证通过");
  }
});
```

### 代理

nginx 等代理机制，或者后端的 httpClient 的请求转发

---

## Cookie

### cookie 客户端

每次发请求的时候，浏览器正常的请求中会自动将 cookie 的值放在请求头中带给服务端

cookie 可以在客户端设置（document.cookie）

> 客户端可以直接看到甚至修改 cookie 的内容， 严厉禁止将敏感信息存储在 cookie 中。 就算是一般的信息在存储在 cookie 中时，我们从安全的角度考虑，一般可以对其进行加密存储

cookie 的属性信息

- domain

  表示可以访问此 cookie 的域名。 (默认为设定该 Cookie 的域名)， 所指定的域名必须是当前发送 Cookie 的域名的一部分，比如当前访问的域名是 example.com，就不能将其设为 google.com。只有访问的域名匹配 domain 属性，Cookie 才会发送到服务器。

- path

  为可以访问此 cookie 的页面路径。 比如 domain 是 abc.com,path 是/test，那么只有/test 路径下的页面可以读取此 cookie。

  mac/linux 上可以通过 ==sudo vi /etc/hosts==设置本地映射不同的域名来测试

- expires/Max-Age

  为此 cookie 超时时间。若设置其值为一个时间，那么当到达此时间后，此 cookie 失效。不设置的话默认值是 Session，意思是 cookie 会和 session 一起失效。当浏览器关闭(不是浏览器标签页，而是整个浏览器) 后，此 cookie 失效。

- httponly

  HttpOnly 属性用于设置该 Cookie 不能被 JavaScript 读取. （即 document.cookie 不会返回这个 Cookie 的值），只用于向服务器发送。这主要是为了防止 XSS 攻击盗取 Cookie。

- secure secure

  用来指定 Cookie 只能在加密协议 HTTPS 下发送到服务器。 该属性只是一个开关，不需要指定值。如果通信是 HTTPS 协议，该开关自动打开。

### cookie 在服务端

cookie 服务端设置（`response header set-cookie`）

```js
let http = require("http");
let url = require("url");
let querystring = require("querystring");

let server = http.createServer((req, resp) => {
  let url = req.url;
  if (url === "/read") {
    let cookieObj = querystring.parse(req.headers.cookie, "; ");
    resp.end(JSON.stringify(cookieObj));
  }
  if (url === "/read/2") {
    let cookieObj = querystring.parse(req.headers.cookie, "; ");
    resp.end(JSON.stringify(cookieObj));
  }
  if (url === "/read2") {
    let cookieObj = querystring.parse(req.headers.cookie, "; ");
    resp.end(JSON.stringify(cookieObj));
  }
  if (url === "/write") {
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
    resp.setHeader("Set-Cookie", "toekn=123; httponly=true");
    resp.end("write success");
  }
});

server.listen(3003);
```

> 也可以使用加密模块，对cookie的值做一层sha256的加密，和明文一起传输，后端校验，起到防止篡改的目的

* MD5 和 sha1 都已经不安全，有可能被碰撞成功
* sha256 是不可逆加密，即如果明文一致，加密结果一致，但不能根据密文解密出明文
* sha256 可以添加盐（随机数），盐值不同，即使用的都是sha256, 加密的结果都不一样。 （你不知道我的盐，不可能做出口味和我一样的菜）
* 根据明文加密后的密文对比cookie中的密码，来判断是否内容被篡改

---
## JWT

* JWT(json web token)是为了在网络应用环境间传递声明而执行的一种基于JSON的开放标准。
* JWT的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源。比如用在用户登录上。
因为数字签名的存在，这些信息是可信的，JWT可以使用HMAC算法或者是RSA的公私秘钥对进行签名

### JWT的结构
```
// 一个token的示例  JWT包含了使用.分隔的三部分
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTY2MzUyMDYwLCJleHAiOjE1NjYzNTIwODB9.v_IGmPIIOLaFO3oF6jLGUfop_lrzykoEqYkUvplRFTI

// ===> 分解
// 第一部分 Header 头部
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

// 第二部分 Payload 负载
eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTY2MzUyMDYwLCJleHAiOjE1NjYzNTIwODB9

// 第三部分 Signature 签名
v_IGmPIIOLaFO3oF6jLGUfop_lrzykoEqYkUvplRFTI
```
* 在header中通常包含了两部分：token类型和采用的加密算法。
```
// 对这部分内容使用Base64Url编码组成了JWT结构的第一部分
{ "alg": "HS256", "typ": "JWT"} 
```

* Payload - 负载就是存放有效信息的地方。这个名字像是指货车上承载的货物，这些有效信息包含三个部分
    * 标准中注册的声明（建议但不强制使用）
        * iss: jwt签发者
        * sub: jwt所面向的用户
        * aud: 接收jwt的一方
        * exp: jwt的过期时间，这个过期时间必须要大于签发时间,这是一个秒数
        * nbf: 定义在什么时间之前，该jwt都是不可用的.
        * iat: jwt的签发时间
    * 公共的声明
        * 公共的声明可以添加任何的信息，一般添加用户的相关信息或其他业务需要的必要信息.但不建议添加敏感信息，因为该部分在客户端可解密
    * 私有的声明
        * 私有声明是提供者和消费者所共同定义的声明，一般不建议存放敏感信息，因为base64是对称编码的，意味着该部分信息可以归类为明文信息
```
// 负载实例
{ "sub": "1234567890", "name": "zfpx", "admin": true} 
```

* Signature 签名
    * 创建签名需要使用编码后的header和payload以及一个秘钥
    * 使用header中指定签名算法进行签名
    * 例如如果希望使用HMAC SHA256算法，那么签名应该使用下列方式创建
    ```
    HMACSHA256( base64UrlEncode(header) + "." + base64UrlEncode(payload), secret) 
    ```
    * 签名用于验证消息的发送者以及消息是没有经过篡改的

* 完整的JWT 完整的JWT格式的输出是以. 分隔的三段Base64编码
* 密钥secret是保存在服务端的，服务端会根据这个密钥进行生成token和验证，所以需要保护好。


### 应用场景
结合vue，看看JWT在前后端分离中的使用
JWT - json web token 用于表示登录用户身份的唯一凭证。
大致流程：
* 在登录接口请求到服务端后，服务端确认用户登录成功，工具用户的唯一信息(比如 userId)配合自定义的秘钥生成一串加密后的token值和对应的过期时间，将token值作为响应结果返回。
* 客户端在login的返回值中获取token值，存储在离线存储的环境中比如cookie或者localstorage
* 客户端设置请求拦截器，在每次请求发送前，从离线存储位置获取到token值添加的请求头自定义的字段中
* 后端拦截器在请求过来时，先获取请求头中的token值，利用秘钥将信息解密，如果解密成功（信息正确 & 在有效期内）继续后面的逻辑，在返回的结果中将带上新的token值(刷新到期时间)
* 前端在相应位置 =》  路由拦截器 | 响应拦截器 中设置判断逻辑，如果返回信息表示用户到期或token不正确，就跳转到login页面

JWT 和 cookie-session-jsessionId那种验证方式异曲同工，两者现在是并存的。

JWT个人感觉是前后端完全分离后的新产物，它更适用于分布式环境中，因为token是保存在客户端的，后端服务器不管怎么变，token都能正确的传递过去。
而sessionid依赖前端的cookie和后端的session配合，如果是分布式环境，不同服务器的session不一样，这时候可能就需要将sessionid存在在db中了
