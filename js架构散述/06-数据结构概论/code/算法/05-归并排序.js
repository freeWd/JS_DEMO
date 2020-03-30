//归并排序 把一系列排好的子序列合并成一个大的完整的有序序列
// 将一组数据先细化成很多小数组，每个数组的长度为1，接着不断增加小数组的长度，同时排序，最后合并成完整的并排好序的大数组

function SortVo(arr) {
  this.dataSet = arr;
  this.length = this.dataSet.length;

  this.mergeSort = mergeSort;
  this.mergeArray = mergeArray;
}

function mergeSort() {
  var split = 1;
  if (this.dataSet.length <= 1) {
    return;
  }
  var left, right;
  while (split < this.dataSet.length) {
    left = 0;
    right = split;
    while (right + split <= this.dataSet.length) {
      this.mergeArray(left, left + split, right, right + split);
      left = right + split;
      right = left + split; // 因为上一步的left刚刚增加值，相当于 right + split + split
    }
    if (right < this.dataSet.length) {
        this.mergeArray(left, left+split, right, this.dataSet.length)
    }
    split *= 2;
  }
}

function mergeArray(leftStart, leftEnd, rightStart, rightEnd) {
  var leftArr = [];
  var rightArr = [];
  for (var i = leftStart; i < leftEnd; i++) {
    leftArr.push(this.dataSet[i])
  }
  leftArr.push(Infinity);

  for (var j = rightStart; j < rightEnd; j++) {
    rightArr.push(this.dataSet[j]);
  }
  rightArr.push(Infinity);

  var m = 0;
  var n = 0;
  for (var k = leftStart; k < rightEnd; k++) {
    if (leftArr[m] < rightArr[n]) {
      this.dataSet[k] = leftArr[m];
      m++;
    } else {
      this.dataSet[k] = rightArr[n];
      n++;
    }
  }
}

// =====> example
var arr = [23, 45, 19, 98, 32, 67, 12, 3, 9];
var sortVo = new SortVo(arr);
sortVo.mergeSort();
console.log(sortVo.dataSet);
