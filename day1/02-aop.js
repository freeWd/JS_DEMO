Function.prototype.before = function() {
    console.log('我在方法之前执行');
}

Function.prototype.after = function() {
    console.log('我在方法之后执行');
}

Function.prototype.aop = function() {
    let that = this;
    return function() {
        that.before.apply(that, arguments);
        that.apply(that, arguments);
        that.after.apply(that, arguments);
    }
}

function normalFn(name) {
    console.log('hello' + name);
}

var aopFn = normalFn.aop();
aopFn('Jack');