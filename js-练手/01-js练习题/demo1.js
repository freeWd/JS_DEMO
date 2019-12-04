// 01 输出内容
console.log(a);
console.log(typeof fn(a));

var flag = true;
if (!flag) {
  var a = 1;
}
if (flag) {
  function fn(a) {
    fn = a;
    console.log("test1");
  }
} else {
  function fn(a) {
    fn = a;
    console.log("test2");
  }
}
// 考点：（这题目的考点特别的多，需要好好的分析下）
// （1）变量声明提升  遵循词法作用域, js会有个类似预编译的过程，确定作用域和变量提升
//     对于定义的函数和用var声明的变量，在预编译时会有个提升的操作，将其提升到作用域的顶端。
    
//     注意：var a = 123, 这条语法可以分解成两部分：变量声明：var a 和 变量赋值：a = 123，提升只正对于变量声明而不包括赋值
//      函数的定义分为函数声明和函数表达式： 
//         函数声明：function test() { ... }
//         函数表达式：var fn = function() { ... }
//         对于函数声明来说，提升就是整个函数都被提升到顶部
//         对于函数表达式来说，提升就是类似变量提示，只是提升了 var fn;

//  (2) 重复的变量声明， 如果出现变量值相同的情况，比如之前已经声明了 var a, 后面又有var a的声明但没赋值，以第一次的为准
    // var a = 1;
    // var a = 2;
    // console.log(a); // 2

    // var a = 1;
    // var a;
    // console.log(a); // 1  同样是变量提升的问题，相当于 var a; var a; a = 1;

// （3）对于在块级作用域里面的函数声明，其实存在历史遗留问题
// 	以前在ES5的时候，规范规定函数只能在顶层作用域和函数作用域之中声明，但浏览器为了兼容考虑，没有遵守这个规范
// 	到了现在ES6的年代，规范规定了块级作用域的存在，函数就可以在块级作用域中定义了
// 	在ES6的浏览器中，它们的行为实际上是这样的：
// 	3.1 - 允许块级作用域中定义函数
// 	3.2 - 函数声明实际上将会类似于使用var声明的函数表达式，函数名将会提升至当前作用域顶
// 	3.3 - 同时函数声明也会保持在块级作用域中的提升行为
// 	所以块级作用域中函数的声明就相当于用函数表达式声明

// 01 - 1 -- 接着看下如下问题
getName(); 
var getName = function() {
  console.log("wscat");
};
getName();
function getName() {
  console.log("oaoafly");
}
getName();
//oaoafly - wscat - wscat



// 01 - 2 如果修改下题目，改成如下形式：是输出test 还是 error - fn1 is not function 亦或者是 test1 ??
console.log(fn1());
function fn1() {
  console.log("test");
}
var flag = true;
if (flag) {
  function fn1() {
    console.log("test1");
  }
} else {
  function fn1() {
    console.log("test2");
  }
}
// test - 重复声明问题


// 01 - 3
function fn2() {
    console.log('test');
}
function init() {
    fn2();
    var flag = true;
    if (flag) {
        function fn2() {
            console.log('test2');
        }
    }
}
init();
// 和01-2类似，不过是包到了函数里面，这时候就会发生变化：虽然重复声明，但是不在一个作用域下面，所以会被覆盖




