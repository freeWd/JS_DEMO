函数式是一套数学的规律

函数式的基本特性和原则
- 函数是一等公民 
- 只用表达式，不用语句
- 没有副作用
- 不修改状态
- 引用透明，函数运行只靠参数

函数要纯，固定的输入一定得到固定的输出，没有副作用
xs.slice(0,3); - 纯函数，xs不会被修改
xs.splice(0, 3); - 不纯的函数，xs值每次调用被修改

什么是纯函数？
1. 对于相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用，也不依赖外部环境的状态
2. 不修改传入进去参数的值

副作用？
一个可以被观察的副作用是在函数内部与其外部的任意交互。这可能是在函数内修改外部的变量，或者在函数里调用另外一个函数等。
注: 如果纯函数调用纯函数，则不产生副作用依旧是纯函数。
**副作用来自，但不限于：**
- 进行一个 HTTP 请求
- Mutating data
- 输出数据到屏幕或者控制台
- DOM 查询/操作
- Math.random()
- 获取的当前时间

```js
// -- 优点
import _ from 'lodash';
var sin = _.memorize(x => Math.sin(x));
//第一次计算的时候会稍慢一点 var a = sin(1);
//第二次有了缓存，速度极快
var b = sin(1); 纯函数不仅可以有效降低系统的复 杂度，还有很多很棒的特性，比如 可缓存性
纯函数降低复杂度，可缓存

// -- 缺点
//不纯的
var min = 18;
var checkage = age => age > min;
//纯的，这很函数式
var checkage = age => age > 18;
在不纯的版本中，checkage 不仅取决于 age 还有外部依赖的变量 min。
纯的 checkage 把关键数字 18 硬编码在函数 内部，扩展性比较差。
纯函数的扩张性较差
```

针对扩张性较差的情况，使用柯里化可以解决。
柯里化(Curried) 通过偏应用函数实现
什么是柯里化 ？ 传递给函数一部分参数调用，返回一个函数来处理剩下的参数
```js
var checkage = min => age => age > min;
var checkage18 = checkage(18);
checkage18(20);
```
避免纯函数硬编码，也保留纯函数的特性

再来看个例子
```js
// 柯里化之前 - 非纯函数
function add(x, y) {
    return x + y;
}
add(2,1); // 3

// 柯里化之后 
function addX(y) {
    return function(x) {
        return x + y;
    }
}
addX(1)(2); // 3

// bind进行柯里化
function test(x, y) {
    this.value = x + y;
}
var bar = test.bind(null, 'x');
var baz = new bar('y');
console.log(baz.value);
```

柯里化内容复杂度高的时候可能会出现下面的“洋葱代码” ： h(g(f(x)))
为了解决函数嵌套的问题，我们可以考虑使用函数组合

```js
const compose = (f, g) => (x => f(g(x)));
var first = arr => arr[0];
var reverse = arr => arr.reverse();
var last = compose(first, reverse);
last([1,2,3,4,5]); 
// 5
```

Point Free
将一些对象自带的方法转化成纯函数，不要命名转瞬即逝的中间变量。

下面的函数中，我们使用了str作为我们的中间变量，但是它除了让代码变得更加冗余是毫无意义的
```js
const f = str => str.toUpperCase().split(' ');
f('abc de f'); // ['ABC', 'DE', 'F']

// =====>
let toUpperCase = word => word.toUpperCase();
let split = x => (str => str.split(x));
const f = componse(split(' '), toUpperCase);
f('abc de f');
```


高阶函数：
函数当参数，把传入的函数做一个封装，然后返回这个封装函数,达到更高程度的抽象。
```js
var add = function(a, b) {
  return a + b;
};
function math(func, array) {
  return func(array[0], array[1]);
}
math(add, [1, 2]); // 3
```


