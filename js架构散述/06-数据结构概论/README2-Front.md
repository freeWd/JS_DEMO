# 前端中的数据结构和算法

> 程序 = 数据结构 + 算法

- 一个类就是在设计一个数据结构，一个接口就是在写一个自己设计的算法或者应用经典的算法
- 遇到一个【大的有序列表】来查找某一个记录的时候，可以使用二分查找的方法提高查询效率
- 程序中出现很多 for 的时候就要考虑使用算法了
- 程序数据杂乱无章的时候就有必要设置数据结构了

![img](/static/priority.png)

```js
// 看一段代码
var a = { n: 2 };
a.x = a = { n: 3 };
console.log(a.x); // undefined

// 为什么是undefined
// 第二部中js中【.】的优先级比较高，优先执行。具有相同优先级的运算符按从左至右的顺序求值
// a先在{n:2}中开辟新的属性x，存的是{n:2}当前的堆中地址，接着 a又全新被赋值为了{n:3}的堆中地址，此处是没有x属性的
// 所有 a.x 是undefined
```

```js
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

// 输出结果
// {
//     value: item0,
//     children: [
//         {
//             value: item1,
//             children: [
//                 { value: item2 }
//             ]
//         }
//     ]
// }
```

## 堆和栈


## 关于递归的思考

## 去重和查询

## 动态规划

## 前端中的数据结构和算法
