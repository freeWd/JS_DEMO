> 盛时常做衰时想，上场当念下场时 - 曾国藩

# ES6

## var, let, const

### 变量提升&函数提升
在使用var定义变量，或者构建一个函数声明的时候，js会在预编译阶段提升定义位置，将其提升到当前作用域的最上面
```js
// 不会报错，输出undefined
console.log(a)
var a = 12

// 'hello world'
test()
function test() {
    console.log('hello world')
}

// Error: test2 is not a function
test2()
var test2 = function() {
    console.log('hello world')
}

// undefined
var a = 12;
function test() {
    console.log(a);
    var a = 13
}
test()
```

**为什么会存在提升这样的情况呢？** 

为了解决函数相互调用的问题

### 暂时性死区

ES6中的let, const定义的变量不会出现变量提升，同时会产生块级作用域。

在`代码块内`，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ

```js
// Error: Cannot access 'a' before initialization
function test() {
    console.log(a)
    let a = 20
}
test()


// 1, undefined
// let，const在全局的声明不会将变量挂载到window上，但是var会挂载
var b = 1;
let c = 2;
console.log(window.b, window.c)
```

总结：
- 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
- var 存在提升，我们能在声明之前使用。let、const 因为暂时性死区的原因，不能在声明前使用
- var 在全局作用域下声明变量会导致变量挂载在 window 上，其他两者不会
- let 和 const 作用基本一致，但是后者声明的变量不能再次赋值


## 原型继承和 Class 继承

