// 可以在js文件中写mongodb的语法，使用 mongo 1.mongo.js执行当前文件

let db = connect('school');

let startTime = Date.now();
const dataArr = [];
for (let index = 0; index < 10000; index++) {
    dataArr.push({name: 'wd-test' + index, age: index, address:'安庆'});
}
db.user.insert(dataArr);

print(Date.now() - startTime);