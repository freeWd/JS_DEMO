// 二叉树的概念和用途
// 是一种非线性的数据结构，分层存储
// 树用来被存储具有层级关系的数据，还被用来存储有序列表
// 二叉树用来查找比较快，为二叉树添加和删除元素也比较快
// 集合中不允许相同的元素存在

function Node(data) {
  this.data = data;
  this.left = null;
  this.right = null;
  this.show = true;
}

// 二叉搜索树
// 特点：每个节点的值大于其任意左侧子节点的值，小于其任意右节点的值。
function BST() {
  // attr
  this.root = null;

  // methods
  this.insert = insert;
  this.frontOrder = frontOrder;
  this.middleOrder = middleOrder;
  this.afterOrder = afterOrder;
  this.getMin = getMin;
  this.getMax = getMax;
  this.find = find;
  this.remove = remove;
}

function insert(data) {
  var node = new Node(data);
  var current = this.root;
  if (current === null) {
    this.root = node;
    return;
  }

  while (true) {
    if (data < current.data) {
      if (current.left) {
        current = current.left;
      } else {
        current.left = node;
        return;
      }
    } else {
      if (current.right) {
        current = current.right;
      } else {
        current.right = node;
        return;
      }
    }
  }
}

// 前序遍历
function frontOrder(node) {
  if (node !== null) {
    console.log(node.data);
    frontOrder(node.left);
    frontOrder(node.right);
  }
}

// 中序遍历
function middleOrder(node) {
  if (node !== null) {
    middleOrder(node.left);
    console.log(node.data);
    middleOrder(node.right);
  }
}

// 后序遍历
function afterOrder(node) {
  if (node !== null) {
    afterOrder(node.left);
    afterOrder(node.right);
    console.log(node.data);
  }
}

function getMin(node) {
  if (node) {
    if (node.left) {
      return getMin(node.left);
    } else {
      return node;
    }
  }
}

function getMax(node) {
  if (node) {
    if (node.right) {
      return getMax(node.right);
    } else {
      return node;
    }
  }
}

function find(data, node, deep = 1) {
  if (node) {
    if (node.data === data) {
      return [data, deep];
    } else if (node.data > data) {
      node = node.left;
    } else {
      node = node.right;
    }
    return find(data, node, ++deep);
  }
}

function remove(data, node) {
  if (node === null) {
      return null;
  } 
  if (data === node.data) {
      if (node.left === null && node.right === null) {
          return null;
      }
      if (node.left === null) {
          return node.right;
      }
      if (node.right === null) {
          return node.left;
      }

      // core
      var tempNode = getMin(node.right);
      node.data = tempNode.data;
      node.right = remove(tempNode.data, node.right);
      return node;
  } else if(data < node.data) {
    node.left = remove(data, node.left);
    return node;
  } else {
    node.right = remove(data, node.right);
    return node;
  }
}

// =======> example
var tree = new BST();
tree.insert(23);
tree.insert(45);
tree.insert(16);
tree.insert(37);
tree.insert(3);
tree.insert(99);
// tree.frontOrder(tree.root);
// tree.middleOrder(tree.root);
// tree.afterOrder(tree.root);
console.log(tree.getMin(tree.root), "<-----最小值");
console.log(tree.getMax(tree.root), "<-----最大值");
console.log(tree.root);
// console.log(tree.find(37, tree.root));
// console.log(tree.remove(45, tree.root));
