> 古来豪杰，吾家祖父教人，以“懦弱无刚”四字为大耻，故男儿自立必须有倔强之气。 - 曾国藩

本小结介绍上小结中的 Node 内置的一些常用的模块的简单使用，肯定是写不全，也写不深的，遇到问题还是优先看官方文档

http://nodejs.cn/api/

## Buffer

Buffer(缓冲器) - Buffer 类是作为 Node.js API 的一部分引入的，用于在 TCP 流、文件系统操作、以及其他上下文中与八位字节流进行交互。

Buffer 对象用于以字节序列的形式来表示二进制数据

Buffer 类的实例类似于从 0 到 255 之间的整数数组，（16 进制 最大 255 表示一个字节）但对应于固定大小的内存块，并且不能包含任何其他值。 一个 Buffer 的大小在创建时确定，且无法更改

### 创建 Buffer

```js
// Buffer.alloc
// 分配一个大小为 size 字节的新 Buffer
let buffer = Buffer.alloc(3); // <Buffer 00 00 00>

// Buffer.from
let buffer2 = Buffer.from("测试"); // <Buffer e6 b5 8b e8 af 95> (utf8编码中一个汉字是三个字节)

let buffer3 = Buffer.from([255, 255, 255]); // <Buffer ff ff ff>
```

### 比较 Buffer

```js
// ===> buf.equals(otherBuffer)
// 判断两个buffer实例存储的数据是否相同，如果是，返回true，否则返回false。
var buf1 = Buffer.from("A");
var buf2 = Buffer.from("B");
buf3.equals(buf4); // false

var buf3 = Buffer.from("ABC"); // <Buffer 41 42 43>
var buf4 = Buffer.from("414243", "hex"); // hex 16进制
buf3.equals(buf4); // true

// buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])
// 可以指定特定比较的范围（通过start、end指定）
// 返回值为整数，达标buf、target的大小关系
// 返回值：0：buf、target大小相同
// 1：buf大于target，也就是说buf应该排在target之后
// -1：buf小于target，也就是说buf应该排在target之前
const buf1 = Buffer.from("ABC");
const buf2 = Buffer.from("BCD");
const buf3 = Buffer.from("ABCD");

console.log(buf1.compare(buf1)); // Prints: 0
console.log(buf1.compare(buf2)); // Prints: -1
console.log(buf2.compare(buf1)); // Prints: 1
```

### Buffer 查找

```js
// 跟数组的查找差不多，需要注意的是，value可能是String、Buffer、Integer中的任意类型。
const buf = Buffer.from("this is a buffer");
console.log(buf.indexOf("this")); // 0
console.log(buf.indexOf("is")); // 2
console.log(buf.indexOf(Buffer.from("a buffer"))); // 8
console.log(buf.indexOf(Buffer.from("buffer x"))); // -1
```

### Buffer 操作

```js
// Buffer.concat(list[, totalLength]) 连接
var buff1 = Buffer.alloc(10);
var buff2 = Buffer.alloc(20);
let big2 = Buffer.concat([buff1, buff2]);
let big2 = Buffer.concat([buff1, buff2], buff1.length + buff2.length);

// Buffer 拷贝 buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])
let big = Buffer.from("你好"); // <Buffer e4 bd a0 e5 a5 bd>
let b1 = Buffer.alloc(3);
let b2 = Buffer.alloc(3);
big.copy(b1, 0, 0, 3); // <Buffer e4 bd a0>
big.copy(b2, 0, 3, 6); // <Buffer e5 a5 bd>

// Buffer 截取
// buf.slice([start[, end]])
var buff1 = Buffer.from("abcde");
var buff2 = buff1.slice(1, 3); // <Buffer 62 63>

// Buffer 写入
// buf.write(string[, offset[, length]][, encoding]) 返回写入的字节数
var buff = Buffer.alloc(4);
buff.write("a"); // 返回 1   <Buffer 61 00 00 00>
buff.write("ab"); // 返回 2  <Buffer 61 62 00 00>

// buf.fill(value[, offset[, end]][, encoding])
// offset：从第几位开始填充，默认是0
// end：停止填充的位置，默认是 buf.length
var buff = Buffer.alloc(4);
buff.fill("a", 1);
buff.fill("ab");

// Buffer 转化
// buf.toString([encoding[, start[, end]]])
var buff = Buffer.from("hello");
buff.toString(); // hello
buff.toString("utf8", 0, 2);
buf.toString('bae64')

// buf.toJSON
var buff = Buffer.from("hello");
buff.toJSON(); // { type: 'Buffer', data: [ 104, 101, 108, 108, 111 ] }
```

---

## path

path 模块提供了一些实用工具，用于处理文件和目录的路径

### 获取路径

- 获取路径：path.dirname(filepath)

- 获取相对路径：path.relative(from, to)

  从 from 路径，到 to 路径的相对路径

- 获取文件名：path.basename(filepath)

  只是输出路径的最后一部分，并不会判断是否文件名

- 获取扩展名：path.extname(filepath)

```js
var path = require("path");
var filepath = "/tmp/demo/js/test.js";

path.dirname(filepath); // /tmp/demo/js

path.relative("/data/orandea/test/aaa", "/data/orandea/impl/bbb"); // ../../impl/bbb
path.relative("/data/demo", "/data/demo"); // ''

path.basename("/tmp/demo/js/test.js"); // test.js
path.basename("/tmp/demo/js/test/"); // test

// 如果只想获取文件名，但不包括文件扩展呢
path.basename("/tmp/demo/js/test.js", ".js"); // test

// 获取文件扩展名
path.extname("/tmp/demo/js/test.js"); // .js
path.extname("index.coffee.md"); // .md
path.extname("index"); // ''
```

### 路径组合

- path.join([...paths])
- path.resolve([...paths])

  可以想象现在你在 shell 下面，从左到右运行一遍 cd path 命令，最终获取的绝对路径/文件名，就是这个接口所返回的结果了。

```js
var path = require("path");
path.join("/foo", "bar", "baz/asdf", "quux", ".."); // '/foo/bar/baz/asdf'

// 假设当前工作路径是 /Users/a/Documents/path
path.resolve(""); // /Users/a/Documents/path
path.resolve("."); // /Users/a/Documents/path

path.resolve("/foo/bar", "./baz"); // /foo/bar/baz
path.resolve("/foo/bar", "/tmp/file/"); // /tmp/file
path.resolve("www", "js/upload", "../mod.js"); // /Users/a/Documents/path/www/js/mod.js
```

