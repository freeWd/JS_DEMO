var s = [];
var arr = s;
for (var i = 0; i < 3; i++) {
  var pusher = {
      value: "item" + i
    },
    tmp;

  if (i !== 2) {
    tmp = [];

    pusher.children = tmp;
  }
  arr.push(pusher);
  arr = tmp;
}

console.log(s[0]);

// 这题目考察的是引用数据类似堆存储和指针变化的问题
// 走第一个循环的时候，数据的存储结构如下：
// s  ------------> 地址1 --->  []
// arr -----------> 地址1
// pusher --------->地址2 ---> { value: 'item0' }
// tmp -----------> 地址3 ---> []
// pusher --------> 地址2 ---> { value: 'item0', children: --> 地址3 }
// s = arr -------> 地址1 ---> [{ value: 'item0', children: --> 地址3 }]
// arr 不再指向地址1， 而是指向地址3, 后面再push给arr值，相当于传递给s数组对象的children中去