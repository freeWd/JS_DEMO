// 队列 - 也是线性表的一种表现形式，先进先出
// 从队尾进，从队首出
// 实际的使用：弹幕，打印机任务

function Queue() {
    this.dataSet = [];
    this.enqueue = enqueue; // 向队尾添加一个元素
    this.dequeue = dequeue; // 删除队首元素
    this.front = front; // 读取队首的元素
    this.back = back; // 读取队尾的元素
    this.toString = toString;
    this.isEmpty = isEmpty;
}

function enqueue(item) {
    this.dataSet.push(item)
}

function dequeue() {
    return this.dataSet.shift();
}

function front() {
    return this.dataSet[0];
}

function back() {
    return this.dataSet[this.dataSet.length - 1]
}

function toString() {
    return this.dataSet;
}

function isEmpty() {
    return !(Array.isArray(this.dataSet) && this.dataSet.length > 0)
}



// =====> Example
var queue = new Queue();
queue.enqueue('张三第一');
queue.enqueue('李四第二');
queue.enqueue('王五第三');
queue.enqueue('赵六第四');

console.log(queue.toString())
console.log(queue.front())
console.log(queue.back())
console.log(queue.dequeue())
console.log(queue.toString())
console.log(queue.isEmpty())