// Demo1

setTimeout(() => {
    console.log('setTimeout1');
    Promise.resolve().then(data => {
        console.log('then3');
    });
},1000);
Promise.resolve().then(data => {
    console.log('then1');
});
Promise.resolve().then(data => {
    console.log('then2');
    setTimeout(() => {
        console.log('setTimeout2');
    },1000);
});
console.log(2);

// 输出结果：2 then1 then2 setTimeout1  then3  setTimeout2
// > 1. 先执行栈中的内容，也就是同步代码，所以2被输出出来；
// > 2. 然后清空微任务，所以依次输出的是 then1 then2；
// > 3. 因代码是从上到下执行的，所以1s后 setTimeout1 被执行输出；
// > 4. 接着再次清空微任务，then3被输出；
// > 5. 最后执行输出setTimeout2





// Demo2
async function async1() {
    console.log('async start');
    let value = await async2();
    console.log(value);
}

async function async2() {
    console.log('async2');
    new Promise((resolve, reject) => {
        console.log('async2-promise');
        resolve('p-test');
    }).then(value => {
        console.log(value);
    });
    let value = await 123;
    return value;
}

console.log('script start');

async1();

new Promise((resolve, reject) => {
    console.log('promise 1');
    resolve();
}).then(() => {
    console.log('promise1 then')
});

console.log('script end');

// 执行顺序如下：
// script start - async start - async2 - async2-promise - promise 1 -  script end - p-test - promise1 then - 123

