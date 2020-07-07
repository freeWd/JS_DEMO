let fs = require('fs');
let path = require('path');

let rs = fs.createReadStream(path.resolve(__dirname , './static/1.txt'), {
    flags: 'r',
    autoClose: true,
    start: 0,
    end: 5,
    highWaterMark: 3
});

let bufferArr = [];
rs.on('data', function(chunk) {
    console.log(chunk);
    bufferArr.push(chunk);
    rs.pause();
});

rs.on('end', function() {
    console.log('---->', Buffer.concat(bufferArr).toString());
});

setTimeout(() => {
    rs.resume();
}, 1000);