### 路径解析

path.normalize(filepath) 规范化给定的 path，解析 '..' 和 '.' 片段

```js
path.normalize(""); // .
path.normalize("./.."); // ..
path.normalize("/../"); // /
path.normalize("/tmp/demo/js/upload"); // /tmp/demo/js/upload
path.normalize("/tmp/demo//js"); // /tmp/demo/js
path.normalize("/tmp/demo/js/upload/.."); // /tmp/demo/js
path.normalize("./demo/js/upload/"); // demo/js/upload/
```

### 文件路径分解/组合

- path.format(pathObject)：将 pathObject 的 root、dir、base、name、ext 属性，按照一定的规则，组合成一个文件路径。
- path.parse(filepath)：path.format()方法的反向操作

```js
var path = require("path");
var p1 = path.format({
  root: "/tmp/",
  base: "hello.js",
}); // /tmp/hello.js

var p2 = path.format({
  dir: "/tmp",
  name: "hello",
  ext: ".js",
}); // /tmp/hello.js

var p3 = path.parse("/home/user/dir/file.txt");
// {
//    root : "/",
//    dir : "/home/user/dir",
//    base : "file.txt",
//    ext : ".txt",
//    name : "file"
// }
```

## 不同 OS, 平台相关接口

以下属性、接口，都跟平台(OS)的具体实现相关

- path.posix：path 相关属性、接口的 linux 实现。
- path.win32：path 相关属性、接口的 win32 实现
- path.sep：路径分隔符。在 linux 上是/，在 windows 上是\
- path.delimiter：path 设置的分割符。linux 上是:，windows 上是;

---

## fs

fs - file system - 文件操作相关

### 添加文件、文件夹

```js
// ==> 添加文件夹
var fs = require("fs");

// 异步
fs.mkdir("./hello", function (err) {
  if (err) throw err;
  console.log("目录创建成功");
});

// 同步
fs.mkdirSync("./hello");

// ===> 添加文件
// 异步
fs.writeFile("./static/2.txt", data, (err) => {
  if (err) throw new Error("写入失败");
  console.log("写入成功");
});

// 同步
fs.writeFileSync("./static/2.txt", data);

// ===> 追加文件内容
fs.appendFile("./extra/fileForAppend.txt", "hello", "utf8", function (err) {
  if (err) throw err;
  console.log("append成功");
});
```

### 删除文件、文件夹

```js
var fs = require("fs");

// ==》 删除文件夹 （只能删除空文件夹）
fs.rmdir("./dirForRemove", function (err) {
  if (err) throw err;
  console.log("目录删除成功");
});

fs.rmdirSync("./dirForRemove");

// ===》 删除文件
fs.unlink("./fileForUnlink.txt", function (err) {
  if (err) throw err;
  console.log("文件删除成功");
});

fs.unlinkSync("./fileForUnlink.txt");
```

### 修改文件，文件夹名称

```js
const fs = require("fs");

// rename 修改文件，文件夹名称都可以
// 如果 newPath 已存在，则覆盖它
fs.rename("旧文件.txt", "新文件.txt", (err) => {
  if (err) throw err;
  console.log("重命名完成");
});

fs.renameSync("旧文件.txt", "新文件.txt");
```

### 文件，文件夹状态判断

不建议在调用 fs.open()、 fs.readFile() 或 fs.writeFile() 之前使用 fs.access() 检查文件的可访问性。 这样做会引入竞态条件， 而是，应该直接打开、读取或写入文件，并且当文件无法访问时处理引发的错误

```js
// 若要只检查文件是否存在，但没有更多的操作，则建议使用 fs.access()
// fs.access(path[, mode], callback) - 测试用户对 path 指定的文件或目录的权限
const fs = require("fs");

// 检查文件是否存在于当前目录中。
fs.access(file, fs.constants.F_OK, (err) => {
  console.log(`${file} ${err ? "不存在" : "存在"}`);
});

// 检查文件是否可读。
fs.access(file, fs.constants.R_OK, (err) => {
  console.log(`${file} ${err ? "不可读" : "可读"}`);
});

// 检查文件是否可写。
fs.access(file, fs.constants.W_OK, (err) => {
  console.log(`${file} ${err ? "不可写" : "可写"}`);
});

// ==> 获取文件状态信息 使用 fs.stat(path[, options], callback)
// callback => { err, stats }
fs.stat("./test", (err, stats) => {
  if (err) throw err;
  console.log(`文件属性: ${JSON.stringify(stats)}`);
  // stats.isDirectory() 判断是否为文件夹
  // stats.isFile() 是否是文件
  // stats.size 文件大小
});

var stats = fs.statSync("./test");
```

### 遍历文件夹 & 读取文件内容

```js
// ===> 遍历文件夹
// 只会读一层，所以需要判断文件类型是否目录，如果是，则进行递归遍历
const fs = require("fs");
fs.readdir("./test", "utf8", (err, files) => {
  if (err) throw err;
  files.forEach((item) => {
    console.log(item);
  });
});

const files = fs.readdirSync("./test", "utf-8");

// ===> 读取文件内容
fs.readFile("./test/1.txt", (err, data) => {
  console.log(data); // <Buffer 31 32 33>
});
const bufferData = fs.readFileSync("./test/1.txt");

fs.readFile("./test/1.txt", "utf-8", (err, data) => {
  console.log(data); // 123
});
```

---

## stream

流 - 边读边写 - 可以控制读取的速率 - 流是基于事件的

fs 虽然可以实现文件的读写，但是 fs.readFile() 函数会缓冲整个文件。 为了最小化内存成本，对于大文件的读写尽可能通过 stream 的方式去控制

Node.js 中有四种基本的流类型：

- Readable - 可读取数据的流（例如 fs.createReadStream()）。
- Writable - 可写入数据的流（例如 fs.createWriteStream()）。
- Duplex - 可读又可写的流（例如 net.Socket）- 双工流。
- Transform - 在读写过程中可以修改或转换数据的 Duplex 流（例如 zlib.createDeflate()）。

### Readable Stream

