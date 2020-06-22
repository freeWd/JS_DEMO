> 道德三皇五帝，功名夏后商周。英雄五伯闹春秋，秦汉兴亡过手。青史几行名姓，北邙无数荒丘。前人田地后人收，说甚龙争虎斗 - 《二十一史弹词》 杨慎

【前端中永远滴神】

# Javascript 小结（1）

了解到的一点小历史

- javascript 和 java 的关系？没什么关系，就是雷锋和雷峰塔的关系，但是取名字的时候的确有借 java 之风的考量
- 据说最早的 javascript 是被 7 天就创造了出来，所有给后面留下了不少坑

## js 的值类型

ES6 中的原始类型：**boolean, null, undefined, number, string, symbol(ES6 之前没有)**

这些原始的类型存储的都是值，是没有函数可以调用的。比如 `null.toString()`是会报错的 `Cannot read property 'toString' of null`

`'1'.toString()` 为什么可以呢？ 因为此时 '1'已经不是原始类型了，而是**强制被转化**为了`String`类型（对象类型）

原始类型中的一些坑

- number 是浮点型的数据，使用中会有 bug，比如 `0.1 + 0.2 !== 0.3`
- null 并不是一个对象类型，虽然 `typeof null === 'object'` 但是这是一个 js 的 bug

  在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来

## js 引用类型

js 中除了值类型剩下的都是引用类型，或者说是`对象类型`

值类型存储值在栈中，引用类型存储在栈中的是地址（指针），指针指向实际的内容存储的位置（堆中）

对于引用类型需要注意的点：

- 变量的赋值，不是真的赋`值`，而是赋`地址`
- 函数传参

  - 函数传参是传递对象指针的副本 (即入参 person 和 p1 栈中是两个不同的区域，但是都存了相同的引用地址)
  - person 被赋值一个新的对象后，就和 p1 断开联系

  ```js
  const p1 = {
    name: "yck",
    age: 25,
  };

  function test(person) {
    person.age = 26;
    person = {
      name: "yyy",
      age: 30,
    };
    return person;
  }

  const p2 = test(p1);
  console.log(p1);
  console.log(p2);

  // p1 --> { name: 'yck', age: 26 }
  // p2 --> { name: 'yyy', age: 30 }
  ```

为什么要分值类型和引用类型？ 节约存储空间，提高性能

## 数据类型的判断

`typeof , instanceof , Object.prototype.toString.call()`

### typeof

对于**值类型**的数据来说，除了**null**，typeof 都可以正确的判断

```js
typeof 123; // "number"
typeof "abc"; // "string"
typeof false; // "boolean"
typeof undefined; // undefined
typeof Symbol(); // "symbol"

typeof null; // "object" <--- error
```

对于**引用类型**数据来说，除了**function**都会显示为 object

```js
typeof []; // 'object'
typeof {}; // 'object'
typeof console.log; // 'function'
```

综上：typeof 可以判断值类型的数据（当然还要注意 null 这个点） 但并不能准确判断引用类型变量

---

### instance of

instance of 是通过`原型链`来判断数据类型的，适合用来判断一个引用类型的数据

```js
[] instanceof Array // true
console.log instanceof Function // true

// 当然下面的也成立, 原因还是因为原型链的原理
[] instanceof Object // true
console.log instanceof Object // true
```

正常情况下 instanceof 是无法判断值类型的数据的，但可以操作操作

```js
class PrimitiveString {
  static [Symbol.hasInstance](x) {
    return typeof x === "string";
  }
}
console.log("hello world" instanceof PrimitiveString); // true
```

综上：instanceof 可以判断引用类型的数据，但作用域链的存在（以大包小， Object 就是大哥），且值类型的也不好搞

---

### Object.prototype.toString

它可以算一个判断类型的银弹了吧，但平时用的缺失不多，通过 typeof, instanceof 配合 === 基本上能解决我平时开发中的问题了，它在一些库或者工具包中会用的稍微多些

```js
// 值类型
Object.prototype.toString.call("123"); // "[object String]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(Symbol(123)); // "[object Symbol]"

// 引用类型
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call({}); // "[object Object]"
Object.prototype.toString.call(console.log); //"[object Function]"
```

## 类型转换

JS 中类型转换只有三种情况

- 转换为布尔值
- 转换为数字
- 转换为字符串

