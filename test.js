// var a = 12;
// var obj = {
//     a: 11,
//     fn: function() {
//         (() => {
//             console.log(this.a)
//         })()
//     },
//     fn2: function() {
//         (function() {
//             console.log(this.a)
//         })()
//     }
// }
// var fn = obj.fn
// fn()
// obj.fn2()

// ====> 手写bind
// var a = 1
// Function.prototype.bind2 = function(scope) {
//     var that = this;
//     return function() {
//         scope.fn = that;
//         scope.fn()
//     }
// }
// function test() {
//     console.log(this.a)
// }
// test.bind2({a:2}).bind2({a:3})()


var a = 10;
var x = function () {
  console.log(a);
};

function y(f) {
  var a = 2;
  f();
}

y(x);



var obj = {
  a: 1,
  b: {
    c: 2
  }
}

var obj2 = Object.assign({}, obj)
obj2.b = 3;
console.log(obj, obj2)