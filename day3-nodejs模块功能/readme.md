### buffer
buffer(缓冲器) -  Buffer 类是作为 Node.js API 的一部分引入的，用于在 TCP 流、文件系统操作、以及其他上下文中与八位字节流进行交互。

```js
// 将字符串转化为16进制
let buffer = Buffer.from('测试');

// 将16进制的buffer转化为字符串,node只支持utf8格式 默认值: 'utf8'。
console.log(buffer.toString());
console.log(buffer.toString('base64'));
```

* 编码的问题
1个字节 = 8位 （1 byte = 8bit）
8位 （最大值 255）
====> 2进制最大表示 ==11111111== ====> 255
====> 8进制最大表示 ==377== =====> 255
====> 16进制最大表示 ==ff== =====> 255
如果是utf8编码的，一个字符 = 3个字节 
一个汉字 = 一个字符 = 3个字节 = 24位


* 进制之间的相互转化
```js
// 2进制等 ==> 10进制
parseInt('111111', 2); // 将二进制111111 转化为10进制的int类型的数字

// 10进制等数组 ===> 2进制等
let num = 255;
let num2 = 0xff;
(num).toString(16); // 将10进制的255 转化为16进制的
字符串
(num2).toString(2); // 将16进制的255 转化为2进制的字符串
```

* base64的理解
它不是加密，仅仅是一种编码方式
一切能放置路径的地方，都可以使用base64编码，比如 img.src, background... 好处是不用发请求，如果资源过大base64编码的字符串会更大。

```js
// 看看base64的逻辑
// <Buffer e6 b5 8b>
let buffer = Buffer.from('测');

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

综上就是base64编码的过程，所以base64中的64指的就是4组每组6个
> 原来是3个字节，转化后变成4个字节，理论上比原来大1/3

* buffer声明方式
```js
let buffer = Buffer.from('测试');
// <Buffer ff ff ff>
let buffer2 = Buffer.from([255, 255, 255]); 
// 开辟3个字节的存储空间 <Buffer 00 00 00>
let buffer2 = Buffer.alloc(3);
```
> buffer一但声明就不能增加长度，可以减少长度


* 常用的修改buffer长度的方法 copy + concat + split
```js
let buffer = Buffer.from('测试');
let b1 = Buffer.from('测');
let b2 = Buffer.from('试');
// 减少buffer长度
buffer.slice(0, 3);

// 增加buffer长度
// 1. copy  source.copy(target, targetStart, sourceStart, sourceEnd)
let big = Buffer.alloc(6);
b1.copy(big, 0, 0, 3);
b2.copy(big, 3, 0, 3);
console.log(big);

// 2. concat 常用
let big2 = Buffer.concat([b1, b2]);
console.log(big2);

```
