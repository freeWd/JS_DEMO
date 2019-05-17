async function async1() {
    console.log('async start');
    await async2();
}

async function async2() {
    console.log('async2');
}

console.log('script start');

setTimeout(() => {
    console.log('setTimeout');
})

async1();

new Promise((resolve, reject) => {
    console.log('promise 1');
    resolve();
}).then(() => {
    console.log('promise1 then')
});

console.log('script end');


// start start async2 promise 1 end 1then timeout 