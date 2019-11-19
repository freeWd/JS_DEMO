const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

// 创建 连接的数据库
let conn = mongoose.createConnection('mongodb://127.0.0.1:27017/school', {
    useNewUrlParser: true
});

conn.on('error', (err) => {
    console.log('连接失败', err);
})

conn.on('open', () => {
    console.log('连接成功');
})

let UserSchema = new mongoose.Schema({
    username: String,
    password: String
})

let User = conn.model('person', UserSchema);

let CarSchema = new mongoose.Schema({
    productName: String,
    productPrice: String,
    user: {type: ObjectId, ref: User } // 关联外键
});
let Car = conn.model('shoppingcar', CarSchema);

// 先构建一个关联数据
// User.create({username: 'wd4', password: '12345'}).then(data => {
//     Car.create({productName: 'iphone', productPrice: 300, user: data._id}).then(data => {
//         console.log(data);
//     })
// });

// Population 可以自动替换 document 中的指定字段，替换内容从其他 collection 获取。 我们可以填充（populate）单个或多个 document、单个或多个纯对象，甚至是 query 返回的一切对象。 下面我们看看例子：
// 类似于多表关联查询
Car.findById('5d9d145b1dd48e1e2d14fcd5').populate('user', {username: 1}).then(
    doc => {
        console.log(doc);
    }
)