```js
var fs = require("fs");

var readStream = fs.createReadStream("./sample.txt");
var content = "";

readStream.setEncoding("utf8");

readStream.on("data", function (chunk) {
  content += chunk;
});

readStream.on("end", function (chunk) {
  // 文件读取完成，文件内容是 [你好，我是程序猿小卡]
  console.log("文件读取完成，文件内容是 [%s]", content);
});

// 另外一个例子
let arr = [];
readStream.on("data", function (chunk) {
  arr.push(chunk);
  rs.pause(); // 暂停读取
});
readStream.on("end", function () {
  console.log(Buffer.concat(arr).toString()); // 读取完毕
});
setTimeout(() => {
  rs.resume(); // 恢复 data 事件的触发
}, 1000);
```

### Writable Stream

```js
var fs = require("fs");
var content = "hello world";
var filepath = "./sample.txt";

var writeStram = fs.createWriteStream(filepath);
writeStram.write(content);
writeStram.end();
```

### read + write 来一波

```js
let fs = require("fs");
let path = require("path");

let rs = fs.createReadStream(path.resolve(__dirname, "./static/1.txt"), {
  highWaterMark: 3,
});

let ws = fs.createWriteStream(path.resolve(__dirname, "./static/2.txt"), {
  highWaterMark: 1,
});

rs.on("data", function (data) {
  let flag = ws.write(data);
  if (!flag) {
    rs.pause();
  }
});

// 如果内部的缓冲小于创建流时配置的 highWaterMark，则返回 true 。如果返回 false ，则应该停止向流写入数据，直到 'drain' 事件被触发。
ws.on("drain", function () {
  console.log("抽干");
  rs.resume();
});
```

上面这样边读边写能有效的减轻文件过大导致的读取压力。
但是每次都要写这么多是不是很麻烦，我们可以自己封装方法，让其更简单。

```js
function pipe(rs, ws) {
  rs.on("data", function (data) {
    let flag = ws.write(data);
    if (!flag) {
      rs.pause();
    }
  });

  ws.on("drain", function () {
    console.log("抽干");
    rs.resume();
  });
}

let fs = require("fs");
let path = require("path");

let rs = fs.createReadStream(path.resolve(__dirname, "./static/1.txt"), {
  highWaterMark: 3,
});

let ws = fs.createWriteStream(path.resolve(__dirname, "./static/2.txt"), {
  highWaterMark: 1,
});

pipe(rs, ws);
```

其实 nodejs 已经考虑到了
直接调用 node api：`rs.pipe(ws);` , 把可读流导入到可写流中

```js
// 将1.txt内容拷贝到2.txt中，读1.txt, 写 2.txt
const fs = require("fs");
const rs = fs.createReadStream("./test/1.txt");
const ws = fs.createWriteStream("./test/2.txt");
// 如果可读流在处理期间发送错误，则可写流目标不会自动关闭。 如果发生错误，则需要手动关闭每个流以防止内存泄漏。
rs.pipe(ws);
rs.on("end", () => {
  ws.end("结束");
});
```

### Duplex Stream

最常见的 Duplex stream 应该就是 net.Socket 实例了

```js
// 服务端代码
var net = require("net");
var opt = {
  host: "127.0.0.1",
  port: "3000",
};

var server = net.createServer((socket) => {
  socket.on("data", (data) => {
    console.log("client send message: ", data.toString());
  });
  socket.write("hello client");
});
server.listen(opt.port, opt.host, () => {
  console.log(server.address());
});

// 客户端代码
var net = require("net");
var opt = {
  host: "127.0.0.1",
  port: "3000",
};

var client = net.connect(opt, function () {
  client.write("msg from client"); // 可写
});

// 可读
client.on("data", function (data) {
  // lient: got reply from server [reply from server]
  console.log("client: got reply from server [%s]", data);
  client.end();
});
```

### Transform Stream

Transform stream 是 Duplex stream 的特例，也就是说，Transform stream 也同时可读可写。跟 Duplex stream 的区别点在于，Transform stream 的输出与输入是存在相关性的

常见的 Transform stream 包括 zlib、crypto，这里举个简单例子：文件的 gzip 压缩

```js
var fs = require("fs");
var zlib = require("zlib");

var gzip = zlib.createGzip();

var inFile = fs.createReadStream("./extra/fileForCompress.txt");
var out = fs.createWriteStream("./extra/fileForCompress.txt.gz");

inFile.pipe(gzip).pipe(out);
```

---

## events

events 模块是 node 的核心模块之一，几乎所有常用的 node 模块都继承了 events 模块，比如 http、fs 等。

### 单个事件监听器

```js
var EventEmitter = require("events");
class Man extends EventEmitter {}

var man = new Man();
man.on("warkup", function () {
  console.log("man warkup");
});

man.emit("warkup");
```

### 同个事件，多个事件监听器

```js
var EventEmitter = require("events");
class Man extends EventEmitter {}

var man = new Man();
man.on("warkup", function () {
  console.log("warkup 1");
});
man.on("warkup", function () {
  console.log("warkup 2");
});

man.emit("warkup");
```

### 只运行一次的事件监听器

```js
var EventEmitter = require("events");

class Man extends EventEmitter {}

var man = new Man();

man.on("wakeup", function () {
  console.log("man has woken up");
});

man.once("wakeup", function () {
  console.log("man has woken up again");
});

man.emit("wakeup");
man.emit("wakeup");
```

### 注册事件监听器前，事件先触发

```js
var EventEmitter = require("events");

class Man extends EventEmitter {}
var man = new Man();

man.emit("wakeup", 1);

man.on("wakeup", function (index) {
  console.log("man has woken up ->" + index);
});

man.emit("wakeup", 2);

// 输出如下：
// man has woken up ->2
```

### 异步执行，还是顺序执行

例子很简单，但非常重要。究竟是代码 1 先执行，还是代码 2 先执行，这点差异，无论对于我们理解别人的代码，还是自己编写 node 程序，都非常关键

实践证明，代码 1 先执行了

```js
var EventEmitter = require("events");

class Man extends EventEmitter {}

var man = new Man();

man.on("wakeup", function () {
  console.log("man has woken up"); // 代码1
});

man.emit("wakeup");

console.log("woman has woken up"); // 代码2

// 输出如下：
// man has woken up
// woman has woken up
```

