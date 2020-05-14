// // 防抖和节流的区别：
// // 防抖：一直调用某个函数，防抖是只执行最近的一次
// // 节流：每隔规定的时间执行一次

// let timer = null;
// // 防抖 - 触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间
// function debounce(fn, wait = 1000) {
//   if (timer) {
//     clearTimeout(timer);
//     timer = null;
//   }
//   return new Promise((resolve) => {
//     timer = setTimeout(() => {
//       resolve(fn());
//     }, wait);
//   });
// }

// let index = 1;
// function test() {
//   console.log("这是一个行为");
//   return index++;
// }

// function execute() {
//   throttle(test).then((val) => {
//     console.log("return ===>", val);
//   });
// }
// execute();
// execute();
// execute();
// execute();

// // throttle - 节流
// let timer = null;
// function throttle(fn) {
//   if (!timer) {
//     timer = setTimeout(() => {
//       timer = null;
//       fn();
//     }, 1000);
//   }
// }

// var a = [1, 2, 3, 4, 5, 6];
// a.forEach((item, index) => {
//   console.log(item, index);
//   a.splice(index, 1)
// })

// function test(a, b ) {
//   console.log([...a, ...b])
// }

// test('abc', 'def')

function search(nums, target) {
  const index = [0, nums.length - 1];
  while (nums.length > 0) {
    const end = index.pop();
    const start = index.pop();
    if (end - start > 1) {
      const middle = Math.floor((start + end) / 2);
      if (middle === 0 && nums[0] > nums[1]) {
        return 0;
      }
      if (middle === nums.length - 1 && nums[middle] < nums[middle - 1]) {
        return nums.length - 1;
      }
      if (nums[middle] < nums[middle + 1] && nums[middle] > nums[middle - 1]) {
        index.push(start);
        index.push(middle);
        index.push(middle);
        index.push(end);
      } else {
        return middle + 1;
      }
    } else {
      if (nums[end] < nums[start]) {
        return end;
      }
    }
  }
}

// console.log(search([5, 6, 0, 1, 2, 3, 4], 1)); // 2
// console.log(search([6, 0, 1, 2, 3, 4, 5], 1)); // 1
// console.log(search([3, 4, 5, 6, 0, 1, 2], 1)); // 4
// console.log(search([0, 1, 2, 3, 4, 5, 6], 1)); // 0
// console.log(search([1, 2, 3, 4, 5, 6, 0], 1)); // 6

var totalFruit = function (tree) {
  let startIndex = 0;
  let maxIndex = 1;
  while (startIndex < tree.length) {
    let temp = [tree[startIndex]];

    let endIndex = startIndex + 1;
    for (let i = startIndex + 1; i < tree.length; i++) {
      if (temp.indexOf(tree[i]) === -1) {
        temp.push(tree[i]);
      }
      if (temp.length <= 2) {
        endIndex = i;
      } else {
        break;
      }
    }
    if (endIndex < tree.length && endIndex - startIndex >= maxIndex) {
      maxIndex = endIndex - startIndex + 1;
    }
    startIndex++;
  }
  return maxIndex;
};

console.log(totalFruit([0, 1, 2, 2])); // 3

console.log(/\d+/.test(003))