> 也许我的选择最终会被证明是错误。但至少现在，我想这样选,那么我便这样选

### JWT
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