### 移除事件监听器

```js
var EventEmitter = require("events");

function wakeup() {
  console.log("man has woken up");
}

class Man extends EventEmitter {}

var man = new Man();

man.on("wakeup", wakeup);
man.emit("wakeup");

man.removeListener("wakeup", wakeup);
man.emit("wakeup");
```

---

## process

process 是 node 的全局模块，作用比较直观。可以通过它来获得 node 进程相关的信息，比如运行 node 程序时的命令行参数。或者设置进程相关信息，比如设置环境变量。

### 环境变量：process.env

```js
if (process.env.NODE_ENV === "production") {
  console.log("生产环境");
} else {
  console.log("非生产环境");
}

// NODE_ENV=production node test.js
// 输出：生产环境
```

### 异步：process.nextTick(fn)

```js
console.log("1");
process.nextTick(function () {
  console.log("2");
});
console.log("3");

// 1 3 2
```

### 获取相关参数

process.argv 返回一个数组，数组元素分别如下：

- 元素 1：node
- 元素 2：可执行文件的绝对路径
- 元素 x：其他，比如参数等

```js
process.argv.forEach(function (val, index, array) {
  console.log("参数" + index + ": " + val);
});

// 运行命令 NODE_ENV=dev node argv.js --env production
// 输出：
// 参数0: /Users/a/.nvm/versions/node/v6.1.0/bin/node
// 参数1: /Users/a/Documents/git-code/nodejs-learning-guide/examples/2016.11.22-node-process/argv.js
// 参数2: --env
// 参数3: production
```

获取 node specific 参数：process.execArgv

```js
process.execArgv.forEach(function (val, index, array) {
  console.log(index + ": " + val);
});

// 运行 node --harmony execArgv.js --nick chyingp
// 输出： 0: --harmony
```

### process.cwd() vs process.chdir(directory)

- process.cwd()：返回当前工作路径
- process.chdir(directory)：切换当前工作路径

```js
console.log("Starting directory: " + process.cwd());
try {
  process.chdir("/tmp");
  console.log("New directory: " + process.cwd());
} catch (err) {
  console.log("chdir: " + err);
}

// Starting directory: /Users/a/Documents/git-code/nodejs-learning-guide/examples/2016.11.22-node-process
// New directory: /private/tmp
```

### 当前进程信息

- process.pid：返回进程 id
- process.title：可以用它来修改进程的名字
- process.uptime()：当前 node 进程已经运行了多长时间（单位是秒）
- process.memoryUsage()：返回进程占用的内存，单位为字节。输出内容大致如下
  `{ rss: 19181568, heapTotal: 8384512, // V8占用的内容 heapUsed: 4218408 // V8实际使用了的内存 }`
- process.cpuUsage([previousValue])：CPU 使用时间耗时，单位为毫秒
  `{ user: 38579, system: 6986 }`
  - user 表示用户程序代码运行占用的时间，system 表示系统占用时间
