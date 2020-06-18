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
    - 函数传参是传递对象指针的副本 (即入参person和p1栈中是两个不同的区域，但是都存了相同的引用地址)
    - person被赋值一个新的对象后，就和p1断开联系

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

对于**值类型**的数据来说，除了**null**，typeof都可以正确的判断

```js
typeof 123 // "number"
typeof "abc" // "string"
typeof false // "boolean"
typeof undefined // undefined
typeof Symbol() // "symbol"

typeof null // "object" <--- error
```

对于**引用类型**数据来说，除了**function**都会显示为object
```js
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```

综上：typeof可以判断值类型的数据（当然还要注意null这个点） 但并不能准确判断引用类型变量

---
### instance of

instance of是通过`原型链`来判断数据类型的，适合用来判断一个引用类型的数据

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
    return typeof x === 'string'
  }
}
console.log('hello world' instanceof PrimitiveString) // true
```

综上：instanceof 可以判断引用类型的数据，但作用域链的存在（以大包小， Object就是大哥），且值类型的也不好搞

---
### Object.prototype.toString
它可以算一个判断类型的银弹了吧，但平时用的缺失不多，通过 typeof, instanceof 配合 === 基本上能解决我平时开发中的问题了，它在一些库或者工具包中会用的稍微多些

```js
// 值类型
Object.prototype.toString.call('123') // "[object String]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(Symbol(123)) // "[object Symbol]"

// 引用类型
Object.prototype.toString.call([]) // "[object Array]"
Object.prototype.toString.call({}) // "[object Object]"
Object.prototype.toString.call(console.log) //"[object Function]"
```

## 类型转换
JS 中类型转换只有三种情况

- 转换为布尔值
- 转换为数字
- 转换为字符串

![image](./images/type-convert.webp)


- 转Boolean

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
Boolean('') // false
Boolean({}) // true
Boolean(null) // false
// 转Number
Number('123abc') // NaN -- 注意和 parseInt的区别
Number({}) // NaN
Number([3]) // 3
Number(null) // 0
Number(undefined) // NaN
// 转String
String(null) // 'null'
String(undefined) // 'undefined'
String({}) // "[object Object]"
String(['a', 1]) // "a,1"


// ====> 自动转换
// 第一种情况，不同类型的数据互相运算
123 + 'abc' // "123abc"
1 + '1' // '11'
true + true // 2
4 + [1,2,3] // "41,2,3"

// 第二种情况，对非布尔值类型的数据求布尔值
if ('abc') {
  console.log('hello')
}  

// 第三种情况，对非数值类型的值使用一元运算符(即 +, -)
+ {foo: 'bar'} // NaN
- [1, 2, 3] // NaN
+true // 1
-false // 0
'a'+ +'b' // 'aNaN'
```

自动转换的规则是这样的：预期什么类型的值，就调用该类型的转换函数。比如，某个位置预期为字符串，就调用String函数进行转换。如果该位置即可以是字符串，也可能是数值，那么默认转为数值, 如果是字符串和数字操作，则数字转化为字符串

**由于自动转换具有不确定性，而且不易除错，建议在预期为布尔值、数值、字符串的地方，全部使用Boolean、Number和String函数进行显式转换。**

## == 与 ===
这是js中的一个不小的坑

他们的区别
- == 是`相对等`判断，如果双方的类型不一样就会先进行类型转换再进行判断，但是这个类型转换有自己的一套判断标准，而是不完全按照上面提高的转换来进行的

- === 来说就简单多了 `真相等`，就是判断两者类型和值是否相同, 它的判断更严谨，如果 a === b为true, 那么 a == b也一样为true

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

  如果第一个运算子的布尔值为true，则返回第二个运算子的值（注意是值，不是布尔值）；如果第一个运算子的布尔值为false，则直接返回第一个运算子的值，且不再对第二个运算子求值
  ```js
  't' && '' // ""
  't' && 'f' // "f"
  't' && (1 + 2) // 3
  '' && 'f' // ""
  '' && '' // ""
  ```

- 或运算符（||）
  ```js
  't' || '' // "t"
  't' || 'f' // "t"
  '' || 'f' // "f"
  '' || '' // ""
  ```

