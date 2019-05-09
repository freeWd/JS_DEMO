
// // part 1 - 数组和类数组
// function test(a1, a2, a3) {
//     let object = { 0: 1, 1: 2, 2: 3, length: 3 };
//     let arr = [...arguments];
//     console.log(Array.prototype.slice.call(object));
//     console.log(arguments, Array.isArray(arguments));
//     console.log(arr, Array.isArray(arr));
// }
// test('a', 'b', 'c');


// // part 2 - 迭代器
// function test2() {
//     let object = {
//         0: 1,
//         1: 2,
//         2: 3,
//         length: 3,
//         [Symbol.iterator]: function() {
//             let index = 0;
//             let that = this;
//             return {
//                 next: function() {
//                     return { value: that[index], done: index++ === that.length }
//                 }
//             }
//         }
//     }
//     console.log([...object])
// }
// test2();


// // 生成器 与 返回值 和赋值
// function* read() {
//     let a = yield 1;
//     console.log(a);
//     let b = yield 2;
//     console.log(b);
//     return 200;
// }

// let ts = read();
// console.log(ts.next());
// console.log(ts.next('a=value'));
// console.log(ts.next('b=value'));


// part3 生成器解决异步问题
let fs = require('fs');

let p1 = new Promise(function(resolve, reject) {
    fs.readFile('./day1/static/name.txt', 'utf8', function(error, data) {
        if (error) reject(error);
        resolve(data);
    })
});

let p2 = new Promise(function(resolve, reject) {
    fs.readFile('./day1/static/age.txt', 'utf8', function(error, data) {
        if (error) reject(error);
        resolve(data);
    });
});

function* read2() {
    let content = yield p1;
    let age = yield p2;
    return age;
}

let it2 = read2();
let { value } = it2.next();
value.then(data => {
    console.log(data);
    let { value } = it2.next(data);
    value.then(data => {
        console.log(data);
    })
})


// part4 封装co方法解决通用性问题
function co(it) {
    return new Promise(function(resolve, reject) {
        function next(data) {
            let { value, done } = it.next(data);
            if (done) {
                resolve (value);
            } else {
                value.then((data2) => {
                    next(data2);
                }, error => {
                    reject(error);
                })
            }
        }

        next();
    });
}

co(read2()).then(data => console.log(data));




// part5 async + await 
async function readAge() {
    try {
        let content = await p1;
        let age = await p2;
        return age;
    } catch (error) {
        console.log(error);
    }
}

// async函数执行后 返回的是一个promise
readAge().then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
})
