// 聚合
const mongoose = require("mongoose");
const conn = mongoose.createConnection("mongodb://127.0.0.1:27017/school", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

const UserModel = conn.model("person", UserSchema);

UserModel.aggregate([
  { $group: { _id: "$username", count: { $sum: 1 } } }
]).then(data => {
  console.log(data);
});

UserModel.aggregate([
  { $match: { username: /wd+/ } },
  { $group: { _id: "$username", count: { $sum: 1 } } },
  { $skip: 1 }
]).then(data => {
  console.log(data);
});
