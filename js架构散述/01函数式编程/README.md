尾调用优化：
关于尾递归更详细的信息和递归到尾递归的转化可以查看阮一峰的博文: https://www.ruanyifeng.com/blog/2015/04/tail-call.html
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
  return sum1(i-1, total);
}

function sum2(i, total) {
    if (i === 1) {
        return i + total;
    }
    sum2(i, total+i);
}

// 在ECMAScript 6，我们将迎来尾递归优化，通过尾递归优化，javascript代码在解释成机器 码的时候，将会向while看齐，也就是说，同时拥有数学表达能力和while的效能
```



