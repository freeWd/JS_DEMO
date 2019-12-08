// 04   对象的__proto__指向其构造函数的prototype
// 构造函数的prototype（一个对象）有两个属性：constructor -> 指向当前构造函数自己，__proto__ -> 指向父级构造函数的prototype
// 构造函数的__proto__ (一个对象 function) 有很多属性：call, apply, bind, constructor, __proto__ , 其中constructor指向 Function, __proto__指向Object

Object.prototype.a = "a";
Function.prototype.a = "a1";
function Person() {}
var yideng = new Person();
console.log('yideng.a: '+ yideng.a); // a
console.log('person.a'+ Person.a); // a1 和对象一样，自己没有的值到对应的隐式原型(function)上去找
console.log(1..a); // a ? 为什么 1. 也是一个对象
console.log(1.a); // 异常报错 只有1个. 不知道把这个点给谁，给1和给a都不合适
console.log(yideng.__proto__.__proto__.constructor.constructor.constructor); // ==> Function




