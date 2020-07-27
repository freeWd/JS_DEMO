let mongoose = require('mongoose');

// 创建 连接的数据库
let conn = mongoose.createConnection('mongodb://127.0.0.1:27017/school', {
    useNewUrlParser: true
});

conn.on('error', (err) => {
    console.log('连接失败 123', err);
})

conn.on('open', () => {
    console.log('连接成功');
})

let UserSchema = new mongoose.Schema({
    // 定义好需要的属性，否则后期增加的话，无法增加
    username: String,
    password: Number,
    date: { type: Date, default: Date.now() },
    age: Number,
    hobby: [] // 如果没有插入，hobby默认也是一个数组
})

// curd
let User = conn.model('person', UserSchema);
// pwd定义的是number, 传‘123’会做一个类型转化，实在无法转化的会报异常
// User.create({username: 'wd2', passowrd:'1234', address: 'xxxx', age: 25}).then((data) => {
//     console.log(data);
// });

// update
// update操作会自带合并功能，不会覆盖掉
// User.update({username: 'wd'}, {$addToSet: {hobby: {$each: ['吃','喝']}}}).then(doc => {
//     console.log(doc);
// });

// User.updateOne({username: 'wd'}, {$addToSet: {hobby: {$each: ['吃','喝', '玩']}}, username: 'wd3'}).then(doc => {
//     console.log(doc);
// });

// 删除
// User.deleteOne({username: 'wd'}).then(r => {
//     console.log(r);
// })

// 查询
// User.findOne({username: 'wd2'}).then(result => {
//     console.log(result);
// })

// User.findOne({_id: '5d886d2f921ba0b7ada0eb71'}).then(result => {
//     console.log(result);
// })

// User.findById('5d886d2f921ba0b7ada0eb71').then(result => {
//     console.log(result);
// })

let pageSize = 5;
let currentPage = 1;
User.find({}).sort({username: -1}).limit(pageSize).skip((currentPage - 1)*pageSize).exec((err, doc) => {
    console.log(doc);
})

