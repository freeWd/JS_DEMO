// 异步串行钩子
// 任务一个一个执行,执行完上一个执行下一个

// const { AsyncSeriesHook } = require('tapable');

// ----> custom
class AsyncSeriesHook {
  constructor(args) {
    this.args = args;
    this.taps = [];
    this.asyncTaps = [];
    this.promiseTaps = [];
  }

  tap(key, callBack) {
    this.taps.push(callBack);
  }

  tapAsync(key, callBack) {
    this.asyncTaps.push(callBack);
  }

  tapPromise(key, callBack) {
    this.promiseTaps.push(callBack);
  }

  callAsync() {
    const params = Array.prototype.slice.call(arguments, 0, this.args.length);
    this.taps.forEach(tapItem => tapItem(params));

    let index = 0;
    const finalCallBackFn = [...arguments].pop();
    const next = () => {
      const fn = this.asyncTaps[index++];
      if (fn) {
        fn(...params, next);
      } else {
        finalCallBackFn();
      }
    };
    next();
  }

  promise() {
    const params = Array.prototype.slice.call(arguments, 0, this.args.length);
    const [firstFn, ...promiseArr] = this.promiseTaps;
    const result = promiseArr.reduce((a, b) => {
        return a.then(() => b(...params));
    }, firstFn(...params));
    return result;
  }
}

let queue = new AsyncSeriesHook(["name"]);

// console.time('cost');
// queue.tap('1', function (name) {
//     setTimeout(() => {
//         console.log(1);
//     }, 2000);
// });
// queue.tap('2', function (name) {
//     console.log(2);
// });
// queue.tap('3', function (name) {
//     console.log(3);
// });
// queue.callAsync('zhufeng', err => {
//     console.log(err);
//     console.timeEnd('cost');
// });

// -----> tap async
// console.time("cost");
// queue.tapAsync("1", function(name, callback) {
//   setTimeout(function() {
//     console.log(1);
//     callback();
//   }, 1000);
// });
// queue.tapAsync("2", function(name, callback) {
//   setTimeout(function() {
//     console.log(2);
//     callback();
//   }, 2000);
// });
// queue.tapAsync("3", function(name, callback) {
//   setTimeout(function() {
//     console.log(3);
//     callback();
//   }, 3000);
// });
// queue.callAsync("zfpx", err => {
//   console.log(err);
//   console.timeEnd("cost");
// });

// ---> tap promise
console.time("cost");
queue.tapPromise("1", function(name) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      console.log(1, name);
      resolve(1);
    }, 3000);
  });
});
queue.tapPromise("2", function(name) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      console.log(2, name);
      resolve(2);
    }, 2000);
  });
});
queue.tapPromise("3", function(name) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      console.log(3, name);
      resolve(3);
    }, 1000);
  });
});
queue.tapPromise("4", function(name) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        console.log(4, name);
        resolve();
      }, 1000);
    });
  });
queue.promise("zfpx").then(data => {
  console.log(data);
  console.timeEnd("cost");
});
