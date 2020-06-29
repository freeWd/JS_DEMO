// Bind
Object.prototype.myBind = function (context = window, args = []) {
  const that = this;
  context = context || window;
  return function F() {
    if (this instanceof F) {
      return new that(...args, ...arguments);
    } else {
      context.fn = that;
      return context.fn(args.concat(...arguments));
    }
  };
};

// 测试
function test() {
  console.log(this.a);
}
test.myBind({ a: 123 })();
test.myBind(null)();
new (test.myBind({ a: 123 }))();

// Apply
Object.prototype.myApply = function (context = winndow, paramsArr = []) {
  const that = this;
  context = context || window;
  context.fn = that;
  const result = context.fn(paramsArr);
  delete context.fn;
  return result;
};

// Call
Object.prototype.myCall = function (context = winndow, ...params) {
  const that = this;
  context = context || window;
  context.fn = that;
  const result = context.fn(...params);
  delete context.fn;
  return result;
};

// 测试
function test3(name, age) {
    console.log(name, age, this.a)
}
test3.myCall({a: 123}, 'xxx', 'bbb')