![image](./images/type-convert.webp)

- 转 Boolean

  在`条件判断`时, 除了+0， -0， NaN, undefined, null, '' 其他所有的值都为`true`, 包括所有对象

- 对象转原始类型

  对象在转换类型的时候，会调用内置的 [[ToPrimitive]] 函数，对于该函数来说，算法逻辑一般来说如下：

  - 如果已经是原始类型了，那就不需要转换了
  - 调用 x.valueOf()，如果转换为基础类型，就返回转换的值
  - 调用 x.toString()，如果转换为基础类型，就返回转换的值
  - 如果都没有返回原始类型，就会报错

说了类型的转化，到底是怎么转化的呢？

```js
// ====> 强制转化
// 转Boolean
Boolean(""); // false
Boolean({}); // true
Boolean(null); // false
// 转Number
Number("123abc"); // NaN -- 注意和 parseInt的区别
Number({}); // NaN
Number([3]); // 3
Number(null); // 0
Number(undefined); // NaN
// 转String
String(null); // 'null'
String(undefined); // 'undefined'
String({}); // "[object Object]"
String(["a", 1]); // "a,1"

// ====> 自动转换
// 第一种情况，不同类型的数据互相运算
123 + "abc"; // "123abc"
1 + "1"; // '11'
true + true; // 2
4 + [1, 2, 3]; // "41,2,3"

// 第二种情况，对非布尔值类型的数据求布尔值
if ("abc") {
  console.log("hello");
}

// 第三种情况，对非数值类型的值使用一元运算符(即 +, -)
+{ foo: "bar" } - // NaN
[1, 2, 3] + // NaN
true - // 1
  false; // 0
"a" + +"b"; // 'aNaN'
```

自动转换的规则是这样的：预期什么类型的值，就调用该类型的转换函数。比如，某个位置预期为字符串，就调用 String 函数进行转换。如果该位置即可以是字符串，也可能是数值，那么默认转为数值, 如果是字符串和数字操作，则数字转化为字符串

**由于自动转换具有不确定性，而且不易除错，建议在预期为布尔值、数值、字符串的地方，全部使用 Boolean、Number 和 String 函数进行显式转换。**

## == 与 ===

这是 js 中的一个不小的坑

他们的区别

- == 是`相对等`判断，如果双方的类型不一样就会先进行类型转换再进行判断，但是这个类型转换有自己的一套判断标准，而是不完全按照上面提高的转换来进行的

- === 来说就简单多了 `真相等`，就是判断两者类型和值是否相同, 它的判断更严谨，如果 a === b 为 true, 那么 a == b 也一样为 true

![image](./images/equal.webp)

还有一个特别的点：`NaN == 任何值都是 false，包括自己，NaN == NaN ==》 false`

再来几个例子配合上面的流程图来看看

```js
null == undefined // true
null == 0 //false, 虽然Number(null)的确是0，但是按照上面的流程图，这里结果是 false
[] == 0 // true, []属于object类型
[] == [] // false ? 类型相同，但是地址不一样
[] == ![] // true

var a = []
var b = a
a == b // 类型一样，地址一样 true
```

## 逻辑运算符

- 取反运算符（!）：一个感叹号，用于将布尔值变为相反值

  - 对于非布尔值，取反运算符会将其转为布尔值

- 且运算符（&&）

  如果第一个运算子的布尔值为 true，则返回第二个运算子的值（注意是值，不是布尔值）；如果第一个运算子的布尔值为 false，则直接返回第一个运算子的值，且不再对第二个运算子求值

  ```js
  "t" && ""; // ""
  "t" && "f"; // "f"
  "t" && 1 + 2; // 3
  "" && "f"; // ""
  "" && ""; // ""
  ```

- 或运算符（||）
  ```js
  "t" || ""; // "t"
  "t" || "f"; // "t"
  "" || "f"; // "f"
  "" || ""; // ""
  ```

## 正则表达式 - 一生之敌

无论看多少次，下次还是要边查边写...

### 正则表达式构建

```js
// 字面量构建
var regex = /xyz/;

// 构造函数构建, 第二个参数是修饰符, 修饰符：i, g, m
var regex2 = new Regex("xyz", "i") === /xyz/i;
```

### 正则表达式的匹配规则

关于正则的匹配除了了解它对应的规则之外还有若干一定要理清楚的原则（默认情况下，不使用修饰符和额外匹配规则的时候）：

