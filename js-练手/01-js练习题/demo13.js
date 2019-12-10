// 请描述你理解的函数式编程，并书写如下代码结果。
var Container = function(x) {
    this._value = x;
}

Container.of = function(x) {
    return new Container(x);
}

Container.prototype.map = function(fn) {
    return Container.of(fn(this._value));
}

Container.of(3).map(x => x + 1).map(x => console.log(x));

