> 永远年轻，永远热泪盈眶

# 学习大纲  
**回调 -> promise -> generator -> async + await**  （异步发展流程）

## 1.高阶函数
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

## 2.AOP 面向切面编程
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

## 3.lodash after函数
通过了解高阶函数的概念，来看看lodash库中的after函数。
* after - after(time, callBack) - 返回一个function - 多此调用返回的function, 花费time-1次相当的时间，到time次的时候正真执行reportProgress

``` js
// 自己手动模拟after函数
function after(times, fn) {
    return function() {
        if (--times == 0) {
            fn();
        }
    }
}

var afterFn = after(2, function() {
    console.log('hello world');
});

afterFn();
afterFn();
```

* after这样的函数用来解决什么问题？
一般来说，可以用于解决多个异步方法的嵌套问题。
Example: 发送多次异步请求获取参数，将获取到的所有参数通过一个对象返回。

```js
// 用代码模拟实现
let fs = require('fs');

function after(timer, fn) {
    let arr = [];
    return function(data) {
        arr.push(data);
        if ( --timer === 0) {
            fn(arr);
        }
    }
}

let out = after(2, function(arr) {
    console.log(arr);
});

fs.readFile('./day1/static/age.txt', 'utf8', function(err, data) {
    out(data);
});

fs.readFile('./day1/static/name.txt', 'utf8', function(err, data) {
    out(data);
});
```


## 4.发布订阅
* promise redux eventBus。这些都是发布订阅方式实现的
* 发布订阅分为两个过程：发布和订阅。 
* 发布&订阅 相当于 显示世界的中介的概念，发布信息的人提供信息给中介，中介将信息发送给需要了解的相关信息的人。在这个过程中信息发送者和接受者之前没有联系，都是依赖中介为媒体做信息沟通。

```js
// 中介
function Event() {
    this._arr_ = [];
}

// 订阅信息
Event.prototype.on = function(fn) {
    this._arr.push(fn);
}

// 发布信息
Event.prototype.emit = function(data) {
    this._arr.forEach(function(fnItem) {
        fnItem(data);
    });
}

var event = new Event();
var arr = [];
event.on(function(data) {
    arr.push(data);
    if (arr.length === 2) {
        console.log('读取完毕', data);
    }
});
```

## 5.观察者模式
观察者模式（基于发布订阅的）
* 注意区分观察者模式和发布订阅的区别
* 观察者模式有两个对象：观察者和被观察对象。  观察者会根据被观察对象的状态变化做一些行为上的变化。 两者之前是有联系的。
* 比如：爸爸，妈妈是观察者，宝宝是被观察对象。宝宝的行为变化或表情变化会让爸爸妈妈做出对应的反应。1:N

```js
// 手动实现一个观察者模式
// 观察者模式

// 主题 - 被观察对象
function Subject() {
    this.observerArr = [];
    this.message = null;
}

Subject.prototype.attach = function(observer) {
    this.observerArr.push(observer);
}

Subject.prototype.next = function(message) {
    this.message = message;
    this.notifyAll(message);
}

Subject.prototype.notifyAll = function(message) {
    this.observerArr.forEach(function(observableItem) {
        observableItem.fn(message);
    });
}


// 观察者
function Observer(name, subject) {
    this.name = name;
    this.fn = undefined;
    subject.attach(this);
}

Observer.prototype.subscribe = function(fn) {
    this.fn = fn;
};

let subject = new Subject();
let observer1 = new Observer('张三', subject);
let observer2 = new Observer('李四', subject);

observer1.subscribe(function(msg) {
    console.log('我是' + this.name + '---' + msg);
});
observer2.subscribe(function(msg) {
    console.log('我是' + this.name + '---' + msg);
});

subject.next('hello world');
```

## 6.promise应用
promise是es6中新增的功能，是异步编程的一种解决方案。比起传统的回调函数，它更加合理。
* 所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

