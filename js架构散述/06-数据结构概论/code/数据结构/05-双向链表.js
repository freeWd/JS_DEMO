function Node(ele) {
    this.element = ele;
    this.pre = null;
    this.next = null;
}

function TwoWayLinkList() {
    this.header = new Node('head');
    this.find = find;
    this.insert = insert;
    this.delete = remove;
    this.display = display;
}

function find(item) {
    var currentNode = this.header;
    while (currentNode.element != item) {
        currentNode = currentNode.next
        if (currentNode === null) {
            break;
        }
    }
    return currentNode
}

function insert(newElement, item) {
    var insertNode = this.find(item)
    var newNode = new Node(newElement);
    if (insertNode !== null) {
        var nextNode = insertNode.next;
        insertNode.next = newNode;
        newNode.pre = insertNode
        newNode.next = nextNode
    }
}

function remove(item) {
    var currentNode = this.find(item);
    if (currentNode !== null) {
        currentNode.pre.next = currentNode.next;
        currentNode.next.pre = currentNode.pre;
    }
}

function display() {
    var currentNode = this.header;
    // console.log(currentNode.next)
    while (currentNode.element != null) {
        console.log(currentNode.element, '<---xxx')
        currentNode = currentNode.next
        if (currentNode === null) {
            break;
        }
    }
}



// ======> example 
var linkList = new TwoWayLinkList();
linkList.insert('first', 'head');
linkList.insert('second', 'first');
linkList.insert('third', 'second')
linkList.delete('second')
linkList.display();