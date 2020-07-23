// 可以指定循环时候的上下文，循环的上下文在多次循环之间保持不变

const { SyncLoopHook } = require("tapable");

const hook = new SyncLoopHook(["name"]);
let counter = 0;

// 不是只传名称，而是传对象
hook.tap({ context: true, name: "1" }, (context, name) => {
  context[counter] = counter;
  console.log(counter, context, name);
  if (++counter > 2) {
    return;
  }
  return true;
});

hook.intercept({
  context: true,
  loop(context) {
    // 每次循环都执行此拦截器
    console.log("loop", context);
  },
});


hook.call('hello world')