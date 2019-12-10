// 手写 call

// demo 9 中手动实现bind的时候借助了call，这就有中没有完全拜托js api的感觉，那如何call也由手动来实现，就更好了
var x = 'x';
var obj = {
    x: 'xx'
}
function test(a, b) {
    console.log(a, b);
    console.log(this.x);
}
test.call(obj, '1', '2');


Function.prototype.call2 = function(context) {
    const args = Array.prototype.slice.call(arguments, 1);
    const that = this;
    context = context || window;
    context.fn = that;
    const returnValue = context.fn(...args);
    delete context.fn;
    return returnValue;
}

test.call2(obj, '1', '2');
