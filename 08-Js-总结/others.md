> 俺老孙这一生，不修来世！ - 爱潜水的乌贼 《一世之尊》

## 高阶函数
* 什么是高阶函数
如果一个函数的入参或者返回值是一个函数，那么这个函数（前面那个）就被称为高阶函数

```js
Function.prototype.before = function(fn) {
    var that = this;
    return function() {
        fn();
        that();
    }
}

var oldFn = function() {
    console.log('old funtion');
}

var newFn = oldFn.before(function() {
    console.log('new function');
})

newFn();
// new function
// old function
```
上面的before就是一个高阶函数，它的入参是一个函数，返回值也是一个函数。

## AOP 面向切面编程
面向切面的编程 (Aspect Oriented Programming)
* 面向切面编程，通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术
* 在js中就是不改变原有逻辑的情况下对于对原函数、类的部分功能的增强。
* es6中的装饰器，注解使用的就是AOP模式的编程。

``` js
// 简单的AOP实现，就是在原函数执行的前后，增加运行
// before和after两个增强方法，用这个新函数替换原函数
Function.prototype.aop = function(before, after) {
    let that = this;
    return function() {
        that.before.apply(that, arguments);
        that.apply(that, arguments);
        that.after.apply(that, arguments);
    }
}

Function.prototype.before = function() {
    console.log('我在方法之前执行');
}

Function.prototype.after = function() {
    console.log('我在方法之后执行');
}

function normalFn(name) {
    console.log('hello' + name);
}

var aopFn = normalFn.aop(before, after);
aopFn('Jack');
```


## 原生ajax和fetch



## Web Worker


## Muatation Observer