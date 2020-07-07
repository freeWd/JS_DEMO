常说的浏览器上跑的JS包含两大部分：
* JS基础知识：ECMA 262标准 （基本语法）
* JS-WBE-API: W3C 标准（怎么用，实际工作）

W3C标准中关于JS的规定：
* DOM操作
* BOM操作
* 事件绑定
* ajax请求（包括http协议）
* 存储

exapmle: （1）页面弹框是window.alert(123), 浏览器需要做：
* 定义一个window全局变量，对象类型
* 给它定一个alert属性，属性值是一个函数

（2） 获取元素document.getElementById(id), 浏览器需要做：
* 定义一个document全局变量，对象类型
* 给它定一个getElementById的属性，属性值是一个函数

==但是W3C标准没有规定任何JS基础相关的知识，它不管什么变量类型，原型，作用域和异步，只管定义用于浏览器中JS操作页面的API==

全面考虑，JS内置的全局函数和对象有哪些？



## DOM操作
题目：
1. DOM是哪种基本的数据结构: 树
2. DOM操作的常用API有哪些
3. DOM节点的attr和property有何区别

#### DOM的本质
DOM可以理解为 浏览器把拿到的html代码结构化为一个浏览器可以识别并且js可以操作的一个模型

#### DOM节点操作
**获取DOM节点**
```
var div1 = document.getElementById('div1');
var divList = document.getElementsByTagName('div');
console.log(divList.length);
console.log(divList[0]);

var containerList = document.getElementsByClassName('.container');
var pList = document.querySelectorAll('p');
var p = pList[0];
console.log(p.style.width); // 获取样式
p.style.width = '100px'; // 修改样式
console.log(p.className); // 获取class
p.className = 'p1'; // 修改 class

// 获取 nodeName 和 nodeType
console.log(p.nodeName);  // p
console.log(p.nodeType);
```

**prototype**

==其中p其实就是一个对象，nodeName就是对象的一个属性，这里的属性表示的是获取js对象的属性，注意与后面的Attribute的区分==
```
var p = document.getElementsByTagName('p')[0];
console.log(p.nodeName);
```

**Attribute**
![image](https://note.youdao.com/yws/public/resource/581d06e3505c431aa8077fc46e8aacfb/xmlnote/447422F77AFE4951A558477A4851ED9E/7302)
==注意: Attribute获取的是html文本标签中的一些属性，注意和prototype的区别==
```
var pList = document.querySelectorAll('p');
var p = pList[0];
p.getAttribute('data-name');
p.setAttribute('style');
p.getAttribute('style');
p.setAttribute('style', 'font-size:30px;');
```

#### DOM的结构操作
* 新增节点
* 获取父元素
* 获取子元素
* 删除节点


**新增节点**
```
var div1 = document.getElementById('div1');
// 添加新节点
var p1 = document.createElement('p');
p1.innerHtml = 'this is p1';
div1.appendChild(p1); // 添加新创建的元素
// 移动已有的节点
var p2 = document.getElementById('p2');
div.appendChild(p1);
```

**获取父元素和子元素**
```
var div1 = document.getElementById('div1');
var parent = div1.parentElement;
var child = div1.childNodes;
```

**删除节点**
```
var div1 = document.getElementById('div1');
var child = div1.childNodes;
div1.removeChild(child[0]);
```


### BOM (浏览器对象模型)
题目：
* 如何检测浏览器类型
* 拆解URL各部分


* navigator
* screen
* location
* history

```
// navigator & screen
var ua = navigator.userAgent;
var isChrome = ua.indexOf('Chrome');

console.log(screen.width, screen.height);

// location
console.log(location.href); // 整个url
console.log(location.protocal);
console.log(location.pathname);
console.log(location.search);
console.log(location.hash);

// history
history.back();
history.forward();
```

