// 所有的构造函数都接收一个可选参数，参数是一个参数名的字符串数组
// 参数的名字可以任意填写，但是参数数组的长数必须要根实际接受的参数个数一致
// 如果回调函数不接受参数，可以传入空数组
// 在实例化的时候传入的数组长度长度有用，值没有用途
// 执行call时，参数个数和实例化时的数组长度有关
// 回调的时候是按先入先出的顺序执行的，先放的先执行

// const { SyncHook } = require('tapable');

// ----> custom
class SyncHook {
  constructor(args) {
    this.args = args;
    this.fns = [];
  }
  tap(key, callBackFn) {
    this.fns.push(callBackFn);
  }
  call() {
    this.fns.forEach(fnItem => {
      fnItem(...Array.prototype.slice.call(arguments, 0, this.args.length));
    });
  }
}

const hook = new SyncHook(["name", "age"]);
hook.tap("1", (name, age) => {
  console.log("1", name, age);
});
hook.tap("2", (name, age) => {
  console.log("2", name, age);
});
hook.tap("3", (name, age) => {
  console.log("3", name, age);
});

hook.call("myname", "14");
