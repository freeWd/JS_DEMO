const mongoose = require('mongoose');

const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/school', {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
});

let UserModel = conn.model('person', UserSchema);

let UserEntity = new UserModel({
    username: 'wd5',
    password: '123123'
});

// UserEntity.save((err, doc) => {
//     if (err) {
//         console.log("error :" + err);
//     } else {
//        //doc是返回刚存的person对象 
//         console.log(doc);
//     }
// });

UserModel.findOne({_id: '5d9d2d9595b3d9212eb3dd62'}).then(doc => {
    console.log(doc);
    if (doc) {
        doc.password = '123123123';
        // doc 也算是一个实例化出来的实体
        doc.save(() => {
            // doc.remove(); // 删除功能
        });
    }
})