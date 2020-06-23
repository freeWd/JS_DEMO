> 盛时常做衰时想，上场当念下场时 - 曾国藩

# ES6

## var, let, const

### 变量提升&函数提升

在使用 var 定义变量，或者构建一个函数声明的时候，js 会在预编译阶段提升定义位置，将其提升到当前作用域的最上面

```js
// 不会报错，输出undefined
console.log(a);
var a = 12;

// 'hello world'
test();
function test() {
  console.log("hello world");
}

// Error: test2 is not a function
test2();
var test2 = function () {
  console.log("hello world");
};

// undefined
var a = 12;
function test() {
  console.log(a);
  var a = 13;
}
test();
```

**为什么会存在提升这样的情况呢？**

为了解决函数相互调用的问题

### 暂时性死区

ES6 中的 let, const 定义的变量不会出现变量提升，同时会产生块级作用域。

在`代码块内`，使用 let 命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ

```js
// Error: Cannot access 'a' before initialization
function test() {
  console.log(a);
  let a = 20;
}
test();

// 1, undefined
// let，const在全局的声明不会将变量挂载到window上，但是var会挂载
var b = 1;
let c = 2;
console.log(window.b, window.c);
```

总结：

- 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
- var 存在提升，我们能在声明之前使用。let、const 因为暂时性死区的原因，不能在声明前使用
- var 在全局作用域下声明变量会导致变量挂载在 window 上，其他两者不会
- let 和 const 作用基本一致，但是后者声明的变量不能再次赋值

## 原型继承和 Class 继承

### 利用原型的思想模拟面向对象的继承

```js
function Parent(name, age = "30") {
  this.name = name;
  this.age = age;
}
Parent.prototype.method1 = function () {
  console.log("hello, I am " + this.name);
};

function Child(name, gender) {
  Parent.call(this, name);
  this.gender = gender;
}
// Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

Child.prototype.method2 = function () {
  console.log("xxx", this.gender, this.name);
};
```

### Class(es6)的继承

Class 本质就是用的原型，它是一个语法糖

```js
class Parent {
  constructor(name, age = "30") {
    this.name = name;
    this.age = age;
  }

  method1() {
    console.log("hello, I am " + this.name);
  }
}

class Child extends Parent {
  constructor(name, gender) {
    Super(name);
    this.name = name;
    this.gender = gender;
  }

  method2() {
    console.log("xxx", this.gender, this.name);
  }
}
```

## 模块化

- 解决命名冲突和变量全局污染的问题
- 提高代码的可读性和可维护性
- 提高代码的复用性

历史发展

- 立即执行函数

  ```js
  (function (global) {
    global.test = function () {};
  })(global);
  ```

- AMD 和 CMD（没用过，现在貌似也很少见了）

  ```js
  // AMD
  define(["./a", "./b"], function (a, b) {
    // 加载模块完毕可以使用
    a.do();
    b.do();
  });
  // CMD
  define(function (require, exports, module) {
    // 加载模块
    // 可以把 require 写在函数体的任意地方实现延迟加载
    var a = require("./a");
    a.doSomething();
  });
  ```

- CommonJS 目前使用很广泛，平时主要在 Node 和 Webpack 中使用的比较多

  ```js
  // 导出1和导出2是不一样的，具体的可以在后面的nodejs环节再说
  // 导出1是可以导出任何类型的值的，导出2只能以添加属性的方式添加内容，如果直接赋值就无效
  module.exports = {
    a: 123,
  };

  // 导出2
  exports.b = "1234";

  // 导入
  require("xxx");
  ```

* ESModule - js 原生实现的模块化方法

```js
// 引入模块 API
import XXX from "./a.js";
import { XXX } from "./a.js";
// 导出模块 API
export function a() {}
export default function () {}
```

ESModule 与 Commonjs 的区别

- CommonJS 支持动态导入，也就是 `require(${path}/xx.js)`, import 目前不支持
- CommonJS 是同步导入，ESModule 是异步导入，使用场景不一样（前者主要在服务端，后者在客户端同步会对渲染产生影响）
- CommonJS 在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变。 ES Module 采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
- ES Module 会编译成 require/exports 来执行的

## ES6 中新增的一些内容（不是所有的）

### Symbol

#### Symbol 介绍

Symbol 是 es6 中新增的一种数据类型，表示唯一性，独一无二的值

es5 中对象的属性名都是字符串，这很容易造成属性名的冲突，如果有一种机制能保证每个属性名都是独一无二的这样就可以从根本上防止属性的冲突，这就是引入 Symbol 的原因

