// 1 顺序查找， 2 二分查找

// 1 顺序查找 - 暴力查找，从第一个查到最后一个，
// 自组织数据：数据的位置并非有程序员在程序执行之前就组织好，而是在程序运行过程中由程序自动组织
// 80-20原则，80%的查找操作都是针对所有数据中的20%进行的查找
function seqFind(arr, data) {
  for (let index = 0; index < arr.length; index++) {
    if (arr[index] === data) {
      return index;
    }
  }
  return -1;
}

// 优化顺序查找，对于频繁查找的数据调到数组的前排
function seqFind2(arr, data) {
  for (let index = 0; index < arr.length; index++) {
    if (arr[index] === data) {
      // 将查找到的数据前移
      if (index > arr.length * 0.5 && index - 1 >= 0) {
        var temp = arr[index - 1];
        arr[index - 1] = arr[index];
        arr[index] = temp;
      }
      return index;
    }
  }
  return -1;
}

function findMax(arr) {
  var max = arr[0];
  for (let index = 0; index < arr.length; index++) {
    if (max < arr[index]) {
      max = arr[index];
    }
  }
  return max;
}

function findMin(arr) {
  var min = arr[0];
  for (let index = 0; index < arr.length; index++) {
    if (min > arr[index]) {
      min = arr[index];
    }
  }
  return min;
}

// 2 二分查找，每猜一个数字都会有三种结果：猜大了，猜小了，正确了，不断缩小查找范围
function binaryFind(arr, data) {
  var downIndex = 0;
  var upIndex = arr.length - 1;

  while (downIndex <= upIndex) {
    var midIndex = Math.floor((upIndex - downIndex) / 2);
    if (arr[midIndex] < data) {
      downIndex = midIndex + 1;
    } else if (arr[midIndex] > data) {
      upIndex = midIndex - 1;
    } else {
      return midIndex;
    }
  }
  return -1;
}

function binaryFind2(arr, data, addIndex = 0) {
  var midIndex = Math.floor(arr.length / 2);
  if (arr.length === 0 || (arr.length === 1 && arr[0] !== data)) {
    return -1;
  }
  if (arr[midIndex] === data) {
    return midIndex + addIndex;
  } else {
    var iteator = [arr.slice(0, midIndex), arr.slice(midIndex, arr.length)];
    var result = iteator.map((item, index) => {
      if (index === 0) {
        return binaryFind2(item, data, 0);
      } else {
        return binaryFind2(item, data, midIndex + addIndex);
      }
    });
    var index = result.findIndex(item => item !== -1);
    if (index === -1) {
        return index;
    } else {
        return result[index];
    }
  }
}

// ===> example
var arr = [23, 100, 56, 78, 32];
console.log(seqFind(arr, 56));
console.log(findMax(arr));
console.log(findMin(arr));

console.log(seqFind2(arr, 56));
console.log(seqFind2(arr, 56));
console.log(seqFind2(arr, 32));
console.log(seqFind2(arr, 32));
console.log(arr); // 32前移

var arr2 = [32, 100, 12, 45, 98, 23, 78, 56, 2, 67, 89];
console.log(binaryFind2(arr2, 2), "<-----");
