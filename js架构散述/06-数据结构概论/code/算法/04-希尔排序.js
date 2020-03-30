// 从此往后是高级排序
// 希尔排序：首选比较较远的元素而不是相邻的元素，让元素尽快的回到正确的位置，(是直接插入排序算法的一种更高效的改进版本)
// 通过定义一个间隔序列来表示在排序过程中进行比较的元素间隔，公开的间隔序列是: 701, 301, 132, 57, 23, 10, 4, 1
// 希尔排序需要预先设置间隔序列

function SortVo() {
  this.dataSet = [10, 8, 3, 2, 5, 9, 4, 7, 35, 47, 20];
  this.length = this.dataSet.length;
  this.gaps = [5, 3, 1];
  this.shellSort = shellSort;
}

function shellSort() {
    for (var g = 0; g < this.gaps.length; g++) {
      var gapItem = this.gaps[g];
      for (var i = gapItem; i < this.length; i++) {
        var tmp = this.dataSet[i];
        for (var j = i; j >= gapItem; j -= gapItem) {
          if (this.dataSet[j-gapItem] > tmp) {
            this.dataSet[j] = this.dataSet[j-gapItem];
          } else {
            break;
          }
        }
        this.dataSet[j] = tmp;
      }
    }
}

var sortVo = new SortVo();
sortVo.shellSort();
console.log(sortVo.dataSet);