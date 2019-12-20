// 001 新增定义变量的方式
// 鼓励使用const, 提醒此变量不能被改变，&& 符合函数式编程 && 编译器对const做了优化
"use strict";

const a = "🍊";
let b = "🍌";
b = "🍉";

// 002 解构
const c = [1, 2, 3];
const [first, secnod, third] = c;
console.log(first, secnod, third);

const obj1 = {
  name: "wd",
  age: 24
};
const { name, age } = obj1;
console.log(name, age);

// 03 字符串模板
const d = "123";
const dd = `hello ${d}`;
console.log(dd.startsWith("hello"));
console.log(dd.includes("hello"));

// 04 对象和数组
const arrStr = "12345";
const arr = Array.from(arrStr);
const arr2 = [6, 7, 8, ...arr];
console.log(arr, arr2);

const obj2 = {
  k1: 1,
  arrStr,
  arr,
  q() {
    console.log("🐧");
  }
};
console.log(obj2, obj2.q());
console.log(Object.is(NaN, NaN), NaN === NaN);

const eat = {
  getEat() {
    return "🍗";
  }
};
const drink = {
  getDrink() {
    return "🍺";
  }
};
let sunday = Object.create(eat);
console.log(sunday.__proto__.getEat());

Object.setPrototypeOf(sunday, drink);
console.log(sunday.__proto__.getDrink());
console.log(Object.getPrototypeOf(sunday));

let sunday2 = {
  __proto__: drink,
  getDrink() {
    return super.getDrink + "☕️";
  }
};

// 05 函数
window.a = 30;
const s = {
  a: 40,
  p: function() {
    const qq = {
      a: 50,
      test: () => {
        console.log(this.a);
      }
    };
    qq.test();
  }
};
s.p();

function test(a = 1, { option = true }) {
  console.log(a, option);
}
test(30, {option: 111});