symbol 类型的数据用 Symbol 函数生成，Symbol 函数不能`new`，因为它是一个原始类型的值，不是对象。它创建的 symbol 类型的值是一种类似 string 的值类型的数据，也不能为其添加属性

```js
let s = Symbol();
typeof s; // "symbol"
console.log(s); // "Symbol()"

let s1 = Symbol();
console.log(s1); // "Symbol()"

// 没错，s和s1是两个完全不相等的数，它们除了数据类型是symbol之外没有任何相同的地方
s == s1; // false
```

上面的 s 和 s1 是不一样的，但大于出来值又是一样的，那怎么区分它们呢？

Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分，这个参数的目的也仅此而已，就算传入相同的参数，两个值还是独一无二，相互不一样的

```js
let s1 = Symbol("foo");
let s2 = Symbol("bar");

s1; // Symbol(foo)
s2; // Symbol(bar)

s1.toString(); // "Symbol(foo)"
s2.toString(); // "Symbol(bar)"

// 如果我们就是想生成两个一样的symbol值呢？ Symbol.for 需要传入的参数相同
let s1 = Symbol.for("foo");
let s2 = Symbol.for("foo");
s1 === s2; // true
```

Symbol 作为属性名，该属性不会出现在`for...in、for...of`循环中，也不会被`Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()`返回，但它也不是私有属性

有一个`Object.getOwnPropertySymbols`方法，可以获取指定对象的所有 Symbol 属性名

#### Symbol 用法

- 作为属性名

```js
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = "Hello!";

// 第二种写法
let a = {
  [mySymbol]: "Hello!",
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: "Hello!" });

// 以上写法都得到同样结果
a[mySymbol]; // "Hello!"

// 但mySymbol作为属性不能用 点 运算，因为点后面都是接字符串
a.mySymbol = "Hello!";
a[mySymbol]; // undefined
```

- 作为一组常量, 保证这组常量的值都是不相等的

```js
const COLOR_RED = Symbol();
const COLOR_GREEN = Symbol();

function getComplement(color) {
  switch (color) {
    case COLOR_RED:
      return COLOR_GREEN;
    case COLOR_GREEN:
      return COLOR_RED;
    default:
      throw new Error("Undefined color");
  }
}
```

- 单例时避免模块内容被覆盖

```js
// mod.js
const FOO_KEY = Symbol("foo");

function A() {
  this.foo = "hello";
}

if (!global[FOO_KEY]) {
  global[FOO_KEY] = new A();
}

module.exports = global[FOO_KEY];

// 上面代码中，可以保证global[FOO_KEY]不会被无意间覆盖
```

### Set && Map

Set 和 Map 是 ES6 中新增的数据结构

#### Set

Set 类似于数组，但是成员的值都是唯一的，没有重复的值

没什么可说的，直接看如何使用就好了

```js
let s = new Set();
[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));
for (let i of s) {
  console.log(i); // 2,3,4,5
}

// Set 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数, 它能区分两个NaN，这块比 === 还好用
// add(value)：添加某个值，返回 Set 结构本身。
// delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
// has(value)：返回一个布尔值，表示该值是否为Set的成员。
// clear()：清除所有成员，没有返回值。

let s2 = new Set([1,2,3,4,4])
[...set] // [1,2,3,4]
s2.size // 4


// Set遍历
// keys()，values()，entries()
let s3 = new Set(['red', 'green', 'blue']);
for(let item of s3.keys()) {
  console.log(item) // red, green, blue
}

for(let itme2 of s3.values()) {
  console.log(item2) // red, green, blue
}

for(let itme2 of s3.entries()) {
  console.log(item2) // ["red", "red"] ["green", "green"] ["blue", "blue"]
}

s3.forEach((value, key) => console.log(key + ' : ' + value)) // "red":"red"  "green":"green" "blue":"blue"
```

#### Map

ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现

```js
let m = new Map();
const o = {p : 'hello world'}

m.set(o, 'content')
m.get(o) // { p: 'hello world' }

m.has(o) // true
m.delete(o) // true
m.has(o) // false

// 接收数组 Map 也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);
map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"

// 遍历方法
// keys()：返回键名的遍历器。
// values()：返回键值的遍历器。
// entries()：返回所有成员的遍历器。
// forEach()：遍历 Map 的所有成员
const map3 = new Map([
  [1, 'one']
  [2, 'two']
])
[...map3.keys()] //[1,2]
[...map3.values()] // ['one', 'two']
[...map3.entries()] // [[1,'one'], [2, 'two']]
[...map3] // [[1,'one'], [2, 'two']]
map3.forEach(function(value, key, map) {
  console.log("Key: %s, Value: %s", key, value);
});
```

### Iterator

