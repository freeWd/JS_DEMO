function square(a) {
    return a * a;
}

function add(a, b) {
    return a + b;
}


function flowRight(fn1, fn2) {
    return function(v1, v2) {
        return fn1(fn2(v1, v2));
    }
}

var addSquare = flowRight(square, add);
console.log(addSquare(3,2));