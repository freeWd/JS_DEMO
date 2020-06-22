// var a = 12;
// var obj = {
//     a: 11,
//     fn: function() {
//         (() => {
//             console.log(this.a)
//         })()
//     },
//     fn2: function() {
//         (function() {
//             console.log(this.a)
//         })()
//     }
// }
// var fn = obj.fn
// fn()
// obj.fn2()

// ====> 手写bind
// var a = 1
// Function.prototype.bind2 = function(scope) {
//     var that = this;
//     return function() {
//         scope.fn = that;
//         scope.fn()
//     }
// }
// function test() {
//     console.log(this.a)
// }
// test.bind2({a:2}).bind2({a:3})()

// ajax('/test', (result) => {
//     console.log(result)
//     ajax('/test?value='+result, (result2) => {
//         console.log(result2)
//     })
// })

// new Promise((resolve, reject) => {
//     ajax('/test', result => {
//         console.log(result)
//         resolve(result)
//     })
// }).then(value => {
//     console.log('/test?value='+value)
// })



setTimeout(() => {
  Promise.resolve().then(_ => {
    console.log('hello xxx')
  })
  console.log('hello1')
})

setTimeout(() => {
  Promise.resolve().then(_ => {
    console.log('hello xxx2')
  })
  console.log('hello2')
})

setTimeout(() => {
  Promise.resolve().then(_ => {
    console.log('hello xxx3')
  })
  console.log('hello3')
})

new Promise(resolve => {
  console.log('xxx')
  resolve('xxx')
}).then(val => {
  console.log('ppppp')
  return 'ppppp'
}).then(val => {
  console.log('ppppp2')
  return new Promise(resolve => {
    console.log('pppp3')
    resolve('pppp3')
  }).then(val => {
    console.log('pppp4')
  })
})
