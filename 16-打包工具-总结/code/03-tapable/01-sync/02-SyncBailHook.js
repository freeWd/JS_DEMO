// BailHook中的回调函数也是顺序执行的
// 调用call时传入的参数也可以传给回调函数
// 当回调函数返回非undefined值的时候会停止调用后续的回调

// const {SyncBailHook} = require('tapable');

// ---> custom
class SyncBailHook {
  constructor(args) {
    this.args = args;
    this.taps = [];
  }
  tap(key, callBackFn) {
    this.taps.push(callBackFn);
  }
  call() {
    for (let index = 0; index < this.taps.length; index++) {
      const fnItem = this.taps[index];
      const result = fnItem(
        ...Array.prototype.slice.call(arguments, 0, this.args.length)
      );
      if (result !== undefined) {
        break;
      }
    }
  }
}

const hook = new SyncBailHook(["name", "age"]);
hook.tap("1", (name, age) => {
  console.log(1, name, age);
  //return 1;
});
hook.tap("2", (name, age) => {
  console.log(2, name, age);
  // return 2;
});
hook.tap("3", (name, age) => {
  console.log(3, name, age);
  return 3;
});

hook.call("zhufeng", 10);