Promise有很多的使用方法，我们后面会自己手写一个自己的Promise来模拟真实的。 但在手写之前我们一定需要
1 创造一个promise对象
```js
// new Promise时 需要传递一个executor 执行器 (函数) 会立即被调用
let p = new Promise(function(resolve,reject){
    console.log('start');
    reject('情人节到了');
    resolve('情人到了');
});

// es6的内容
p.then((value)=>{
    console.log('success',value);
},(reason)=>{
    console.log('error',reason);
})
console.log('end');

//这里需要注意: promise有三种状态 pending, resolve, reject, 其中pending可以向任意的另外两个状态转变，但是一旦状态变成 resolve / reject 就无法再进行转化
```

2 new Promise中可以夹杂着异步逻辑 且 同一个实例可以多次then
```js
let p = new Promise(function(resolve, reject) {
    console.log('start');
    setTimeout(function() {
        resolve('hello world');
    }, 1000)
});

p.then((value) => {
    console.log('success', value);
}, (error) => {
    console.log('error', error);
})

p.then((value) => {
    console.log('success2', value);
}, (error) => {
    console.log('error2', error);
})

console.log('end');
```

3 链式调用
* 如果一个then方法 返回一个普通值 这个值会传递给下一次then中作为成功的结果
* 不是普通值 （promise 或者报错了）
* 如果返回的是一个promise 会根据返回的promise 是成功还是失败 决定下一个then是成功还是失败
* 捕获错误机制 （1.默认会找离自己最近的then的失败）找不到就向下找
* jquery 链式调用 返回this  promise调用then后 会返回一个新的promise
* 如果自己等待着自己完成 那么当前就应该走向失败

```js
function readFile(url) {
    return new Promise(function(resolve, reject) {
        fs.readFile(url, 'utf8', function(error, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
}

readFile('./day1/static/age.txt').then(function(value) {
    console.log(value);
    return readFile('./day1/static/name.txt');
}).then(data => {
    console.log(data);
    return 100;
}).then(data => {
    console.log(data);
}).catch(err => {
    throw err;
}).then(data => {
    console.log(data);
}, () => {
    console.log('error');
})
```


4 Promise更多的情况和用法
* 如果自己等待着自己完成 那么当前就应该走向失败
```js
let p = new Promise((resolve, reject) => {
    resolve('hello world');
});

p.then((value) => {
    return p;
}).then((value) => {
    console.log(value);
}), (err) => {
    console.log(err);
};
```

* Promise.resolve()  Promise.reject()
* 有时需要将现有对象转为 Promise 对象，Promise.resolve， Promise.reject方法就起到这个作用
```js
// Promise.resolve等价于下面的写法。
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))

Promise.reject('foo')
// 等价于
new Promise((resolve, reject) => reject('foo'));
```

* Promise.all() 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。
```js
// 1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
// 2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。
// 3）如果有一个参数不是promise就先调用下面讲到的Promise.resolve方法将参数转化为Promise实例

const promise = Promise.all([1, fs.readFile('./day1/static/name.txt', 'utf8'), fs.readFile('./day1/static/age.txt', 'utf8')])
.then(data => {return 100}, err => {
    console.log(err);
}).then(data => console.log(data));
```

* Promise.race() 方法
```js
// Promise.race方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例
// const p = Promise.race([p1, p2, p3]);
// 上面代码中，只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数

let racePromise = new Promise((resolve, reject) => {
    setTimeout(function() {
        resolve('rece promise test');
    }, 1000);
});

 Promise.race([racePromise, 1]).then((value) => {
    console.log(value, '<----race');
 });
```


## 7.手写promise A+ 规范 
1 针对6.1的使用案例写出对应的promise对象
```js
function Promise(executor) {
    let that = this;
    that.value = null;
    that.error = null;
    that.status = 'pending';

    function resolve(value) {
        if (that.status === 'pending') {
            that.status = 'resolve';
            that.value = value;
        }
    }

    function reject(error) {
        if (that.status === 'pending') {
            that.status = 'reject';
            that.error = error;
        }
    }

    executor(resolve, reject);
}

Promise.prototype.then = function(successFn, errorFn) {
    let that = this;
    if (that.status === 'resolve') {
        successFn(that.value);
    } else if (that.status === 'reject') {
        errorFn(that.error);
    }
}
```

## 8.generator - 生成器 - 用于生成迭代器



## 9.async + await