- 正则表达式的本质是匹配与书写的匹配规则相对应字符
- 正则表达默认是贪婪模式的，即会默认匹配尽可能长的字符串
- 在用正则严重字符串匹配的正确性时（test）,只要有一段字符串符合规则就是 true，所有都不符合规则才是 false

#### 元字符

| 元字符 | 描述                                                        |
| ------ | ----------------------------------------------------------- |
| .      | 匹配除了换行符的任意单个字符                                |
| [ ]    | 匹配方括号内的任意字符                                      |
| [^ ]   | 匹配除了方括号里的任意字符                                  |
| `*`    | 匹配>=0 个重复的在\*号之前一位的字符                        |
| +      | 匹配>=1 个重复的+号前一位的字符                             |
| ?      | 标记?之前一位字符为可选                                     |
| {n,m}  | 匹配 num 个大括号之前的字符 (n <= num <= m)                 |
| (xyz)  | 字符集, 匹配与 xyz 完全相等的字符串                         |
| `|`    | 或运算符,匹配符号前或后的字符                               |
| \      | 转义字符,用于匹配一些保留的字符 `[ ]() { } . * + ? ^ $ \ |` |
| ^      | 从开始行开始匹配                                            |
| \$     | 从末端开始匹配                                              |

```js
/./.test('a') // true
/./.test('a1') // a就符合匹配了，true

/[cat]/.test('bcd') // true 方括号内的任意字符匹配上即可 c -> bcd
/[Tt]he/.test('The abc  the') // true

/[^cat]/.test('t') // t是方括号内的字符，方括号^取反，结果是false
/[^cat]/.test('cat1') // cat1中的cat都不符合规则，但是1符合，结果是 true

/ab*c/.test('ac') // true, *是>=0,所以b没有也可以
/ab*c/.test('bbc') // false *前前位不受其影响
/ab+c/.test('abbc') // true
/ab?c/.test('abbbc') // false ?表示0次或1次，但不能是多次
/a{0,}/.test('aaa') // true {}手动设置重复次数

// ()内的内容构成了一个组，也就是一个整体，注意与 []的区别，[]中的内容天然取或
/(T|t)he/.test('the') // true
/(T|t)he|cat/.test('cat') // true 匹配 the, The, cat都可以
```

#### 锚点(写在正则内)

- ^号 ^ 用来检查匹配的字符串是否在所匹配字符串的开头.
- $号  $ 号用来匹配字符是否是最后一个

```js
/the/.test('123the456') // true
/^the$/.test('123the456') // false
/^the$/.test('the') // true
```

#### 简写字符集

| .   | 除换行符外的所有字符                            |
| --- | ----------------------------------------------- |
| \w  | 匹配所有字母数字下划线, 等同于 [a-zA-Z0-9_]     |
| \W  | 匹配所有非字母数字, 即符号, 等同于: [^\w]       |
| \d  | 匹配数字: [0-9]                                 |
| \D  | 匹配非数字: [^\d]                               |
| \s  | 匹配所有空格字符, 等同于: [\t\n\f\r\p{Z}]       |
| \S  | 匹配所有非空格字符: [^\s]                       |
| \f  | 匹配一个换页符                                  |
| \n  | 匹配一个换行符                                  |
| \r  | 匹配一个回车符                                  |
| \t  | 匹配一个制表符                                  |
| \v  | 匹配一个垂直制表符                              |
| \p  | 匹配 CR/LF (等同于 \r\n)，用来匹配 DOS 行终止符 |

#### 标志 写在正则标签//外面

| 标志 | 描述                                         |
| ---- | -------------------------------------------- |
| i    | 忽略大小写                                   |
| g    | 全局搜索                                     |
| m    | 多行的: 锚点元字符 ^ \$ 工作范围在每行的起始 |

```js
// 忽略大小写
/The/.test('the') // false
/The/i.test('the') // true

// 全局搜索
'the abc the'.match(/the/) // [ 'the', index: 0, input: 'the abc the', groups: undefined ]
'the abc the'.match(/the/g) // [ 'the', 'the' ]

// 多行
`The fat
cat sat
on the mat.`.match(/at/g) // [ 'at', index: 5, input: 'The fat\ncat sat\non the mat.', groups: undefined ]

`The fat
cat sat
on the mat.`.match(/at/gm) // [ 'at', 'at', 'at', 'at' ]

```

