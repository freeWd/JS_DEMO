let fs = require('fs');

function after(timer, fn) {
    let arr = [];
    return function(data) {
        arr.push(data);
        if ( --timer === 0) {
            fn(arr);
        }
    }
}

let out = after(2, function(arr) {
    console.log(arr);
});

fs.readFile('./day1/static/age.txt', 'utf8', function(err, data) {
    out(data);
});

fs.readFile('./day1/static/name.txt', 'utf8', function(err, data) {
    out(data);
});

