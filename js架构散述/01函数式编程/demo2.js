// 基础函子
class Functor {
  constructor(val) {
    this.val = val;
  }

  static of(val) {
    return new Functor(val);
  };

  map(f) {
    Functor.of(f(this.val));
  }
}

// Monad就是一种设计模式，表示将一个运算过程，通过 函数拆解成互相连接的多个步骤。你只要提供下一步运算 所需的函数，整个运算就会自动进行下去
// Promise 就是一种 Monad
// Monad 让我们避开了嵌套地狱，可以轻松地进行深度嵌套的函数式编程，比如IO和其他异步任务

// moand函子的作用总是返回一个单层的函子，flatMap方法与map方法作用相同，唯一的区别就是生成一个嵌套的函子，它会取出后者内部的值
// 保证返回的永远是一个单层的容器，不会出现嵌套的情况

// 如果函数f返回一个函子，那么this.map(f)就会生成一个嵌套的函子，所以join方法保障了flatMap方法总是返回一个单层的函子，这意味着嵌套的函子会被铺平

// Moand 函子
class Monad extends Functor {
  constructor(val) {
    super(val);
  }
  join() {
    return this.val;
  }
  flatMap(f) {
    // 接收一个函数返回的IO函子
    // this.val等于脏操作
    // this.map(f) compose(f, this.val) 函数组合，需要手动执行
    // 返回这个组合函数并执行，注意先后顺序
    return this.map(f).join()
  }
}

function flowRight(fn1, fn2) {
  if (Object.prototype.toString.call(fn2) === '[object Function]') {
    return function() {
        return fn1(fn2());
    }
  } else {
    return function() {
      return fn1(fn2);
    }
  }
}

class IO extends Monad {
  static of (val) {
    return new IO(val);
  }

  map(f) {
    // flowRight(f, this.val) ==> function
    return IO.of(flowRight(f, this.val));
  }
}





// ===== demo
var fs = require('fs');
var readFile = function(fileName) {
  return IO.of(function() {
    return fs.readFileSync(fileName, 'utf-8');
  });
};
var print = function(x) {
  console.log('🍌');
  return IO.of(function() {
    console.log('🍊');
    return x  + 'function 函数式';
  })
}
var tail = function(x) {
  console.log(x);
  return IO.of(function() {
    return x + 'tail 函数式'
  })
}

const result = readFile(__dirname + '/user.txt').flatMap(print)().flatMap(print)().flatMap(tail)();
console.log(result);

// const result1 = readFile('./user.txt');
// console.log(result1().val());


