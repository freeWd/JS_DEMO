// 散列后的数据可以快速的插入和使用
// 在散列表中插入，删除和取用元素都非常快，但是查找效率比较底下，比如查找一组数据中的最大值和最小值
// js中的散列基于数组设计，理想情况下散列会将每一个键值映射为唯一的数组索引，数组长度有限制，更现实的策略是将建均匀分布

// 关于散列的概念
// 数组长度是预先定义的，可以随时增加，所有元素根据和该元素对应的【键】，保存数组特定的位置
// 即使使用高效的散列函数，任然存在两个键值相同的情况，这种现象称之为【碰撞】
// 数组的长度应该是一个【质数】 所有的策略都是基于碰撞的
// 【开链法】：两个键相同保存的位置一样，开辟第二数组，也称第二数组为【链】
// 【线性探测法】: 属于【开放寻址散列】，查找散列位置如果当前位置没有继续寻找下一个位置，存储数据较大较合适。
// 数组大小 >= 1.5*数据（开链法）, 数组大小 >= 2*数据（线性探测法）

// 散列表
function HashTable() {
  this.table = new Array(137); // 质数，散列函数取余结果相同的可能性更小
  this.put = put;
  this.chainPut = chainPut;
  this.probePut = probePut;
  this.get = get;
  this.chainGet = chainGet;
  this.probeGet = probeGet;
  this.showAll = showAll;
  this.simpleHash = simpleHash;
  this.buildChians = buildChians;
}

// 简单散列函数（自定义hash算法） - 除留余数法
function simpleHash(data) {
  var total = 0;
  for (let index = 0; index < data.length; index++) {
    total += data.charCodeAt(index);
  }
  return total % this.table.length;
}

function put(data) {
  var hashPos = this.simpleHash(data);
  this.table[hashPos] = data;
}

function chainPut(data) {
  var hashPos = this.simpleHash(data);
  var index = 0;
  while (this.table[hashPos][index]) {
    index++;
  }
  this.table[hashPos][index] = data;
}

function probePut(data) {
  var hashPos = this.simpleHash(data);
  while (this.table[hashPos][0]) {
    hashPos++;
  }
  this.table[hashPos][0] = data;
}

function get(data) {
  var hashPos = this.simpleHash(data);
  return hashPos;
}

function chainGet(data) {
  var hashPos = this.simpleHash(data);
  var index = 0;
  while (this.table[hashPos][index] != data) {
    index++;
  }
  return [hashPos, index];
}

function probeGet(data) {
  var hashPos = this.simpleHash(data);
  while (this.table[hashPos][0] != data) {
    hashPos++;
  }
  return hashPos;
}

function showAll() {
  for (let index = 0; index < this.table.length; index++) {
    var data = this.table[index];
    if (data && data.length > 0) {
      console.log(data, "<---- show all ---->", index);
    }
  }
}

// 开链法预备 - 将数组都变成二维数组
function buildChians() {
  for (let i = 0; i < this.table.length; i++) {
    this.table[i] = [];
  }
}

// ====> Example
// var hashTable = new HashTable();
// hashTable.put('china');
// hashTable.put('japan');
// hashTable.put('america');
// hashTable.put('nicha'); // nicha 和 china通过hash算法计算的位置是一样的，所以nicha将china覆盖
// hashTable.showAll()

// ====> Example 为了解决上面覆盖的问题，我们可以分别使用 【开链法】 | 【线性探测法】解决冲突的问题

// 开链法
// var hashTable = new HashTable();
// hashTable.buildChians();
// hashTable.chainPut('china');
// hashTable.chainPut('japan');
// hashTable.chainPut('america');
// hashTable.chainPut('nicha');
// hashTable.showAll()

// 线性探测法
var hashTable = new HashTable();
hashTable.buildChians();
hashTable.probePut("china");
hashTable.probePut("japan");
hashTable.probePut("america");
hashTable.probePut("nicha");
console.log(hashTable.probeGet("nicha"));
hashTable.showAll();
