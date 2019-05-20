// global 可以直接访问global。并且没有window的概念
// window 代理了 global

// console.log(global);

// global 里面的process - 就是进程 - 当前运行的环境
// global 里面的Buffer  读取的二进制内容 - buffer主要是内存 缓存 16进制，可以和字符串相互转化


console.log(this);
console.log(process.cwd()); // 在哪执行文件 就打印出位置


// 开发环境  生产环境
// window set a=1
// mac export a=1
// console.log(process.env);

console.log(process.argv);