

// 钩子函数
const mongoose = require('mongoose');
const crypto = require('crypto');

const conn = mongoose.createConnection('mongodb://127.0.0.1:27017');

conn.on('open', () => {
    console.log('连接成功');
})

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
})

UserSchema.pre('save', function(next) {
    this.password = crypto.createHmac('sha256', 'key').update(this.password).digest('base64');
    next();
})

UserSchema.statics.login = function(username, password) {
    password = crypto.createHmac('sha256', 'key').update(password).digest('base64');
    return this.findOne({username, password});
}

const UserModel = conn.model('person', UserSchema);
UserModel.create({username: 'wd7', password: '23456'}).then(doc => {
    console.log('===>', doc);
})

UserModel.login('wd7', '23456').then(doc => {
    console.log(doc);
})