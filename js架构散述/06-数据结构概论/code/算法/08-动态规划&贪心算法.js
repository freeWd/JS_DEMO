// 动态规范：被认为是与递归相反的技术，从底部分解很多小问题解决掉，组成解决方法

// 斐波那契数组：0，1，1，2，3，5，8，13，21，34...  F(0) = 0; F(1) = 1; F(2) = F(0) + F(1)
// 递归：
function fib1(n) {
  if (n < 2) {
    return n;
  }
  return fib1(n - 1) + fib1(n - 2);
}

// 尾递归
function fib2(n, ret1 = 1, ret2 = 1) {
  if (n < 2) {
    return ret1;
  }
  return fib2(n - 1, ret2, ret1 + ret2);
}

// 动态规范
function dynFib(n) {
  var arr = [];
  for (var i = 0; i < n; i++) {
    arr[i] = 0;
  }
  if (n === 0) {
    return 0;
  } else if (n === 1 && n === 2) {
    return 1;
  } else {
    arr[1] = 1;
    arr[2] = 1;
    for (var j = 3; j <= n; j++) {
      arr[j] = arr[j - 1] + arr[j - 2];
    }
    return arr[n];
  }
}

console.log(fib1(5));
console.log(fib2(5));
console.log(dynFib(5));

// 贪心算法：是一种寻找最优解为手段达成整体解决方案的算法， 这些优质的解决方案称为【局部最优解】，将有希望得到最终解决方案称为【全局最优解】
// 找零问题：50块，10块，5块，1块
// 传入需要找零的金额，输出数组：应找钱的具体分配
var allCash = [50, 10, 5, 1];
function makeChange(originRmb) {
  var coins = [];
  for (var i = 0; i < allCash.length; i++) {
    var remainValue = originRmb % allCash[i];
    var useValue = originRmb / allCash[i];
    for (var j = 1; j <= useValue; j++) {
        coins.push(allCash[i]);
    }
    originRmb = remainValue;
  }
  return coins;
}

console.log(makeChange(63));
