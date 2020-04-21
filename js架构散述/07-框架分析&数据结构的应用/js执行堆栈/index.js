// ==============> 
function a1() {
    function a() {};
    var a;
    var b = 23;
    console.log(a, b)
    a2(a);
}

function a2(arg1) {
    console.log(arg1);
    a3();
}

function a3() {
    debugger;
    console.log('123');
}

a1();

// ECStack - Execute Context Stack - 上下文执行栈
// ECStack - 栈结构，先进后出
// 全局执行会产生一个包裹在最外层的全局匿名执行函数，内部包含 全局上下文（globalContext）
//==> 从表面上看：js 在执⾏可执⾏的脚本时，⾸先会创建⼀个全局可执⾏上下⽂globalContext，每当执⾏到⼀个函数调⽤时都会创建⼀个可执⾏上下⽂（execution context）EC。当然可执⾏程序可能会存在很多函数调⽤，那么就会创建很多EC，所以 JavaScript 引擎创建了执⾏上下⽂栈（Execution context stack，ECS）
// 所以globalContext会一直存在底部
ECStack = [
    VO(a3),
    VO(a2),
    VO(a1) = AO,
    VO(GO) = globalContext // GO - global Object
]

// VO - （Variable Object）变量对象 - 变量对象VO是与执⾏上下⽂相关的特殊对象,⽤来存储上下⽂的函数声明，函数形参和变量

// AO - （Activation Object）活动对象 - 在函数上下⽂中，VO被表示为活动对象AO,当函数被调⽤后，这个特殊的活动对象就被创建了。它包含普通参数与特殊参数对象
// VO管理外部。AO管理内部(存储内部的作用域链)
// AO执行分两步 ： 1 定义期 2 执行期
// 定义期 - 变量提升就在此时发生

AO(a1) = [
    this, // this永远指向ECStack的栈顶【内在原因】，表面现象来看来是“谁调用指向谁”
    a =  'pointer to function a()', // 变量提升 
    b = undefined,
    ScopeChain = Scope, // 作用域链
    Scope = {
        AO,
        VO(GO)
    }
]

// 一旦定义期结束，就进入执行阶段，那么就会完成赋值等操作
// <============== 