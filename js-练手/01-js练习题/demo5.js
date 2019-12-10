// 你了解的es6的元编程
// 元编程？ 对编程语言的编程 就是元编程

// 001 - Symbol
// Symbol 是 es6新增的一种数据类型 表示独一无二的值。它是 JavaScript 语言的第七种数据类型
// 除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法
// 比如：Symbol.toPrimitive - 对象的Symbol.toPrimitive属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值
let obj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case "number":
        return 123;
      case "string":
        return "str";
      case "default":
        return "default";
      default:
        throw new Error();
    }
  }
};

console.log(2 * obj, 2 + obj, String(obj)); // 246 '2default' 'str'

let obj2 = {
  [Symbol.toPrimitive]: (i => () => ++i)(0)
};
if (obj2 == 1 && obj2 == 2 && obj2 == 3) {
  console.log("obj2竟然能同时等于1，等于2，等于3");
}

// 002 proxy - 代理
let people = {
  age: 20
};
const handle = {
  set(target, key, value) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      throw new Error("年龄必须是数字");
    }
  }
};

let proxy = new Proxy(people, handle);

proxy.age = 23;
proxy.age = '123';
