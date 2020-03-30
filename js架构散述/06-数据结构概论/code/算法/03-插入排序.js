// 插入排序 - 类似于人们按照数字或字母顺序对数据进行排序，后面的要为前面腾出位置

function SortVo(arr) {
  this.dataSet = arr;
  this.length = arr.length;
  this.insertSort = insertSort;
}

function insertSort() {
  for (let i = 1; i < this.length; i++) {
    var temp = this.dataSet[i];
    for (var j = i; j > 0; j--) {
      if (this.dataSet[j - 1] > temp) {
        this.dataSet[j] = this.dataSet[j - 1];
      } else {
        break;
      }
    }
    this.dataSet[j] = temp;
  }
}

// === example
var arr = [3, 5, 1, 8, 10, 6, 9];
var sortVo = new SortVo(arr);
sortVo.insertSort();
console.log(sortVo.dataSet);