- process.hrtime() 一般用于做性能基准测试,返回一个数组，数组里的值为 [[seconds, nanoseconds] （1 秒等 10 的九次方毫微秒）

  ```js
  var time = process.hrtime();

  setInterval(() => {
    var diff = process.hrtime(time);

    console.log(`Benchmark took ${diff[0] * 1e9 + diff[1]} nanoseconds`);
  }, 1000);
  // Benchmark took 1006117293 nanoseconds
  // Benchmark took 2049182207 nanoseconds
  // Benchmark took 3052562935 nanoseconds
  ```

- process.execPath node 可执行程序的绝对路径，比如 '/usr/local/bin/node'
- process.platform 进程运行所在处理器架构（字符串）比如'arm', 'ia32', or 'x64'
- process.platform 进程运行平台描述的字符串，比如 darwin、win32 等

**向进程发送信号：process.kill(pid, signal)**

process.kill() 这个方法名可能会让初学者感到困惑，其实它并不是用来杀死进程的，而是用来向进程发送信号。

有不同的信号事件，不是随便写的字符串 【http://nodejs.cn/api/process.html#process_signal_events】

```js
console.log("hello");
process.kill(process.pid, "SIGHUP");
console.log("world");

// hello
```

### 终止进程：process.exit([exitCode])、process.exitCode

- process.exit([exitCode]) 调用 process.exit() 将强制进程尽快退出，即使还有尚未完全完成的异步操作。
- 如果程序出现异常，必须退出不可，那么，可以抛出一个未被捕获的 error，来终止进程，这个比 process.exit() 安全

---

## child_process

child_process 这个模块非常重要。掌握了它，等于在 node 的世界开启了一扇新的大门。

### 创建子进程 (每种方式都有对应的同步版本)

- .exec()、.execFile()、.fork()底层都是通过.spawn()实现的
- .exec()、execFile()额外提供了回调，回调在子进程停止的时候执行

```js
// ===> child_process.exec(command[, options][, callback])
var exec = require("child_process").exec;

// 成功的例子
exec("ls -al", function (error, stdout, stderr) {
  if (error) {
    console.error("error: " + error);
    return;
  }
  console.log("stdout: " + stdout);
  console.log("stderr: " + typeof stderr);
});

// 失败的例子
exec("ls hello.txt", function (error, stdout, stderr) {
  if (error) {
    console.error("error: " + error);
    return;
  }
  console.log("stdout: " + stdout);
  console.log("stderr: " + stderr);
});

// ===> child_process.execFile(file[, args][, options][, callback])
// 跟.exec()类似，不同点在于，没有创建一个新的shell
var child_process = require("child_process");

child_process.execFile("node", ["--version"], function (error, stdout, stderr) {
  if (error) {
    throw error;
  }
  console.log(stdout);
});

child_process.execFile(
  "/Users/a/.nvm/versions/node/v6.1.0/bin/node",
  ["--version"],
  function (error, stdout, stderr) {
    if (error) {
      throw error;
    }
    console.log(stdout);
  }
);
```

child_process.fork(modulePath[, args][, options])

```js
// === parent.js
var child_process = require("child_process");

var child = child_process.fork("./child.js", {
  execArgv: process.execArgv,
});

child.on("message", function (m) {
  console.log("message from child: " + JSON.stringify(m));
});

child.send({ from: "parent" });

// === child.js
console.log("child execArgv: " + process.execArgv);

process.on("message", function (m) {
  console.log("message from parent: " + JSON.stringify(m));
});

process.send({ from: "child" });

// run: node --harmony parent.js
// result:
// child execArgv: --harmony
// message from child: {"from":"child"}
// message from parent: {"from":"parent"}
```

child_process.spawn(command[, args][, options])

```js
var spawn = require("child_process").spawn;
var ls = spawn("ls", ["-al"]);

// 接收子进程的消息
ls.stdout.on("data", function (data) {
  console.log("data from child: " + data);
});

ls.stderr.on("data", function (data) {
  console.log("error from child: " + data);
});

ls.on("close", function (code) {
  console.log("child exists with code: " + code);
});

// 错误处理，包含两种场景，这两种场景有不同的处理方式
var spawn = require("child_process").spawn;

// 场景1：命令本身不存在，创建子进程报错
var child = spawn("bad_command");
child.on("error", (err) => {
  console.log("Failed to start child process 1.");
});

// 场景2：命令存在，但运行过程报错
var child2 = spawn("ls", ["nonexistFile"]);
child2.stderr.on("data", function (data) {
  console.log("Error msg from process 2: " + data);
});
```

默认情况下父进程等待子进程结束

```js
// child.js
var times = 0;
setInterval(function () {
  console.log(++times);
}, 1000);

// parent.js
var child_process = require("child_process");
child_process.spawn("node", ["child.js"], {
  // stdio: 'inherit'
});
// 上面的父进程一直hold着不退出

// 但是我们可以手动调用child.unref(); 让父进程退出
```

---

## crypto 加密

crypto 模块的目的是为了提供通用的加密和哈希算法。用纯 JavaScript 代码实现这些功能不是不可能，但速度会非常慢。Nodejs 用 C/C++实现这些算法后，通过 cypto 这个模块暴露为 JavaScript 接口，这样用起来方便，运行速度也快

### Hash 散列

用于给任意数据一个“签名”。这个签名通常用一个十六进制的字符串表示

```js
const crypto = require("crypto");

const hash = crypto.createHash("md5");

// 可任意多次调用update():
hash.update("Hello, world!");
hash.update("Hello, nodejs!");

console.log(hash.digest("hex")); // 7e1977739c748beac0c0fd14fd26a544

// update()方法默认字符串编码为UTF-8，也可以传入Buffer
// 如果要计算SHA1，只需要把'md5'改成'sha1' ,还可以使用更安全的sha256和sha512
```

### Hmac

Hmac 算法也是一种哈希算法，它可以利用 MD5 或 SHA1 等哈希算法。不同的是，Hmac 还需要一个密钥

只要密钥发生了变化，那么同样的输入数据也会得到不同的签名，因此，可以把 Hmac 理解为用随机数“增强”的哈希算法

```js
const crypto = require("crypto");

const hmac = crypto.createHmac("sha256", "secret-key");

hmac.update("Hello, world!");
hmac.update("Hello, nodejs!");

console.log(hmac.digest("hex")); // 80f7e22570...
```

### AES 对称加密

AES 是一种常用的对称加密算法，加解密都用同一个密钥。crypto 模块提供了 AES 支持，但是需要自己封装好函数，便于使用

- AES 有很多不同的算法，如 aes192，aes-128-ecb，aes-256-cbc
- createCipher 加密
- createDecipher 解密

```js
const crypto = require("crypto");

function aesEncrypt(data, key) {
  const cipher = crypto.createCipher("aes192", key);
  var crypted = cipher.update(data, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

function aesDecrypt(encrypted, key) {
  const decipher = crypto.createDecipher("aes192", key);
  var decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

var data = "Hello, this is a secret message!";
var key = "Password!";
var encrypted = aesEncrypt(data, key);
var decrypted = aesDecrypt(encrypted, key);
```

### RSA 非对称加密算法

RSA 算法是一种非对称加密算法，即由一个私钥和一个公钥构成的密钥对，通过私钥加密，公钥解密，或者通过公钥加密，私钥解密。其中，公钥可以公开，私钥必须保密。

1. 首先，在命令行执行以下命令以生成一个 RSA 密钥对：

`openssl genrsa -aes256 -out rsa-key.pem 2048`

根据提示输入密码，这个密码是用来加密 RSA 密钥的，加密方式指定为 AES256，生成的 RSA 的密钥长度是 2048 位。执行成功后，我们获得了加密的`rsa-key.pem`文件。

2. 通过上面的 rsa-key.pem 加密文件，我们可以导出原始的私钥，命令如下

`openssl rsa -in rsa-key.pem -outform PEM -out rsa-prv.pem`

输入第一步的密码，我们获得了解密后的私钥。

类似的，我们用下面的命令导出原始的公钥：

`openssl rsa -in rsa-key.pem -outform PEM -pubout -out rsa-pub.pem`

我们就准备好了原始私钥文件 rsa-prv.pem 和原始公钥文件 rsa-pub.pem，编码格式均为 PEM

3. 使用 crypto 模块提供的方法，即可实现非对称加解密

```js
const fs = require("fs");
const crypto = require("crypto");

// 从文件加载key:
function loadKey(file) {
  // key实际上就是PEM编码的字符串:
  return fs.readFileSync(file, "utf8");
}

let prvKey = loadKey("./rsa-prv.pem"),
  pubKey = loadKey("./rsa-pub.pem"),
  message = "Hello, world!";

// 使用私钥加密:
let enc_by_prv = crypto.privateEncrypt(prvKey, Buffer.from(message, "utf8"));
console.log("encrypted by private key: " + enc_by_prv.toString("hex"));

let dec_by_pub = crypto.publicDecrypt(pubKey, enc_by_prv);
console.log("decrypted by public key: " + dec_by_pub.toString("utf8"));
```

---

## cluster 集群

node 实例是单线程作业的。在服务端编程中，通常会创建多个 node 实例来处理客户端的请求，以此提升系统的吞吐率。对这样多个 node 实例，我们称之为 cluster（集群）。

借助 node 的 cluster 模块，开发者可以在几乎不修改原有项目代码的前提下，获得集群服务带来的好处

集群有以下两种常见的实现方案，而 node 自带的 cluster 模块，采用了方案二

方案一：多个 node 实例+多个端口

集群内的 node 实例，各自监听不同的端口，再由反向代理实现请求到多个端口的分发。

- 优点：实现简单，各实例相对独立，这对服务稳定性有好处。
- 缺点：增加端口占用，进程之间通信比较麻烦。

方案二：主进程向子进程转发请求

集群内，创建一个主进程(master)，以及若干个子进程(worker)。由 master 监听客户端连接请求，并根据特定的策略，转发给 worker

- 优点：通常只占用一个端口，通信相对简单，转发策略更灵活
- 缺点：实现相对复杂，对主进程的稳定性要求较高。

问题：

- master、worker 如何通信：
  - master 进程通过 cluster.fork() 来创建 worker 进程。cluster.fork() 内部 是通过 child_process.fork() 来创建子进程
  - master 进程、worker 进程是父、子进程的关系， master 进程、woker 进程可以通过 IPC 通道进行通信。
- 如何实现端口共享
  - 秘密在于，net 模块中，对 listen() 方法进行了特殊处理
  - master 进程：在该端口上正常监听请求。（没做特殊处理）
  - worker 进程：创建 server 实例。然后通过 IPC 通道，向 master 进程发送消息，让 master 进程也创建 server 实例，并在该端口上监听请求
- 如何将请求分发到多个 worker
  - 客户端请求到达，master 会负责将请求转发给对应的 worker，具体转发给哪个 worker，这是由转发策略决定的
  - 默认的转发策略是轮询（SCHED_RR）

例子如下，创建与 CPU 数目相同的服务端实例，来处理客户端请求。注意，它们监听的都是同样的端口

```js
// 在cluster模块中，主进程称为master，子进程称为worker

// server.js
var cluster = require("cluster");
var cpuNums = require("os").cpus().length;
var http = require("http");

if (cluster.isMaster) {
  for (var i = 0; i < cpuNums; i++) {
    cluster.fork();
  }
} else {
  http
    .createServer(function (req, res) {
      res.end(`response from worker ${process.pid}`);
    })
    .listen(3000);

  console.log(`Worker ${process.pid} started`);
}

// 输出 假如 cpu是4核
// Worker ${process.pid} started  x 4
```

---

## http

在 nodejs 中，http 可以说是最核心的模块，同时也是比较复杂的一个模块

- server：http.Server 实例，用来提供服务，处理客户端的请求。
- client：http.ClientReques 实例，用来向服务端发起请求。
- serverReq/clientRes：其实都是 http.IncomingMessage 实例。serverReq 用来获取客户端请求的相关信息，如 request header；而 clientRes 用来获取服务端返回的相关信息，比如 response header。
- serverRes：http.ServerResponse 实例

注意：

http.IncomingMessage 实例，在 server、client 都出现了，它的作用是如下

- 在 server 端：获取请求发送方的信息，比如请求方法、路径、传递的数据等
- 在 client 端：获取 server 端发送过来的信息，比如请求方法、路径、传递的数据等。
- 有三个属性需要注意：method、statusCode、statusMessage
  - method：只在 server 端的实例有（也就是 serverReq.method
  - statusCode/statusMessage：只在 client 端 的实例有（也就是 clientRes.method）

### serverReq/clientRes 对象

上面提到过，它是 http.IncomingMessage 实例，在服务端、客户端作用略微有差异

```js
// server.js
// == 下面的 req ==
var http = require("http");
var server = http.createServer(function (req, res) {
  console.log(req.headers);
  res.end("ok");
});
server.listen(3000);

// client.js
// == 下面的res ==
var http = require("http");
http.get("http://127.0.0.1:3000", function (res) {
  console.log(res.statusCode);
});
```

属性 /方法/事件 分类

| 类型 | 名称 | 服务端 | 客户端 |
|---|---| --- | --- |
| 事件 | aborted | ✓ | ✓ |
| 事件 | close | ✓ | ✓ |
| 属性 | headers | ✓ | ✓ |
| 属性 | rawHeaders | ✓ | ✓ |
| 属性 | statusCode | ✕ | ✓ |
| 属性 | statusMessage | ✕ | ✓ |
| 属性 | httpVersion | ✓ | ✓ |
| 属性 | url | ✓ | ✕ |
| 属性 | socket | ✓ | ✓ |
| 方法 | .destroy() | ✓ | ✓ |
| 方法 | .setTimeout() | ✓ | ✓ |

### serverRes 对象

一个 web 服务程序，接受到来自客户端的 http 请求后，向客户端返回正确的响应内容，这就是 res 的职责。

返回的内容包括：状态代码/状态描述信息、响应头部、响应主体

#### 设置状态代码、状态描述信息

```js
// 方法一
res.writeHead(200, "ok");

// 方法二
res.statusCode = 200;
res.statusMessage = "ok";
```

#### 响应头部操作

```js
// 增
// 方法一
res.writeHead(200, "ok", {
  "Content-Type": "text-plain",
});

// 方法二
res.setHeader("Content-Type", "text-plain");

// 删
res.removeHeader("Content-Type");

// 改
res.setHeader("Content-Type", "text/plain");
res.setHeader("Content-Type", "text/html"); // 覆盖

// 查
res.getHeader("content-type");
```

#### 设置响应主体

主要用到 res.write() 以及 res.end() 两个方法。

- response.write(chunk[, encoding][, callback])

  - chunk：响应主体的内容，可以是 string，也可以是 buffer。当为 string 时
  - encoding：编码方式，默认是 utf8
  - callback：当响应体 flushed 时触发
  - 注意：
    - 如果 res.write() 被调用时， res.writeHead() 还没被调用过，那么，就会把 header flush 出去
    - res.write() 可以被调用多次。

- response.end([data][, encoding][, callback])
  - res.end() 的用处是告诉 nodejs，header、body 都给你了，这次响应就到这里吧。
  - callback，当响应传递结束后触发

```js
res.write("hello");
setTimeout(() => {
  res.write("world");
  res.end();
});

// 立刻把结果响应回去，res是write stream, end只能接受string和buffer，所以此处用stringify
res.end(JSON.stringify(obj));
```

#### 超时处理

response.setTimeout(msecs, callback)

```js
var http = require("http");

var server = http.createServer(function (req, res) {
  res.setTimeout(1000, function () {
    clearTimeout(timer);
    res.writeHead(500, "time out");
    res.end("Error Timeout");
  });

  let timer = setTimeout(function () {
    res.write("world");
    res.end();
  }, 2000);
});

server.listen(3000);
```

### ClientRequest（Http 客户端）

当调用 http.request(options) 时，会返回 ClientRequest 实例，主要用来创建 HTTP 客户端请求

#### 简单的 GET 请求

```js
// 写法一
var http = require("http");
var options = {
  protocol: "http:",
  hostname: "id.qq.com",
  port: "80",
  path: "/",
  method: "GET",
};

var client = http.request(options, function (res) {
  var data = "";
  res.setEncoding("utf8");
  res.on("data", function (chunk) {
    data += chunk;
  });
  res.on("end", function () {
    console.log(data);
  });
});

client.end();

// 写法二
var http = require("http");

http.get("http://id.qq.com/", function (res) {
  var data = "";
  res.setEncoding("utf8");
  res.on("data", function (chunk) {
    data += chunk;
  });
  res.on("end", function () {
    console.log(data);
  });
});
```

#### 简单的 post 请求

```js
// method 指定为 POST
// headers 里声明了 content-type 为 application/x-www-form-urlencoded
// 数据发送前，用 querystring.stringify(obj) 对传输的对象进行了格式化
var http = require("http");
var querystring = require("querystring");

var createClientPostRequest = function () {
  var options = {
    method: "POST",
    protocol: "http:",
    hostname: "127.0.0.1",
    port: "3000",
    path: "/post",
    headers: {
      connection: "keep-alive",
      "content-type": "application/x-www-form-urlencoded",
    },
  };

  // 发送给服务端的数据
  var postBody = {
    nick: "chyingp",
  };

  // 创建客户端请求
  var client = http.request(options, function (res) {
    // 最终输出：Server got client data: nick=chyingp
    res.pipe(process.stdout);
  });

  // 发送的报文主体，记得先用 querystring.stringify() 处理下
  client.write(querystring.stringify(postBody));
  client.end();
};

// 服务端程序，只是负责回传客户端数据
var server = http.createServer(function (req, res) {
  res.write("Server got client data: ");
  req.pipe(res);
});

server.listen(3000, createClientPostRequest);
```

#### 各种事件

http.RequestClient 相关的事件共有 7 个

- 与 HTTP 协议相关：connect、continue、upgrade
  - continue 事件：当收到服务端的响应 100 Continue 时触发。熟悉 HTTP 协议的同学应该对 100 Continue 有所了解。当客户端向服务端发送首部 Expect: 100-continue ，服务端经过一定的校验后，决定对客户端的后续请求放行，于是返回返回 100 Continue，知会客户端，可以继续发送数据。（request body）
  - upgrade 事件。当客户端向客户端发起请求时，可以在请求首部里声明 'Connection': 'Upgrade' ，以此要求服务端，将当前连接升级到新的协议。如果服务器同意，那么就升级协议继续通信。
- 其他：abort、aborted、socket、response
  - response 事件 当收到来自服务端的响应时触发，其实跟 http.get(url, cbk) 中的回调是一样的
  - socket 当给 client 分配 socket 的时候触发
  - abort/aborted 事件 都是请求中断时触发，差异在于中断的发起方
    - abort：客户端主动中断请求（第一次调用 client.abort() 时触发）
    - aborted：服务端主动中断请求，且请求已经中断时触发

### Server(http 服务端)

#### 获取请求方信息

```js
var http = require("http");

var server = http.createServer(function (req, res) {
  console.log("客户端请求url：" + req.url);
  console.log("http版本：" + req.httpVersion);
  console.log("http请求方法：" + req.method);

  res.end("ok");
});

server.listen(3000);
```

#### 获取 get 请求参数

```js
var http = require("http");
var url = require("url");
var querystring = require("querystring");

var server = http.createServer(function (req, res) {
  var urlObj = url.parse(req.url);
  var query = urlObj.query;
  var queryObj = querystring.parse(query);

  console.log(JSON.stringify(queryObj));

  res.end("ok");
});

server.listen(3000);
```

#### 获取 post 请求参数

```js
var http = require("http");
var url = require("url");
var querystring = require("querystring");

var server = http.createServer(function (req, res) {
  var body = "";
  req.on("data", function (thunk) {
    body += thunk;
  });

  req.on("end", function () {
    console.log("post body is: " + body);
    res.end("ok");
  });
});

server.listen(3000);
```

#### 事件

常用的事件：

- error

```js
var anotherSvr = http.createServer(noop);

anotherSvr.on("error", function (e) {
  console.error("出错啦！" + e.message);
});
```

- connect vs connection

  - connect：当客户端的 HTTP method 为 connect 时触发。
  - connection：当 TCP 连接建立时触发，大部分时候可以忽略这个事件

- request 当有新的连接到来时触发。那跟 connection 有什么区别呢？

  **keep-alive 登场！在持久化连接的情况下，多个 request 可能对应的是 一个 connection**

---

## net (tcp)

net 模块是同样是 nodejs 的核心模块。在 http 模块概览里提到，http.Server 继承了 net.Server，此外，http 客户端与 http 服务端的通信均依赖于 socket（net.Socket）。也就是说，做 node 服务端编程，net 基本是绕不开的一个模块。

从组成来看，net 模块主要包含两部分

- net.Server：TCP server，内部通过 socket 来实现与客户端的通信。
- net.Socket：tcp/本地 socket 的 node 版实现，它实现了全双工的 stream 接口。

### 简单的 server+client

```js
// ====> 服务端
var net = require("net");

var PORT = 3000;
var HOST = "127.0.0.1";

// tcp服务端
var server = net.createServer(function (socket) {
  console.log("服务端：收到来自客户端的请求");

  socket.on("data", function (data) {
    console.log("服务端：收到客户端数据，内容为{" + data + "}");

    // 给客户端返回数据
    socket.write("你好，我是服务端");
  });

  socket.on("close", function () {
    console.log("服务端：客户端连接断开");
  });
});
server.listen(PORT, HOST, function () {
  console.log("服务端：开始监听来自客户端的请求");
});

// ====> 客户端
var net = require('net');

var PORT = 3000;
var HOST = '127.0.0.1';

// tcp客户端
var client = net.createConnection(PORT, HOST);

client.on('connect', function(){
    console.log('客户端：已经与服务端建立连接');
});

client.on('data', function(data){
    console.log('客户端：收到服务端数据，内容为{'+ data +'}');
});

client.on('close', function(data){
    console.log('客户端：连接断开');
});

client.end('你好，我是客户端');
```

### 服务端 net.Server

- server.address()
    - `{ port: 3000, family: 'IPv4', address: '127.0.0.1' }`

- server.close(callback])
    - 对正在处理中的客户端请求，服务器会等待它们处理完（或超时），然后再正式关闭
    - 正常关闭的同时，callback 会被执行，同时会触发 close 事件
    - 异常关闭的同时，callback 也会执行，同时将对应的 error 作为参数传入
    ```js
    var net = require('net');
    var PORT = 3000;
    var HOST = '127.0.0.1';
    var noop = function(){};

    // tcp服务端
    var server = net.createServer(noop);

    // 没有正式启动请求监听
    // server.listen(PORT, HOST);

    server.on('close', function(){
        console.log( 'close事件：服务端关闭' );
    });

    server.on('error', function(error){
        console.log( 'error事件：服务端异常：' + error.message );
    });

    server.close(function(error){
        if(error){
            console.log( 'close回调：服务端异常：' + error.message );
        }else{
            console.log( 'close回调：服务端正常关闭' );
        }            
    });
    ```

