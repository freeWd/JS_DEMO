// 除了mongoose内置的函数和属性之外，我们还可以自自定义扩展属性和方法
// 有时候schema定下来后，不方便修改，又需要添加新的字段进去

const mongoose = require('mongoose');

const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/school', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

conn.on('open', () => {
    console.log('连接成功');
})


let UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// // 对model 类进行扩张
// UserSchema.statics.findByName = function(username) {
//     return this.findOne({username});
// }

// // 对实例进行扩张
// UserSchema.methods.findByName2 = function() {
//     let query = {username: this.username};
//     console.log(query);
//     return this.model('person').findOne(query);
// }

// // 顺序问题，model一定要在定义的扩张方法之后，否则findByName方法无效
// let UserModel = conn.model('person', UserSchema);

// UserModel.findByName('wd3').then(data => {
//     console.log(data);
// });

// new UserModel({username: 'wd3'}).findByName2().then(doc => {
//     console.log(doc);
// })


// virtual 虚拟属性
UserSchema.virtual('firstname').get(function() {
    // this指向实例
    return this.username.slice(0,1);
});
UserSchema.virtual('lastname').get(function() {
    return this.username.slice(1, this.username.length);
});

let UserModel = conn.model('Person', UserSchema);
let UserEntity = new UserModel({username: 'xdc123', password: '123456'});
console.log(UserEntity.firstname, UserEntity.lastname);

// 注意：虽然实例中能获取到虚拟属性的值，但是不会保存到db里面去
UserEntity.save().then(data => {
    console.log(data);
})


