// 02 - 函数的父级作用域是其定义的时候的作用域而非执行时，要和this区分开
// function fn() {
//   console.log("hello world");
// }
// var yideng = {
//   length: 5,
//   method: function() {
//     "use strict";
//     fn();
//     arguments[0]();
//   }
// };
// const result = yideng.method.bind(null);
// result(fn, 1);

// 03 请问变量a会被GC回收么，为什么呢 - 不会被回收
// function test() {
//   var a = "yideng";
//   return function() {
//     eval("");
//   };
// }
// test()();

// 04   对象的__proto__指向其构造函数的prototype
// 构造函数的prototype（一个对象）有两个属性：constructor -> 指向当前构造函数自己，__proto__ -> 指向父级构造函数的prototype
// 构造函数的__proto__ (一个对象 function) 有很多属性：call, apply, bind, constructor, __proto__
// 其中constructor指向 Function, __proto__指向Object

// Object.prototype.a = "a";
// Function.prototype.a = "a1";
// function Person() {}
// var yideng = new Person();
// console.log('p.a: '+ yideng.a); // a
// console.log(1..a); // a
// console.log(1.a); // 异常报错
// console.log(yideng.__proto__.__proto__.constructor.constructor.constructor); // ==> Function

// 05 请在下面写出JavaScript面向对象编程的混合式继承。并写出ES6版本的继承。
// 要求:汽车是父类，Cruze是子类。
// 父类有颜色、价格属性，有售卖的方法。
// Cruze子 类实现父类颜色是红色，价格是140000,售卖方法实现输出如下语句:
// 将 红色的Cruze 买给了小王价格是14万。很多库里会使用Object.create(null)是什么原因么?(20分)

// es5的写法
// function Car(color, price) {
//     this.color = color;
//     this.price = price;
// }
// Car.prototype.sell = function() {
//     console.log(`售卖价格：${this.price}, 车的颜色：${this.color}`);
// }

// function Cruze(color, price) {
//     Car.call(this, color, price);
// }
// Cruze.prototype = Object.create(Car.prototype);
// Cruze.prototype.constructor = Cruze;

// es6的写法
// class Car {
//     constructor(color, price) {
//         this.color = color;
//         this.price = price;
//     }
//     sell() {
//         console.log(`售卖价格：${this.price}, 车的颜色：${this.color}`);
//     }
// }

// class Cruze extends Car {
//     constructor(color, price) {
//         super(color, price);
//     }

//     sell(buyer) {
//         console.log(`将${this.color}的Cruze 买给了${this.buyer}价格是${this.price}`);
//     }
// }

// Object.create(null) 创建出来的对象中除了自身的属性之外，原型链上没有任何属性，也没有继承任何object的任何东西

// 06 请写出你了解的ES6元编程

// 10
// var s = [];
// var arr = s;
// for (var i = 0; i < 3; i++) {
//   var pusher = {
//       value: "item" + i
//     },
//     tmp;
//   if (i !== 2) {
//     tmp = [];
//     pusher.children = tmp;
//   }
//   arr.push(pusher);
//   arr = tmp;
// }
// console.log(s[0]);

// 【附加题】.请描述你理解的函数式编程，并书写如下代码结果。那么你能使用
// Zone+RX 写出一段FRP的代码么?(10分)
// var Container = function(x) {
//   this.__value = x;
// };

// Container.of = x => new Container(x);
// Container.prototype.map = function(f) {
//   return Container.of(f(this.__value));
// };
// Container.of(3)
//   .map(x => x + 1)
//   .map(x => "Result is " + x);