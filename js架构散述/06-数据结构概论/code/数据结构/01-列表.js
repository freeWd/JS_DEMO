// 类似购物清单，待办事项 都是列表
// 元素不是很多
// 不需要很长序列查找元素或者排序
// 列表是一种最自然的数据组织方式

// 一组有序的数据
// 访问元素时不必关心底层的数据结构
// 增加和删除元素要比for更加灵活
// 迭代器访问列表里面的元素提供了统一的方法

function List() {
  // Attr
  this.dataSet = [];
  this.listSize = 0;
  this.pos = 0;

  // Method
  this.clear = clear;
  this.getElement = getElement;
  this.find = find;
  this.toString = toString;
  this.insert = insert;
  this.append = append;
  this.remove = remove;
  this.front = front;
  this.end = end;
  this.prev = prev;
  this.next = next;
  this.moveTo = moveTo;
  this.contains = contains;
}

function clear() {
  delete this.dataSet;
  this.dataSet.length = 0;
  this.listSize = this.pos = 0;
}

function getElement() {
  return this.dataSet[this.pos];
}

function find(ele) {
  for (let index = 0; index < this.dataSet.length; index++) {
      if (this.dataSet[index] === ele) {
          return index
      }
  }
  return -1;
}

function toString() {
  return this.dataSet;
}

function insert(ele, pos) {
  this.dataSet.splice(pos, 0, ele);
}

function append(ele) {
    this.dataSet[this.listSize++] = ele;
}

function remove(ele) {
    var index = this.find(ele);
    if (index === -1) {
        return false
    }
    this.dataSet.splice(index, 1)
    --this.listSize
    return true
}

function front() {
    this.pos = 0;
    return this;
}

function end() {
    this.pos = this.listSize - 1;
    return this;
}

function prev() {
    this.pos--;
    return this;
}

function next() {
    this.pos++;
    return this;
}

function moveTo(index) {
    this.pos = index
}

function contains(ele) {
    return this.dataSet.some(dataItem => dataItem === ele)
}


// ====> example
var list = new List();
list.append('张三');
list.append('李四');
list.append('王五');
for(list.front(); list.pos < list.dataSet.length; list.next()) {
    console.log(list.getElement());
}

console.log(list.toString());
