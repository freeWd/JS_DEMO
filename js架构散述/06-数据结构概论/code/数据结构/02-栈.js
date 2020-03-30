// 栈 - 是线性表结构的一种，后进先出，从栈顶进，从栈顶出（只能在一端进行操作）
// 线性表（按逻辑划分）：栈，队列，串

function Stack() {
    this.dataSet = []; //保存栈内的元素
    this.top = 0; // 标记可以插入新元素的位置 栈内 - 压入元素变量变大，弹出元素，变量变小
    this.push = push; // 入栈操作
    this.pop = pop; // 出栈操作
    this.peek = peek; // 返回栈顶元素
    this.clear = clear; // 清空栈
    this.length = length; // 栈的长度
    this.toString = toString;
}

function push(ele) {
    this.dataSet[this.top++] = ele;
}

function pop() {
    this.top--;
    this.dataSet.pop();
}

function peek() {
    return this.dataSet[this.top-1];
}

function clear() {
    this.dataSet = [];
    this.top = 0;
}

function length() {
    return this.top;
}

function toString() {
    return this.dataSet
}


// =====> Example
var stack = new Stack();
stack.push('张三第一');
stack.push('李四第二');
stack.push('王五第三');
stack.push('赵六第四');

console.log('栈的长度', stack.length());
console.log('栈顶', stack.peek())


// stack.clear()
stack.pop();
console.log(stack.toString())

