let fs = require('fs');
let path = require('path');

let rs = fs.createReadStream(path.resolve(__dirname, './static/1.txt'), {
    highWaterMark: 3
});

let ws = fs.createWriteStream(path.resolve(__dirname, './static/2.txt'), {
    highWaterMark: 1
});

rs.on('data', function(data) {
    console.log(data);
    let flag = ws.write(data);
    console.log(flag);
    if (!flag) {
        rs.pause();
    }
});

ws.on('drain', function() {
    console.log('抽干');
    rs.resume();
});