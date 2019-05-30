let fs = require('fs');
let path = require('path');

let filePath = path.resolve(__dirname, './static/1.txt');

fs.readFile(filePath, (error, data) => {
    console.log(data);
});

console.log(fs.readFileSync(filePath));

fs.writeFile('./day3-nodejs模块功能/static/2.txt', 'hello world', (err) => {
    console.log(err);
});