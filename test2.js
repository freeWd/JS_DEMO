var times = 0;

setInterval(function () {
  console.log(++times);
}, 1000);

process.on('message', function(m) {
    console.log('child process', m)
})