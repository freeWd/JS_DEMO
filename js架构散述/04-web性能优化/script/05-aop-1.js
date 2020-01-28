// AOP可以在不侵入代码原有逻辑的情况下，做一些不和逻辑紧密相关的操作，比如打日志，记录时间和性能参数等
// es5手写面向切面编程
function selfLogic() {
  var logic = "hello world";
  console.log("这是业务逻辑方法", logic);
  return logic;
}
Function.prototype.before = function(beforeFn) {
  var that = this;
  return function() {
    if (beforeFn.apply(this, arguments) === false) {
      return false;
    }
    return that.apply(this, arguments);
  };
};
Function.prototype.after = function(afterFn) {
  var that = this;
  return function() {
    var result = that.apply(this, arguments);
    if (result === false) {
      return false;
    }
    afterFn.apply(this, arguments);
    return result;
  };
};

var returnArg = selfLogic
  .before(function() {
    console.log("before内的方法");
    return true;
  })
  .after(function() {
    console.log("after内的方法");
  })();

console.log(returnArg);

// es7方法
class Math {
  // @log
  add(a, b) {
    return a + b;
  }
}

function log(target, name, descriptor) {
  const oldValue = descriptor.value;

  descriptor.value = function() {
    console.log(`Calling ${name} with`, arguments);
    return oldValue.apply(this, arguments);
  };

  return descriptor;
}

const math = new Math();
console.log(math.add(2, 4));
