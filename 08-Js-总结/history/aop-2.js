// aop 叫做面向切面编程，旨在降低程序之间的耦合行，属于设计模式中的装饰者模式，今天就来看看它的实现和主要用途。
// aop的几个基本概念：
//  连接点: 可以被其他逻辑包围的代码部分，一般是方法
//  切点: 我们要替换掉，使用横切逻辑的代码部分
//  切面: 切面，包含了横切逻辑
//  织入: 把横切代码和原本的方法合并的过程, 并且在这里面执行横切逻辑
//  切点位置：beforeAdvice - 前置通知,  afterAdvice - 后置通知, afterThrowingAdvice - 后置异常通知, afterReturnAdvice - 后置返回通知, roundAdvice - 环绕通知
// try {
//     //  执行前置通知；
//     //  执行目标方法；
//     // 执行返回通知；
// } catche(Exception e) {
//     // 执行异常通知；
// } finally {
//     // 执行后置通知；
// }

function testLogic() {
  console.log("我是逻辑代码");
}

class Aspect {
  constructor(target) {
    this.target = target;
  }

  before(fn) {
    this.beforeFn = fn;
    return this;
  }

  after(fn) {
    this.afterFn = fn;
    return this;
  }

  afterThrow(fn) {
    this.afterThrowFn = fn;
    return this;
  }

  afterReturn(fn) {
    this.afterReturnFn = fn;
    return this;
  }

  around(fn) {
    this.aroundFn = fn;
    return this;
  }

  execute() {
    if (this.aroundFn) {
      this.aroundFn();
    } else {
      let beforeResult = true;
      if (this.beforeFn) {
        beforeResult = this.beforeFn();
      }
      if (beforeResult === false) {
        return;
      }
      try {
        const result = this.target();
        if (this.afterFn) {
          this.afterFn();
        }
        return result;
      } catch (error) {
        if (this.afterThrowFn) {
          this.afterThrowFn();
        }
      } finally {
        if (this.afterReturnFn()) {
          this.afterReturnFn();
        }
      }
    }
  }
}

new Aspect(testLogic).before(() => {
  console.log('before');
}).after(() => {
    console.log('after');
}).afterReturn(() => {
    console.log('after return');
}).afterThrow(() => {
    console.log('after throw');
}).execute();
