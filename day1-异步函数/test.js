function red() {
    console.log('red');
}

function yellow() {
    console.log('yellow');
}

function green() {
    console.log('green');
}

// function test() {
//     setTimeout(()=> {
//         red();
//         setTimeout(()=> {
//             yellow();
//             setTimeout(()=> {
//                 green();
//                 test();
//             }, 1000)
//         }, 2000);
//     }, 3000);
// }

// test();

// function test() {
//     new Promise((resolve) => {
//         setTimeout(() => {
//             red();
//             resolve();
//         }, 3000);
//     }).then(() => {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 yellow();
//                 resolve()
//             }, 2000)
//         });
//     }).then(() => {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 green();
//                 resolve()
//                 test();
//             }, 1000)
//         });
//     });
// }
// test();


// function* test() {
//     yield new Promise((resolve) => setTimeout(()=> {red(), resolve()}, 3000));
//     yield new Promise((resolve) => setTimeout(()=> {yellow(), resolve()}, 2000));
//     yield new Promise((resolve) => setTimeout(()=> {green(), resolve()}, 1000));
// }


// let testIter = test();
// testIter.next();
// testIter.next();
// testIter.next();
// testIter.next().value.then(()=>{
//     testIter.next().value.then(()=> {
//         testIter.next().value.then(()=> {

//         })
//     })
// });


// async function test() {
//     await new Promise((resolve) => setTimeout(()=> {red(), resolve()}, 3000));
//     await new Promise((resolve) => setTimeout(()=> {yellow(), resolve()}, 2000));
//     await new Promise((resolve) => setTimeout(()=> {green(), resolve()}, 1000));
// }

// test();



// let p = new Promise(resolve => {
//     console.log('a');
// });
// p.then((value) => {
//     console.log(value);
// })


// function loadImg(url) {
//     return new Promise((resolve, reject) => {
//         let img = new Image();
//         img.onerror = function() {
//             reject(url);
//         }

//         img.onload = function() {
//             resolve(url);
//         }

//         img.src = url;
//     });
// }


// const urlIds = [1,2,3,4];

// function loadTest(id) {
//     return new Promise((resolve) => {
//         setTimeout(()=> {
//             console.log(id);
//             resolve(id);
//         }, 2000)
//     });
// }

// let promiseArr = urlIds.map(urlId => loadTest(urlId));


// const urlIds = [1, 2, 3, 4, 5];

// function loadTest(id) {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve(id);
//         }, 1000);
//     });
// };

// function test(urlIds) {
//     return urlIds.map(urlId => loadTest(urlId));
// }

// function test2(urlIds) {
//     let urlTempIds = [];
//     let length = 3;
//     if (urlIds.length < length) {
//         urlTempIds = urlIds.slice();
//     } else {
//         urlTempIds = urlIds.slice(0, length);
//     }
//     Promise.all(test(urlTempIds)).then((value) => {
//         console.log(value);
//         if (urlIds.length >= 3) {
//             test2(urlIds.slice(3));
//         } else {
//             return;
//         }
//     });
// }

// test2(urlIds);





// ==============================
// const urlIds = [1, 2, 3, 4, 5];
// let urlTempIds = [];
// let finish = 0;
// let length = 3;


// function loadTest(id, index) {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             console.log(id, '====', index);
//             resolve(index);
//         }, 1000);
//     });
// };

// if (urlIds.length <= length) {
//     urlTempIds = urlIds.slice();
// } else {
//     urlTempIds = urlIds.slice(0, length);
// }
// let promiseArr = urlTempIds.map((urlId, index) => loadTest(urlId, index));

// function test3() {
//     Promise.race(promiseArr).then((value) => {
//         finish ++;

//         if (length + finish <= urlIds.length) {
//             let tempPromise = loadTest(urlIds[length + finish - 1], value);
//             promiseArr.splice(value, 1, tempPromise);    
//         }

//         if (finish < urlIds.length) {
//            test3();
//         }
//     });
// }

// test3();



// =======================
const fetchBooksInfo = function (bookIdList) {
    let arr = [];
    bookIdList.forEach(idItem => {
        arr.push({
            id: idItem
        });
    });
    return arr;
}


// function getBooksInfo(bookIds) {
//     return new Promise(resolve => {
//         resolve(fetchBooksInfo([bookIds]));
//     });
// }


let bookIdListToFetch = [];

function getBooksInfo(id) {
    if (!bookIdListToFetch.includes(id) && bookIdListToFetch.length < 100) {
        bookIdListToFetch.push(id);
    }
    return new Promise(resolve => {
        resolve(fetchBooksInfo([bookIds]));
    });
}

getBooksInfo(123).then(data => {
    console.log(data)
}) // 123