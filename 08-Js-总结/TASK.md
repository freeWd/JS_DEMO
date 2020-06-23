## promise 手写
想完美写出Promise，就要阅读 `Promise/A+ 规范`, 当然我没读过，所以写不出完美的代码，但是写个照猫画虎也差不多了，最重要不是手写它，而是了解它的运作思想和套路

### 基本考虑：

- promise三个状态
    - pending
    - resolved
    - rejected

- 内置resolve，reject函数能够让构造函数中的回调直接调用

- 内置resolvedCallbacks, rejectedCallbacks用于保存then中的回调，当触发resolve或者reject时执行





## bind, call, apply 手写
