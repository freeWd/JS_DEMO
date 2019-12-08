function fn() {
  console.log(this.length);
}

var yideng = {
  length: 5,
  method: function() {
    "use strict";
    fn();
    arguments[0]();
  }
};
var result = yideng.method.bind(null);
result(fn, 1);

// 1 window默认存在length属性，且默认值为0
// 2 如果在方法中使用 严格模式，方法中的this默认不指向windows而是undefined
// 3 fn.bind(null) bind中的值为null，相当于没有绑定，是一种象征性的软绑的写法
// 4 fn.bind({}) bind中的值为{} 空对象是，就是硬绑是有作用的

// arguments[0]() ===> arguments.fn(); 此时this指向的是arguments, arguments的length就是此方法实际参数的数量
// 输出结果： 0, 2

// 02 - 1
function yideng2(a, b, c) {
  console.log(this.length);
  console.log(this.callee.length);
}

function fn2(d) {
  arguments[0](10, 20, 30, 40, 50);
}

fn2(yideng2, 10, 20, 30);

// 有强烈的迷惑性， 注意 arguments[0](10, 20, 30, 40, 50) ===> arguments.yedeng(); 此时this指向的就是fn2中的arguments，
// arguments.length  ==> fn2的实参 就是 4
// arguments.callee 就是明确为当前的函数 fn2， fn2.length 是fn2的形参数量 就是 1
// 结果 4 1
