const test2 = require('./child')

const a = '123';

function test(param) {
    console.log(param)
}

test(a)
test2()