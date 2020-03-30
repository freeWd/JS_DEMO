// 字典 - 键值对形式存储
// js的object就是以字典的形式设置的

function Dicitionary() {
    this.dataSet = new Object();
    this.add = add;
    this.find = find;
    this.remove = remove;
    this.showAll = showAll;
    this.count = count;
    this.clear = clear;
}

function add(key, value) {
    this.dataSet[key] = value;
}

function find(key) {
    return this.dataSet[key]
}

function remove(key) {
    delete this.dataSet[key]
}

function showAll() {
    var keyArr = Object.keys(this.dataSet);
    for (const key of keyArr) {
        console.log(key + '--->', this.dataSet[key])
    }
}

function count() {
    return Object.keys(this.dataSet).length
}

function clear() {
    var keyArr = Object.keys(this.dataSet);
    for (const key of keyArr) {
        delete this.dataSet[key]
    }
}


// ====> example
var dir = new Dicitionary();
dir.add('张三', '18')
dir.add('李四', '22')
dir.add('王五', '19')
dir.add('赵六', '20')
console.log(dir.find('张三'))
dir.remove('李四')
dir.showAll();
dir.clear();
dir.showAll()