- 事件 listening/connection/close/error
    - listening：调用 server.listen()，正式开始监听请求的时候触发。
    - connection：当有新的请求进来时触发，参数为请求相关的 socket。
    - close：服务端关闭的时候触发。
    - error：服务出错的时候触发，比如监听了已经被占用的端口


### 客户端 net.Socket

```js
var net = require('net');

var PORT = 3000;
var HOST = '127.0.0.1';

// tcp客户端
var client = net.createConnection(PORT, HOST);

client.on('connect', function(){
    console.log('客户端：已经与服务端建立连接');
});

client.on('data', function(data){
    console.log('客户端：收到服务端数据，内容为{'+ data +'}');
});

client.on('close', function(data){
    console.log('客户端：连接断开');
});

client.end('你好，我是客户端');
```

#### 常用的API，属性归类

连接相关：
- socket.connect()
- socket.setTimeout()
- socket.setKeepAlive()
- socket.destroy(）、socket.destroyed：当错误发生时，用来销毁socket，确保这个socket上不会再有其他的IO操作

数据读、写相关

`socket.write()、socket.end()、socket.pause()、socket.resume()、socket.setEncoding()、socket.setNoDelay()`

数据属性相关

`socket.bufferSize、socket.bytesRead、socket.bytesWritten`

事件循环相关

`socket.ref()、socket.unref()`

地址相关
- socket.address()
- socket.remoteAddress、socket.remoteFamily、socket.remotePort
- socket.localAddress/socket.localPort

#### 常用事件
- data 当收到另一侧传来的数据时触发
- connect 当连接建立时触发
- close 连接断开时触发。如果是因为传输错误导致的连接断开，则参数为error
- end 当连接另一侧发送了 FIN 包的时候触发
- error 当有错误发生时，就会触发，参数为error
- timeout 提示用户，socket 已经超时，需要手动关闭连接。
- drain 当写缓存空了的时候触发
- lookup 域名解析完成时触发。 

---

## Https

在nodejs中，提供了 https 这个模块来完成 HTTPS 相关功能。从官方文档来看，跟 http 模块用法非常相似。

### Https客户端例子
跟http模块的用法非常像，只不过请求的地址是https协议的而已
```js
var https = require('https');

https.get('https://www.baidu.com', function(res){
    console.log('status code: ' + res.statusCode);
    console.log('headers: ' + JSON.stringify(res.headers));

    res.on('data', function(data){
        process.stdout.write(data);
    });
}).on('error', function(err){
    console.error(err);
});
```

### 服务端例子
对外提供HTTPS服务，需要有HTTPS证书。如果你已经有了HTTPS证书，那么可以跳过证书生成的环节。如果没有，可以参考如下步骤

#### 生成证书
1 创建个目录存放证书
```sh
mkdir cert
cd cert
```

2 生成私钥
`openssl genrsa -out demo-key.pem 2048`

3 生成证书签名请求（csr是 Certificate Signing Request的意思）
```sh
openssl req -new \
  -sha256
  -key demo-key.key.pem \
  -out demo-csr.pem \
  -subj "/C=CN/ST=Guandong/L=Shenzhen/O=YH Inc/CN=www.demo.com"
```

4 生成证书
```sh
openssl x509 \
  -req -in demo-csr.pem \
  -signkey demo-key.pem \
  -out demo-cert.pem
```

www.demo.com是随便写的域名，配置本地host
`127.0.0.1 www.demo.com`

#### HTTPS服务端 code
```js
var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('./cert/demo-key.pem'), // 私钥
    cert: fs.readFileSync('./cert/demo-cert.pem') // 证书
};

var server = https.createServer(options, function(req, res){
    res.end('这是来自HTTPS服务器的返回');
});

server.listen(3000);
```

### 访问安全证书不受信任的网站

#### 忽略安全警告
```js
var https = require('https');

var options = { 
    hostname: 'kyfw.12306.cn',
    path: '/otn/leftTicket/init',
    rejectUnauthorized: false  // 忽略安全警告
};

var req = https.get(options, function(res){ 
    res.pipe(process.stdout);   
});

req.on('error', function(err){
    console.error(err.code);
});
```

#### 将12306的CA加入受信列表 (以12306为例)
1. 下载 12306 的CA证书

在12306的官网上，提供了CA证书的下载地址，将它保存到本地，命名为 srca.cer

2. 将der格式的CA证书，转成pem格式

`openssl x509 -in srca.cer -inform der -outform pem -out srca.cer.pem`

3. 修改node https的配置
```js
// 例子：将12306的CA证书，加入我们的信任列表里
var https = require('https');
var fs = require('fs');
var ca = fs.readFileSync('./srca.cer.pem');

var options = { 
  hostname: 'kyfw.12306.cn',
  path: '/otn/leftTicket/init',
  ca: [ ca ]
};

var req = https.get(options, function(res){ 
  res.pipe(process.stdout); 
});

req.on('error', function(err){
  console.error(err.code);
});
```


