// 异步并行执行钩子
// 异步的并行和下面的串行钩子都有三个设置任务的API
// 1 .tap - 同步注册, 效果和同步钩子差不多。不必等待任务必须执行完成就可以立刻执行回调
// 2 .tapAsync - 异步注册，全部任务完成后执行最终的回调, 需要添加一个callback作为参数
// 3 .tapPromise - promise注册钩子,  全部完成后执行才算成功

// const { AsyncParallelHook }  = require('tapable');

// ---> custom
class AsyncParallelHook {
  constructor(args) {
    this.args = args;
    this.taps = [];
    this.tapAsyncs = [];
    this.tapPromises = [];
  }

  tap(key, callBackFn) {
    this.taps.push(callBackFn);
  }

  tapAsync(key, callBackFn) {
    this.tapAsyncs.push(callBackFn);
  }

  tapPromise(key, callBackFn) {
    this.tapPromises.push(callBackFn);
  }

  callAsync() {
    const params = Array.prototype.slice.call(arguments, 0, this.args.length);
    const callBack = [...arguments].pop();
    this.taps.forEach(tapItemFn => {
      tapItemFn(...params);
    });
    callBack();

    const sum = this.tapAsyncs.length;
    let i = 0;
    function done(err) {
      if (++i === sum) {
          callBack(err);
      }
    }
    this.tapAsyncs.forEach(fn => {
        fn(...params, done)
    })
  }

  promise() {
    const params = Array.prototype.slice.call(arguments, 0, this.args.length);
    const promiseFnArr = this.tapPromises.map(tapItemFn => tapItemFn(...params));
    return Promise.all(promiseFnArr);
  }
}

let queue = new AsyncParallelHook(["name"]);


// -----> tap
console.time('cost');
queue.tap('1',function(name){
    console.log(1);
});
queue.tap('2',function(name){
    console.log(2);
});
queue.tap('3',function(name){
    console.log(3);
});
queue.callAsync('zfpx',err=>{
    console.log(err);
    console.timeEnd('cost');
});


// ----> tap async
// console.time('cost');
// queue.tapAsync('1',function(name,callback){
//     setTimeout(function(){
//         console.log(1);
//         callback();
//     },1000)
// });
// queue.tapAsync('2',function(name,callback){
//     setTimeout(function(){
//         console.log(2);
//         callback();
//     },2000)
// });
// queue.tapAsync('3',function(name,callback){
//     setTimeout(function(){
//         console.log(3);
//         callback();
//     },3000)
// });
// queue.callAsync('zfpx',err=>{
//     console.log(err);
//     console.timeEnd('cost');
// });



// ----> tap promise
// console.time("cost");
// queue.tapPromise("1", function(name) {
//   return new Promise(function(resolve, reject) {
//     setTimeout(function() {
//       console.log(1, name);
//       resolve();
//     }, 1000);
//   });
// });
// queue.tapPromise("2", function(name) {
//   return new Promise(function(resolve, reject) {
//     setTimeout(function() {
//       console.log(2, name);
//       resolve();
//     }, 2000);
//   });
// });
// queue.tapPromise("3", function(name) {
//   return new Promise(function(resolve, reject) {
//     setTimeout(function() {
//       console.log(3, name);
//       resolve();
//     }, 3000);
//   });
// });
// queue.promise("zfpx").then(() => {
//   console.timeEnd("cost");
// });