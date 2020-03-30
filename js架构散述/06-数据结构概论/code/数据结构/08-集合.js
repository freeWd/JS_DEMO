// 集合：包含不同元素的数据结构
// 在很多编程语言中并不把集合当成一种数据类型，当你想要创建一个数据结构用来保存一段独一无二的的文字的时候集合就非常有用

// 集合的成员是无序的
// 集合中不允许相同的成员存在

function Set() {
  this.dataSet = [];
  this.add = add;
  this.remove = remove;
  this.show = show;
  this.union = union;
  this.intersect = intersect;
  this.different = different;
}

function add(data) {
  if (this.dataSet.includes(data)) {
    return false;
  }
  this.dataSet.push(data);
}

function remove(data) {
  var pos = this.dataSet.indexOf(data);
  this.dataSet.splice(pos, 1);
}

function show() {
  return this.dataSet;
}

// 并集
function union(set) {
  var unionArr = [];
  for (var setItem of [this.dataSet, set]) {
    for (var item of setItem) {
      if (!unionArr.includes(item)) {
        unionArr.push(item);
      }
    }
  }
  return unionArr;
}

// 交集
function intersect(set) {
  var intersectArr = [];
  for (var dataItem of this.dataSet) {
    if (set.includes(dataItem)) {
      intersectArr.push(dataItem);
    }
  }
  return intersectArr;
}

// 补集（属于第一个，不属于第二个集合的元素）
function different(set) {
  var differentArr = [];
  for (var dataItem of this.dataSet) {
    if (!set.includes(dataItem)) {
      differentArr.push(dataItem);
    }
  }
  return differentArr;
}



// ==== example 
var set = new Set();
set.add('1');
set.add('2');
set.add('3');
set.add('4');

console.log(set.show());
console.log(set.union(['1','5']));
console.log(set.intersect(['1','5']));
console.log(set.different(['1','5']));