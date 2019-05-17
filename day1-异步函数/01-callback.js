Function.prototype.before = function(fn) {
    var that = this;
    return function() {
        fn();
        that();
    }
}

var oldFn = function() {
    console.log('old funtion');
}

var newFn = oldFn.before(function() {
    console.log('new function');
})

newFn();