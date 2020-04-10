// 防抖和节流的区别：
// 防抖：一直调用某个函数，防抖是只执行最近的一次
// 节流：每隔规定的时间执行一次

let timer = null;
// 防抖 - 触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间
function debounce(fn, wait = 1000) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  return new Promise((resolve) => {
    timer = setTimeout(() => {
      resolve(fn());
    }, wait);
  });
}

let index = 1;
function test() {
  console.log("这是一个行为");
  return index++;
}

function execute() {
  throttle(test).then((val) => {
    console.log("return ===>", val);
  });
}
execute();
execute();
execute();
execute();

// throttle - 节流
let timer = null;
function throttle(fn) {
  if (!timer) {
    timer = setTimeout(() => {
      timer = null;
      fn();
    }, 1000);
  }
}

var a = [1, 2, 3, 4, 5, 6];
a.forEach((item, index) => {
  console.log(item, index);
  a.splice(index, 1)
})



function test(a, b ) {
  console.log([...a, ...b])
} 

test('abc', 'def')