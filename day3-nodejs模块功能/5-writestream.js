let fs = require('fs');
let path = require('path');

let ws = fs.createWriteStream(path.resolve(__dirname, './static/2.txt'), {
    flags: 'w',
    encoding: 'utf8',
    autoClose: true,
    highWaterMark: 3,
    start: 0
});

let flag = ws.write('1你2好3', function(err) {
    console.log('写入');
});

ws.on('drain', function() {
    console.log('抽干');
})

console.log(flag);

// ws.end('再见');

// // 此处抛异常，文件如果已经存在，内容被清空
// ws.write('再见2');

