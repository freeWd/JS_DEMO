// 冒泡排序：是最慢的排序算法之一，数据会像气泡一样从数组的一端漂浮到另一端

function SortVo(arr) {
  this.dataArr = arr;
  this.length = arr.length;
  this.swap = swap;
  this.bubbleSort = bubbleSort;
}

function swap(index1, index2) {
  var temp = this.dataArr[index1];
  this.dataArr[index1] = this.dataArr[index2];
  this.dataArr[index2] = temp;
}

function bubbleSort() {
  for (var i = this.length; i >= 2; i--) {
    for (var j = 0; j < i - 1; j++) {
      if (this.dataArr[j] > this.dataArr[j + 1]) {
        this.swap(j, j + 1);
      }
    }
  }
}


var arr = [3,5,1,8,10,6,9];
var sortVo = new SortVo(arr);
sortVo.bubbleSort();
console.log(sortVo.dataArr);