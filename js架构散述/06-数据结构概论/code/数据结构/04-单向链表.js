// 数组不是数据组织的最佳结构，方便查找，但是不方便插入，删除中间的某个值
// javascript数组以对象的形式被实现，与其他语言相比，效率低了不少
// 可以考虑用【链表】代替数组，除了对数据的随机访问，链表几乎可以用在任何一维数组的地方


// 链表是由一系列节点组成的集合，每个节点都使用一个对象的引用指向它的后继，指向另一个节点的引用是链
// 单向链表: 
// -------- 插入一个节点，需要修改它前面的节点（前驱）使其指向新加入的节点，而新加入的节点指向原来前驱指向的节点
// -------- 删除一个节点，需要将待删除的元素的前驱节点指向待删除元素的后继节点，同时将删除的元素指向null

// 双向链表：双向链表每个节点既有指向前驱的引用，也有指向后驱的引用


function Node(ele) {
    this.element = ele;
    this.next = null;
}

function LinkedList() {
    this.header = new Node('head');
    this.find = find;
    this.findPrevious = findPrevious;
    this.insert = insert;
    this.delete = remove;
    this.display = display;
}

function find(item) {
    var currentNode = this.header;
    while(currentNode.element != item) {
        currentNode = currentNode.next;
        if (currentNode === null) {
            break;
        }
    }
    return currentNode;
}

function findPrevious(item) { // 寻找item的前驱
    var currentNode = this.header;
    var previousNode = null;
    while(currentNode.element != item) {
        previousNode = currentNode;
        currentNode = currentNode.next;
    }
    return previousNode;
}

function insert(newElement, item) { // 新值，要插入后的位置的值
    var insertNode = this.find(item);
    if (insertNode === null) {
        return false;
    }
    var newNode = new Node(newElement);
    newNode.next = insertNode.next;
    insertNode.next = newNode // newNode插入到insertNode后面
}

function remove(item) {
    var delBeforeNode = this.findPrevious(item)
    var currentNode = this.find(item)
    if(delBeforeNode === null) { //说明要删除的item是链表的首位元素
        this.header = currentNode.next
        currentNode.next = null
    } else {
        delBeforeNode.next = currentNode.next
        currentNode.next = null
    }
}

function display() {
    var currentNode = this.header;
    while (currentNode.next != null) {
        console.log(currentNode.element, '<----xxx');
        currentNode = currentNode.next;
    }
    console.log(currentNode.element, '<----xxx');
}


// =======> Example
var linkList = new LinkedList();
linkList.insert('first', 'head');
linkList.insert('second', 'first');
linkList.insert('third', 'second')
linkList.delete('second')
linkList.display();