#### 贪婪匹配与惰性匹配 
```js
// 正则默认是贪婪匹配，下面ast和 ast1111st 都符合规则，但是结果是：
'ast1111st'.match(/.*st/) // [ 'ast1111st', index: 0, input: 'ast1111st', groups: undefined ]

// 惰性匹配
'ast1111st'.match(/.*?at/) // [ 'ast', index: 0, input: 'ast1111st', groups: undefined ]
```


### 常见的使用方法和场景
- RegExp.prototype.test() 正则实例对象的test方法返回一个布尔值，表示当前模式是否能匹配参数字符串
- RegExp.prototype.exec() 正则实例对象的exec方法，用来返回匹配结果。如果发现匹配(第一个结果)，就返回一个数组，成员是匹配成功的子字符串，否则返回null
- String.prototype.match() 返回一个数组，成员是`所有匹配的子字符串`, 注意和exec的区别
- String.prototype.search() 按照给定的正则表达式进行搜索，返回一个整数，表示匹配开始的位置
- String.prototype.replace() 按照给定的正则表达式进行替换，返回替换后的字符串
- String.prototype.split() 按照给定规则进行字符串分割，返回一个数组，包含分割后的各个成员

```js
/abc/.test('abc') // true

// 如果正则表达式带有g修饰符，则每一次test方法都从上一次结束的位置开始向后匹配
var r = /x/g;
var s = '_x_x';

r.lastIndex // 0
r.test(s) // true

r.lastIndex // 2
r.test(s) // true

r.lastIndex // 4
r.test(s) // false
```

```js
/\w/.exec('abc') // [ 'a', index: 0, input: 'abc', groups: undefined ]

// 如果正则表示式包含圆括号（即含有“组匹配”），则返回的数组会包括多个成员。第一个成员是整个匹配成功的结果，后面的成员就是圆括号对应的匹配成功的组。也就是说，第二个成员对应第一个括号，第三个成员对应第二个括号，以此类推
'_x_x'.exec(/_(x)/) // ["_x", "x"]

// 如果正则表达式加上g修饰符，则可以使用多次exec方法
var reg = /a/g;
var str = 'abc_abc_abc'
var r1 = reg.exec(str);
r1 // ["a"]
r1.index // 0
reg.lastIndex // 1

var r2 = reg.exec(str);
r2 // ["a"]
r2.index // 4
reg.lastIndex // 5

var r3 = reg.exec(str);
r3 // ["a"]
r3.index // 8
reg.lastIndex // 9

var r4 = reg.exec(str);
r4 // null
reg.lastIndex // 0
```

```js
// string match

var s = '_x_x';
var r1 = /x/;
var r2 = /y/;
var r3 = /x/g

s.match(r1) // [ 'x', index: 1, input: '_x_x', groups: undefined ]
s.match(r2) // null
s.match(r3) // ['x', 'x']


// string search
'_x_x'.search(/x/) // 1, 如果没有匹配 返回 -1


// String replace
// 正则表达式如果不加g修饰符，就替换第一个匹配成功的值，否则替换所有匹配成功的值
'aaa'.replace('a', 'b') // "baa"
'aaa'.replace(/a/, 'b') // "baa"
'aaa'.replace(/a/g, 'b') // "bbb"

// replace方法的一个应用，就是消除字符串首尾两端的空格
var str = '  #id div.class  ';
str.replace(/^\s+|\s+$/g, '')

// replace的第一个参数也可以是可字符串，就相当于匹配并替换第一个字符串
'aabbcc'.replace('b', 'd') // 'aadbcc'

// replace方法的第二个参数可以使用美元符号，用来指代所替换的内容，这种用法太抽象了，我用不来
```

```js
// string split  ====> str.split(separator, [limit])
// 该方法接受两个参数，第一个参数是正则表达式(或者字符串)，表示分隔规则，第二个参数是返回数组的最大成员数

// 非正则分隔
'a,  b,c, d'.split(',')  // [ 'a', '  b', 'c', ' d' ]

// 正则分隔，去除多余的空格
'a,  b,c, d'.split(/, */)

// 指定返回数组的最大成员
'a,  b,c, d'.split(/, */, 2)
[ 'a', 'b' ]
```
