function after(times, fn) {
    return function() {
        if (--times == 0) {
            fn();
        }
    }
}

var afterFn = after(2, function() {
    console.log('hello world');
});

afterFn();
afterFn();