尾调用优化：
执行递归函数的时候，需要保持大量的执行记录，运行和逻辑书写不当容易造成堆栈溢出，
如果在函数的最后一步调用自身 （尾递归， 直接调用，不参与任何逻辑），这种尾递归就相当于一个循环体，只保存一个调用记录，不会发生堆栈溢出的错误
尾递归的判断标准是函数运行【最后一步】是否调用自身， 而不是 是否在函数的【最后一行】调用自身, 最后一行调用其他函数 并返回叫尾调用
```js
// 传统的递归
function sum(i) {
    if (i === 1) return 1;
    return i + sum(i-1);
}

// 尾递归
function sum1(i, total) {
  total+=i;
  if (i === 1) return total;
  return sum2(i-1, total);
}

function sum2(i, total) {
    if (i === 1) {
        return i + total;
    }
    sum2(i, total+i);
}

// 在ECMAScript 6，我们将迎来尾递归优化，通过尾递归优化，javascript代码在解释成机器 码的时候，将会向while看起，也就是说，同时拥有数学表达能力和while的效能
```


范畴论
函数式编程是一种数学运算的求值过程，用数学的逻辑写代码。想去实现循环就用递归
本质上，函数式编程只是范畴论的运算方法，跟数理逻辑、微积分、 行列式是同一类东西，都是数学方法，只是碰巧它能用来写程序。为 什么函数式编程要求函数必须是纯的，不能有副作用?因为它是一种 数学运算，原始目的就是求值，不做其他事情，否则就无法满足函数 运算法则了。


1.函数不仅可以用于同一个范畴之中值的转换，还可以用于将一个范畴转成另一个范畴。这就涉及到了函子(Functor)
2.函子是函数式编程里面最重要的数据类型，也是基本的运算 单位和功能单位。它首先是一种范畴，也就是说，是一个容 器，包含了值和变形关系。比较特殊的是，它的变形关系可 以依次作用于每一个值，将当前容器变形成另一个容器

容器和Functor(函子)
$(...) 返回的对象并不是一个原生的 DOM 对象，而是对于原生对 象的一种封装，这在某种意义上就是一个“容器”(但它并不函数 式)。
Functor(函子)遵守一些特定规则的容器类型。
Functor 是一个对于函数调用的抽象，我们赋予容器自己去调用 函数的能力。把东西装进一个容器，只留出一个接口 map 给容 器外的函数，map一个函数时，我们让容器自己来运行这个函数， 这样容器就可以自由地选择何时何地如何操作这个函数，以致于 拥有惰性求值、错误处理、异步调用等等非常牛掰的特性

函子代码的实现
1.任何具有map方法的数据结构，都可以当作函子的实现。 
2.Functor(函子)遵守一些特定规则的容器类型。
3.Functor 是一个对于函数调用的抽象，我们赋予容器自己去 调用函数的能力。把东西装进一个容器，只留出一个接口 map 给容器外的函数，map 一个函数时，我们让容器自己 来运行这个函数，这样容器就可以自由地选择何时何地如 何操作这个函数，以致于拥有惰性求值、错误处理、异步 调用等等非常牛掰的特性。

```js
// es5实现
var Container = function(x) {
    this._value = x;
}
Container.of = function(x) {
    return new Container(x);
}

Container.prototype.map = function(f) {
    return Container.of(f(this._value));
}

Container.of(3)
    .map(x => x + 1)
    .map(x => 'result' + x)

// es6
class Container {
    constructor(x) {
        this._value = x;
    }

    map(f) {
        return new Container(f(this._value));
    }
}

(new Container(2)).map(function(y) {
    return 2 + y;
});
```
上面代码中，Functor是一个函子，它的map方法接受函数f作为 参数，然后返回一个新的函子，里面包含的值是被f处理过的 (f(this.val))。 一般约定，函子的标志就是容器具有map方法。该方法将容器里 面的每一个值，映射到另一个容器。 上面的例子说明，函数式编程里面的运算，都是通过函子完成， 即运算不直接针对值，而是针对这个值的容器----函子。函子本 身具有对外接口(map方法)，各种函数就是运算符，通过接口 接入容器，引发容器里面的值的变形。 因此，学习函数式编程，实际上就是学习函子的各种运算。由 于可以把运算方法封装在函子里面，所以又衍生出各种不同类 型的函子，有多少种运算，就有多少种函子。函数式编程就变 成了运用不同的函子，解决实际问题
