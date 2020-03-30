// 选择排序 从数组的头部开始，将第一个元素和其他元素比较，最小的元素会被放置到数组的第一个位置，再从第二个位置继续

function SortVo(arr) {
  this.dataArr = arr;
  this.length = arr.length;
  this.swap = swap;
  this.selectSort = selectSort;
}

function swap(index1, index2) {
  var temp = this.dataArr[index1];
  this.dataArr[index1] = this.dataArr[index2];
  this.dataArr[index2] = temp;
}

function selectSort() {
  var minIndex;
  for (let i = 0; i < this.length; i++) {
    minIndex = i;
    for (let j = i + 1; j < this.length; j++) {
      if (this.dataArr[minIndex] > this.dataArr[j]) {
        minIndex = j;
      }
    }
    this.swap(minIndex, i);
  }
}

// === example
var arr = [3, 5, 1, 8, 10, 6, 9];
var sortVo = new SortVo(arr);
sortVo.selectSort();
console.log(sortVo.dataArr);
