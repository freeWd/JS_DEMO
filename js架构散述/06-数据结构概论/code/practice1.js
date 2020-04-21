function bubbleSort(arr) {
  for (var i = 0; i < arr.length; i++) {
    var flag = false;
    for (var j = 0; j < arr.length - n - 1; j++) {
      if (arr[j + 1] < arr[j]) {
        var tmp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = tmp;
        flag = true;
      }
    }
    if (!flag) {
      break;
    }
  }
}

function selectSort(arr) {
  for (var i = 0; i < arr.length; i++) {
    var index = i;
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[i]) {
        index = j;
      }
    }
    var tmp = arr[i];
    arr[i] = arr[index];
    arr[index] = tmp;
  }
}

// 4 6 7 | 5
// 4 6 7 | 7
// 4 6 6 | 7
// 4 5 6 | 7
function insertSort(arr) {
  for (var i = 0; i < arr.length; i++) {
    var tmp = arr[i];
    for (var j = i - 1; j >= 0; j--) {
      if (arr[j + 1] < tmp) {
        arr[j + 1] = arr[j];
      } else {
        break;
      }
    }
    arr[j] = tmp;
  }
}

function shellSort(arr) {}

function mergeSort(arr) {
  if (arr.length < 2) {
    return arr;
  }
  var splitLength = 2;
  while (splitLength < arr.length) {
    var leftStart = 0;
    var rightStart = splitLength;
    while (rightStart <= arr.length) {
      var leftEnd = leftStart + splitLength;
      var rightEnd =
        2 * splitLength > arr.length ? arr.length : 2 * splitLength;
      var leftArr = arr.slice(leftStart, leftEnd).concat(Infinity);
      var rightArr = arr.slice(rightStart, rightEnd).concat(Infinity);
      var m = 0,
        n = 0;
      for (var i = leftStart; i < rightEnd; i++) {
        if (leftArr[m] < rightArr[n]) {
          arr[i] = leftArr[m];
          m++;
        } else {
          arr[i] = rightArr[n];
          n++;
        }
      }

      leftStart = rightStart + splitLength;
      rightStart = leftStart + splitLength;
    }
    splitLength *= 2;
  }
  return arr;
}

// 写法简单，但是空间占用比较高
function quickSort(arr) {
  if (arr.length === 0) {
    return [];
  }
  var cursor = arr[0];
  var smallArr = [];
  var bigArr = [];
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > cursor) {
      bigArr.push(arr[i]);
    } else {
      smallArr.push(arr[i]);
    }
  }
  return quickSort(smallArr).concat(cursor, quickSort(bigArr));
}

// 上面那种的另一种递归写法，相对空间复杂度减小
function quickSort2(arr, p, q) {
  var index = p + 1;
  var cursor = arr[p];
  if (q - p > 1) {
    for (var i = p + 1; i < q; i++) {
      if (arr[i] < cursor) {
        swap(arr, index, i);
        index++;
      }
    }
    swap(arr, p, index - 1);
    quickSort2(arr, p, index);
    quickSort2(arr, index, q);
  }
  return arr;
}

// 快速排序的非递归写法，用数组存储每次比较后的索引值，推荐这种写法
// 另外可以每次去中间值作为比较值，能进一步降低时间复杂度变成 O(n^2)的概率
function quickSort3(arr) {
  // 3 2 1
  if (arr.length === 0) return [];
  if (arr.length === 1) return arr;

  const indexArr = [0, arr.length];

  while (indexArr.length > 0) {
    const q = indexArr.pop();
    const p = indexArr.pop();
    const cursor = arr[p];
    let index = p;

    if (q - p > 1) {
      for (let i = p; i < q; i++) {
        if (arr[i] < cursor) {
          swap(arr, i, index + 1);
          index++;
        }
      }
      swap(arr, p, index);
      indexArr.push(p);
      indexArr.push(index + 1);
      indexArr.push(index + 1);
      indexArr.push(q);
    }
  }
  return arr;
}

function swap(arr, i, j) {
  var tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

// console.log(quickSort2([3, 2, 1], 0, 3));
// console.log(quickSort2([5, 11, 3, 9, 8, 6], 0, 6));
// console.log(quickSort([5, 11, 3, 9, 8, 6]));
// console.log(mergeSort([5, 11, 3, 9, 8, 6]));

console.log(quickSort3([5, 11, 3, 9, 8, 6]));

// 二分查找 - 递归
function splitFind(arr, value, start, end) {
  if (arr.length === 0) return -1;
  if (arr.length === 1) return arr[0] === value ? 0 : -1;
  const midIndex = Math.floor((start + end) / 2);
  if (arr[midIndex] === value) {
    return midIndex;
  } else if (arr[midIndex] > value) {
    return splitFind(arr, value, start, midIndex + 1);
  } else {
    return splitFind(arr, value, midIndex, end);
  }
}

// 二分查找 - 非递归
function splitFind2(arr, value) {
  if (arr.length === 0) return -1;
  if (arr.length === 1) return arr[0] === value ? 0 : -1;
  var minIndex = 0;
  var maxIndex = arr.length;
  while (minIndex < maxIndex) {
    var midIndex = Math.floor((minIndex + maxIndex) / 2);
    if (arr[midIndex] === value) {
      return midIndex;
    } else if (arr[midIndex] > value) {
      maxIndex = midIndex + 1;
    } else {
      minIndex = midIndex;
    }
  }
  return -1;
}

// var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// console.log(splitFind2(arr, 6, 0, 9));
