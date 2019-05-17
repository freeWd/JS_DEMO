// promise是es6中新增的内容，它是一个类。用来解决异步的问题

// part 1
// let Promise = require('./08-self-promise/8-1-promise');

// let p = new Promise(function(resolve,reject){
//     console.log('start');
//     reject('情人节到了');
//     resolve('情人到了');
// });

// p.then((value)=>{
//     console.log('success',value);
// },(reason)=>{
//     console.log('error',reason);
// })
// console.log('end');



// part 2
// let Promise = require('./08-self-promise/8-2-promise');
// let p = new Promise(function(resolve, reject) {
//     console.log('start');
//     setTimeout(function() {
//         resolve('hello world');
//     }, 1000)
// });

// p.then((value) => {
//     console.log('success', value);
// }, (error) => {
//     console.log('error', error);
// })

// p.then((value) => {
//     console.log('success2', value);
// }, (error) => {
//     console.log('error2', error);
// })

// console.log('end');


// part3 链式调用
// let Promise = require('./08-self-promise/8-3-promise');
let fs = require('fs');
function readFile(url) {
    return new Promise(function(resolve, reject) {
        fs.readFile(url, 'utf8', function(error, data) {
            if (error) reject(error);
            resolve(data);
        });
    });
}

readFile('./day1/static/age.txt').then(function(value) {
    console.log(value);
    // return readFile('./day1/static/name.txt');
    throw 123;
}).then(data => {
    console.log(data);
    return 100;
}).catch(err => {
    console.log(err);
    throw err;
}).then(data => {
    throw data;
}).then(data => {
    console.log(data, '<--- data');
}, (err) => {
    console.log('end', err);
});


// part4 Promise更多的用法
// let Promise = require('./08-self-promise/8-3-promise');

// let p = new Promise(function(resolve,reject){
//     resolve('hello world');
// });
// let promise2 = p.then((data)=>{  // 如果自己等待着自己完成 那么当前就应该走向失败
//     return new Promise((resolve,reject)=>{
//       setTimeout(function(){
//         resolve(new Promise((resolve,reject)=>{
//             setTimeout(function(){
//                 resolve(new Promise((resolve,reject)=>{
//                     setTimeout(function(){
//                         resolve(3000);
//                     },1000)
//                 }));
//             },1000);
//         }))
//       },1000);
//     })
// });
// promise2.then((data)=>{
//     console.log(data, '<----2');
// },(err)=>{
//     console.log('err ---》',err);
// })


// Promise.all([1, 2, 3]).then(data=>{
//     console.log(data);
//     return 100
//  },err=>{
//      console.log(err);
//  }).then(data=>{
//      console.log(data);
//  });

// let racePromise = new Promise((resolve, reject) => {
//     setTimeout(function() {
//         resolve('rece promise test');
//     }, 1000);
// });

//  Promise.race([racePromise, 1]).then((value) => {
//     console.log(value, '<----race');
//  });
