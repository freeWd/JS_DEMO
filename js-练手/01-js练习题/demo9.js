// 手动实现 bind

// 001 - 模拟bind
var a = 1;
var obj = {
  a: 2
};
function test(x, y) {
  this.x = x;
  this.y = y;
  console.log(this.a);
  console.log(x + y);
}
test.bind(obj, 10)(12);

// 第一版 - 返回函数
Function.prototype.bind2 = function(context) {
  return () => {
    this.call(context);
  };
};

test.bind2(obj)();

// 第二版 - 传参
Function.prototype.bind3 = function(context) {
  const that = this;
  const args = Array.prototype.slice.call(arguments, 1);
  return function() {
    that.call(context, ...args, ...arguments);
  };
};
test.bind3(obj, 10)(12);

// 第三版 - 构造函数效果的模拟实现 - 一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。
Function.prototype.bind4 = function(context) {
    const that = this;
    const args = Array.prototype.slice.call(arguments, 1);
    const fn = function() {
        // 当作为构造函数时，this 指向实例，self 指向绑定函数，因为下面一句 `fbound.prototype = this.prototype;`，已经修改了 fbound.prototype 为 绑定函数的 prototype，此时结果为 true，当结果为 true 的时候，this 指向实例。
        // 当作为普通函数时，this 指向 window，self 指向绑定函数，此时结果为 false，当结果为 false 的时候，this 指向绑定的 context。
        that.call(this instanceof that ? this : context, ...args, ...arguments);
    }
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承函数的原型中的值
    fn.prototype = Object.create(that.prototype);
    fn.constructor = fn;
    return fn;
}

test.prototype.proValue = '123';
var TestBind = test.bind4(obj, 10, 20);
var testBindObj = new TestBind();
console.log(testBindObj.proValue, testBindObj.x, testBindObj.y);
TestBind.prototype.proValue = 'xxx';