js 中有很多“集合”类型：Array, Object, Set, Map,这样就需要一种统一的接口机制，来处理所有不同的数据结构。

遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）

Iterator 作用

- 为各种数据结构，提供一个统一的、简便的访问接口
- 使得数据结构的成员能够按某种次序排列
- es6 创造了一种新的遍历命令 for...of 循环，Iterator 接口主要供 for...of 消费

`ES6 规定，默认的 Iterator 接口部署在数据结构的Symbol.iterator属性，或者说，一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”（iterable）`,Symbol.iterator 方法对应的是遍历器生成函数

原生具备 Iterator 接口的数据结构如下: `Array, Map, Set, String, TypedArray, arguments, NodeList`

下面这些场景都用到了 Iterator

```js
// 1 解构赋值
let set = new Set().add("a").add("b").add("c");
let [x, y] = set; // x='a'; y='b'
let [first, ...rest] = set; // first='a'; rest=['b','c'];

// 2 扩展运算符
var str = "hello";
[...str]; //  ['h','e','l','l','o']

let arr = ["b", "c"];
["a", ...arr, "d"];
// ['a', 'b', 'c', 'd']

// 3 yield* (异步再细聊)

// 4 for...of， Array.from()， Map(), Set()， Promise.all()，Promise.race()
```

Iterator 的遍历过程:

- 创建一个指针对象，指向当前数据结构的起始位置
- 第一次调用指针对象的 next 方法, 可以将指针指向数据结构的第一个成员
- 第二次调用指针对象的 next 方法, 指针就指向数据结构的第二个成员
- 不断调用指针对象的 next 方法，直到它指向数据结构的结束位置

一个对象如果要具备可被 for...of 循环调用的 Iterator 接口，就必须在 Symbol.iterator 的属性上部署遍历器生成方法

```js
// 实现
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() {
    let that = this;
    return {
      value: that.value,
      stop: that.stop,
      next() {
        var value = this.value;
        if (value < this.stop) {
          this.value++;
          return { done: false, value: value };
        }
        return { done: true, value: undefined };
      },
    };
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(0, 3)) {
  console.log(value); // 0, 1, 2
}
```

### Proxy

Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

人话：Proxy 可以给对象设置拦截器

```js
// Proxy 对象的所有用法，都是下面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。
var proxy = new Proxy(target, handler);
```

proxy 拦截器一共有 13 种 下面只选几个常见的：

- get(target, propKey, receiver)：拦截对象属性的读取
- set(target, propKey, value, receiver)：拦截对象属性的设置，返回 boolean
- has(target, propKey)：拦截 propKey in proxy 的操作, 返回 boolean
- deleteProperty(target, propKey)：拦截 delete proxy[propKey]的操作，返回 boolean
- ownKeys(target) 拦截 Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in 循环，返回一个数组。
- defineProperty(target, propKey, propDesc)：拦截 Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值

```js
const handler = {
  get(target, key) {
    console.log("读取：" + key);
    return target[key];
  },
  set(target, key, value) {
    console.log("设置新值：" + key + ":" + value);
    target[key] = value;
    return true;
  },
};

const proxy = new Proxy({}, handler);
proxy.foo = "bar";
```

`vue3.0 重写数据响应式部分，用Proxy代替Object.defineProperty, 因为Proxy 无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好`

### Decorator

有点类似可以自定义的语法糖，可以用它来使得代码进一步解耦，也能一定程度上实现AOP

修饰器一般可以修饰类，还可以修饰类的属性。
```js
// 修饰器的行为类似于下面
@decorator
class A {} 

// 等同于

class A {}
A = decorator(A) || A;
```

```js
// 修饰类
@testable
class MyTestableClass {
  // ...
}

function testable(target) {
  target.isTestable = true;
}

MyTestableClass.isTestable // true


// 带参数
@testable(true)
class MyTestableClass {
  // ...
}

function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  }
}


// 修饰类的属性
class Person {
  @readonly
  name() { return `${this.first} ${this.last}` }
}

function readonly(target, name, descriptor) {
  descriptor.writable = false;
  return descriptor;
}


// 如果同一个方法有多个修饰器，会像剥洋葱一样，先从外到内进入，然后由内向外执行
function dec(id){
  console.log('evaluated', id);
  return (target, property, descriptor) => console.log('executed', id);
}

class Example {
    @dec(1)
    @dec(2)
    method(){}
}
// evaluated 1
// evaluated 2
// executed 2
// executed 1
```

**注意：修饰器只能用于类和类的方法，不能用于函数，因为存在函数提升。使得可能被修饰的函数提升到顶部，其对应的修饰器在没有初始化好的情况下执行**

