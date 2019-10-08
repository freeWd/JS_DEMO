let db = connect('school');

let startTime = Date.now();
let cursor = db.user.find({age: {$lte: 10}});
cursor.forEach(item => {
    printjson(item);
});
print(Date.now() - startTime);
