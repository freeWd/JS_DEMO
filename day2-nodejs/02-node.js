// nodejs事件环
setTimeout(() => {
    console.log('setTmeout1');
});

setImmediate(() => {
    console.log('setImmediate2');
});

// nodejs 事件环2
setImmediate(() => {
    console.log('setImmediate1');
    setTimeout(() => {
        console.log('setTimeout1')
    }, 0);
});
Promise.resolve().then(res => {
    console.log('then');
})
setTimeout(() => {
    process.nextTick(() => {
        console.log('nextTick');
    });
    console.log('setTimeout2');
    setImmediate(() => {
        console.log('setImmediate2');
    });
}, 0);

// node core
console.log(global);
console.log(Buffer);
console.log(console);

console.log(process);
console.log(process.env);
console.log(process.argv);
console.log(process.execPath);

process.nextTick(function() {
    console.log(123);
});

console.log(__dirname, __filename);




setTimeout(() => {
    console.log("timer21");
  }, 0);
  
  Promise.resolve().then(function () {
    console.log("promise1");
  });
  
  process.nextTick(() => {
   console.log('nextTick')
   process.nextTick(() => {
     console.log('nextTick')
     process.nextTick(() => {
       console.log('nextTick')
       process.nextTick(() => {
         console.log('nextTick')
       })
     })
   })
  })