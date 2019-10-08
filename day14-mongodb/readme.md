## mongodb
* MongoDB是一个基于分布式文件存储的开源数据库系统,由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案
* MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。
* MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。

提到Mongodb我们需要先了解下NoSql和分布式的概念

## NoSql
* NoSQL，指的是非关系型的数据库。 NoSQL(NoSQL = Not Only SQL )，意即"不仅仅是SQL"。
* 是对不同于传统的关系型数据库的数据库管理系统的统称,它具有非关系型、分布式、不提供ACID的数据库设计模式等特征。
* NoSQL用于超大规模数据的存储。这些类型的数据存储不需要固定的模式，无需多余操作就可以横向扩展。

sql和nosql的区别

![image](../static/sql.jpg)

SQL数据库适合那些需求确定和对数据完整性要去严格的项目。NoSQL数据库适用于那些对速度和可扩展性比较看重的那些不相关的，不确定和不断发展的需求。简单来说就是：

SQL是精确的。它最适合于具有精确标准的定义明确的项目。典型的使用场景是在线商店和银行系统。
NoSQL是多变的。它最适合于具有不确定需求的数据。典型的使用场景是社交网络，客户管理和网络分析系统。

* 关系型数据库遵循ACID规则

    1、A (Atomicity) 原子性  
    原子性很容易理解，也就是说事务里的所有操作要么全部做完，要么都不做，事务成功的条件是事务里的所有操作都成功，只要有一个操作失败，整个事务就失败，需要回滚。
    比如银行转账，从A账户转100元至B账户，分为两个步骤：1）从A账户取100元；2）存入100元至B账户。这两步要么一起完成，要么一起不完成，如果只完成第一步，第二步失败，钱会莫名其妙少了100元。

    2.C (Consistency) 一致性  
    一致性也比较容易理解，也就是说数据库要一直处于一致的状态，事务的运行不会改变数据库原本的一致性约束。
    例如现有完整性约束a+b=10，如果一个事务改变了a，那么必须得改变b，使得事务结束后依然满足a+b=10，否则事务失败。

    3.I (Isolation) 独立性  
    所谓的独立性是指并发的事务之间不会互相影响，如果一个事务要访问的数据正在被另外一个事务修改，只要另外一个事务未提交，它所访问的数据就不受未提交事务的影响。
    比如现在有个交易是从A账户转100元至B账户，在这个交易还未完成的情况下，如果此时B查询自己的账户，是看不到新增加的100元的。

    4.D (Durability) 持久性  
    持久性是指一旦事务提交后，它所做的修改将会永久的保存在数据库上，即使出现宕机也不会丢失。

* NoSql遵循BASE原则  
    * BASE：Basically Available, Soft-state, Eventually Consistent。
    * CAP理论的核心是：一个分布式系统不可能同时很好的满足一致性，可用性和分区容错性这三个需求，最多只能同时较好的满足两个。
    * BASE是NoSQL数据库通常对可用性及一致性的弱要求原则:  
        1.Basically Availble -- 基本可用  
        2.Soft-state -- 软状态/柔性事务。 "Soft state" 可以理解为"无连接"的, 而 "Hard state" 是"面向连接"的  
        3.Eventual Consistency -- 最终一致性， 也是是 ACID 的最终目的

## 分布式
分布式系统（distributed system）由多台计算机和通信的软件组件通过计算机网络连接（本地网络或广域网）组成。  
分布式系统是建立在网络之上的软件系统。正是因为软件的特性，所以分布式系统具有高度的内聚性和透明性。  
因此，网络和分布式系统之间的区别更多的在于高层软件（特别是操作系统），而不是硬件。  
分布式系统可以应用在不同的平台上如：Pc、工作站、局域网和广域网上等。  


## mongodb的概念和语法
```sh
# mac系统上，按照完毕后, 启动数据库服务，默认端口是27017，需要提前创建 /data/db文件夹存储数据
# 使用指定端口启动 mongod --dbpath 数据库路径 --port 指定的端口号
# 加 & 是守护进程，可以自由关闭shell
sudo mongod &

# 连接mongo服务
mongo
```

### 基本概念：
* 数据库 MongoDB的单个实例可以容纳多个独立的数据库，比如一个学生管理系统就可以对应一个数据库实例
* 集合 数据库是由集合组成的,一个集合用来表示一个实体,如学生集合
* 文档 集合是由文档组成的，一个文档表示一条记录,比如一位同学张三就是一个文档
![image](../static/mongostat.jpg)

### 数据库的操作
```sh
# 显示所有数据库
show dbs;

# 显示当前数据库
db;

# 切换数据库 / 创建新数据库并自动切换
use ${dbName}

# 删除数据库
db.dropDatabase()
```

### 集合的操作
```sh
# 显示集合
show collections;

# 创建空集合
db.createCollection(collection_Name)

# 创建集合并插入文档
db.collection_Name.insert(document)

# 删除集合
db.collection_name.drop()
```

### 文档的操作
```sh
# 插入内容
db.collection_name.insert(...) / save(...) - 有记录会更新

# 删除内容
# 删除当前集合所有内容
db.collection_name.remove({})
# 按条件删除, justOne默认为false, 删除所有匹配条件的，设置为true表示只删除找到的第一条
db.col.remove({'title':'MongoDB 教程'}, {justOne: true})

# 更新内容
db.collection_name.update() // $set, $unset $inc $push $pop $ne $addToSet
# 按条件name:wd4批量添加字段age
db.user.update({name:'wd4'}, {$set:{age:9}}, {multi: true});
# 按条件name:wd4批量去除字段age
db.user.update({name:'wd4'}, {$unset:{age:9}}, {multi: true});
# 给年龄加5，没有年龄字段的，新增age:5
db.user.update({name: 'wd4'}, {$inc: {age: 5}}, {multi: true})
# 添加数组字段
db.user.update({_id:5}, {$set:{hobby: ['reading', 'writing', 'eat']}})
# 修改数组的某一项
db.user.update({_id:5}, {$set:{'hobby.0':'sleep'}})
# 新增数组某一项
db.user.update({_id: 5}, {$push:{hobby: 'playing'}})
# 删除数据的第一项或者最后一项
db.user.update({_id:5},{$pop:{hobby:-1}});  // hobby:-1 | -1
# 插入非重复项 多条件查询条件过滤后插入， ne表示没有, 类似not in 或者not exists
db.user.update({_id:5, hobby:{$ne:123}}, {$push: {hobby:123}})
# 插入非重复项2 如果表中hobby已存在123，就不会插入
db.user.update({_id:5}, {$addToSet: {hobby:123}})
# 更新不存在的一条记录，并且没找到就插入
db.user.update({_id:199}, {$set:{name:'xxx'}}, {upsert: true})
# $each 把数组中的元素逐个添加到集合中
let hobbys = ["A",'B'];
db.user.update({name:'zfpx1'},{$addToSet:{hobbys:{$each:hobbys}}});
```

**查询** 查询是比较重要的一部分  
**语法**  
db.collection_name.find({queryWhere},{key:1,key:1})

**参数列表**  
* collection_name 集合的名字
* queryWhere 参阅查询条件操作符
* key 指定要返回的列
* 1 表示要显示

```sh
# 只返回显示age列
db.collection_name.find({},{age:1});

# 查询当前集合数量级
db.collection_name.find().count();

# 查询匹配结果的第一条数据 语法
db.collection_name.findOne({_id: Object('5d886d2f921ba0b7ada0eb71')});
db.collection_name.findOne({name:'z3'});

# 查询字段在某个范围内
db.collection_name.find({age:{$in:[30,100]}},{name:1,age:1});

# 查询字段不在某个范围内
db.collection_name.find({age:{$nin:[30,100]}},{name:1,age:1});

# 取特定条件 age大于13 小于17的
db.collection_name.find({age:{$gte:13,$lte:17}});

# 取特定条件 age小于13 大于17的
db.student.find({age:{$not:{$gte:13,$lte:17}}});

# 对数组的查询
# 按所有元素匹配
let result = db.user.find({friends:[ "A", "B", "C", "D" ]});
# 匹配一项 包含A的就可以
let result = db.user.find({friends:"A"});
# $all 必须同时包含A B
let result = db.user.find({friends:{$all:['A',"B"]}});
# $in 或者关系 ，包含A或者B
let result = db.user.find({friends:{$in:['A',"B"]}});
# $size 按数组的长度去匹配
let result = db.user.find({friends:{$size:4}});
# $slice 只返回数组中的某一部分  $slice:["$array", [startIndex, ] length ] （startIndex可以省略，默认从0开始）
let result = db.user.find({friends:{$size:5}},{name:1,friends:{$slice:2}});
let result = db.user.find({friends:{$size:5}},{name:1,friends:{$slice:-2}});
db.user.find({},{friends:{$slice:[0,3]}}); 

# 分页查询 MongoDB Limit与Skip方法 sort方法
# skip(), limilt(), sort()三个放在一起执行的时候，执行的顺序是先 sort(), 然后是 skip()，最后是显示的 limit()。
# sort() 方法可以通过参数指定排序的字段，并使用 1 和 -1 来指定排序的方式，其中 1 为升序排列，而 -1 是用于降序排列。
let currentPage = 3;
let pageSize = 10;
db.user.find({}).limit(pageSize).skip((currentPage-1)*pageSize).sort('name': 1)
```


在js中编写mongo语法并执行：
```js
// 可以在js文件中写mongodb的语法，使用 mongo 1.mongo.js执行当前文件
let db = connect('school');

let startTime = Date.now();
const dataArr = [];
for (let index = 0; index < 10000; index++) {
    dataArr.push({name: 'wd-test' + index, age: index, address:'安庆'});
}
db.user.insert(dataArr);

print(Date.now() - startTime);
```
在当前文件的目录下，执行mongo file_name.js 运行当前逻辑


**添加索引**
* 索引通常能够极大的提高查询的效率，如果没有索引，MongoDB在读取数据时必须扫描集合中的每个文件并选取那些符合查询条件的记录。
* 索引是特殊的数据结构，索引存储在一个易于遍历读取的数据集合中，索引是对数据库表中一列或多列的值进行排序的一种结构

createIndex() 方法 （不适合将频繁修改操作的字段设置为索引）
> db.collection.createIndex(keys, options)
语法中 Key 值为你要创建的索引字段，1 为指定按升序创建索引，如果你想按降序来创建索引指定为 -1 即可
> 实例：db.col.createIndex({"title":1,"description":-1})

createIndex() 接收可选参数，可选参数列表如下：

参数 | 类型 | 描述
---|--- | ---
background | Boolean | 	建索引过程会阻塞其它数据库操作，background可指定以后台方式创建索引，即增加 "background" 可选参数。 "background" 默认值为false。
unique | Boolean | 建立的索引是否唯一。指定为true创建唯一索引。默认值为false.
name | string | 索引的名称。如果未指定，MongoDB的通过连接索引的字段名和排序顺序生成一个索引名称
sparse | Boolean | 对文档中不存在的字段数据不启用索引；这个参数需要特别注意，如果设置为true的话，在索引字段中不会查询出不包含对应字段的文档.。默认值为 false.

> db.students.getIndexes() //查看索引

**备份和回复数据**
> 注意：备份和回复数据的命令不是写在mongo的命令行里面，而是直接在shell里面
```sh
mongodump
    -- host 127.0.0.1
    -- port 27017
    -- out D:/databack/backup
    -- collection mycollection
    -- db test
    -- username
    -- password
# mongodump --host 127.0.0.1 --port 27017 --out /data/backup --collection user --db school
# db.users.drop();

mongorestore
--host
--port
--username
--password

# 将backup文件夹里面的所有备份文件全部还原 回复原数据
# mongorestore --host 127.0.0.1 --port 27017 ./backup
```


**mongodb 用户权限控制**
我们之前直接通过mongo就连接上mongodb了，用过mysql的人会了解安装完mysql后会给你当前用户一个随机的密码用来登录连接。必须输入用户名，密码，否则无法直接连接上mysql。这样会更安全。
实际上，在正常的使用mongodb的过程中我们也需要这样来操作。
* 使用use admin进入我们的admin库
* 使用db.createUser方法来创建集合
* 具体的角色信息可以查看官方文档：https://docs.mongodb.com/manual/reference/built-in-roles/

```sh
# 添加用户
db.createUser({
    user:'wd',
    pwd:'123456',
    customData:{
        name:'zhufengpeixun',
        email:'zhufengpeixun@126.com',
        age:9
    },
    roles:[
        {
          role:'readWrite',
          db:'school'
        },
        'read'
    ]
});

# 查询用户
db.system.users.find();

# 删除用户
db.system.users.remove({user:'wd'});

# 删除掉之前的mongo服务，用需要权限的方式重新启动
sudo mongod --auth
mongo  -u wd -p 123456 127.0.0.1:27017/admin(school)

# 鉴权 - 切换登录的用户信息
use admin;
db.auth('wd','123456');
正确返回1，如果错误返回0
```

**数据库用户角色**
针对每一个数据库进行控制。
- read :提供了读取所有非系统集合，以及系统集合中的system.indexes, system.js, system.namespaces
- readWrite: 包含了所有read权限，以及修改所有非系统集合的和系统集合中的system.js的权限

**数据库管理角色**
每一个数据库包含了下面的数据库管理角色。
- dbOwner：该数据库的所有者，具有该数据库的全部权限。
- dbAdmin：一些数据库对象的管理操作，但是没有数据库的读写权限。（参考：http://docs.mongodb.org/manual/reference/built-in-roles/#dbAdmin）
- userAdmin：为当前用户创建、修改用户和角色。拥有userAdmin权限的用户可以将该数据库的任意权限赋予任意的用户。

**集群管理权限**
- admin数据库包含了下面的角色，用户管理整个系统，而非单个数据库。这些权限包含了复制集和共享集群的管理函数。
- clusterAdmin：提供了最大的集群管理功能。相当于clusterManager, clusterMonitor, and hostManager和dropDatabase的权限组合。
- clusterManager：提供了集群和复制集管理和监控操作。拥有该权限的用户可以操作config和local数据库（即分片和复制功能）
- clusterMonitor：仅仅监控集群和复制集。
- hostManager：提供了监控和管理服务器的权限，包括shutdown节点，logrotate, repairDatabase等。 备份恢复权限：admin数据库中包含了备份恢复数据的角色。包括backup、restore等等。


**所有数据库角色**
- admin数据库提供了一个mongod实例中所有数据库的权限角色：
- readAnyDatabase：具有read每一个数据库权限。但是不包括应用到集群中的数据库。
- readWriteAnyDatabase：具有readWrite每一个数据库权限。但是不包括应用到集群中的数据库。
- userAdminAnyDatabase：具有userAdmin每一个数据库权限，但是不包括应用到集群中的数据库。
- dbAdminAnyDatabase：提供了dbAdmin每一个数据库权限，但是不包括应用到集群中的数据库。

**超级管理员权限**
- root: dbadmin到admin数据库、useradmin到admin数据库以及UserAdminAnyDatabase。但它不具有备份恢复、直接操作system.*集合的权限，但是拥有root权限的超级用户可以自己给自己赋予这些权限。

**备份恢复角色**
- backup、restore；

**内部角色**
- __system



### 在nodejs上用mongoose连接db
```
npm install mongoose
```
具体连接代码见：day14-mongodb/mongoose/1.mongoose.js
- Mongoose是MongoDB的一个对象模型工具
- 同时它也是针对MongoDB操作的一个对象模型库,封装了MongoDB对文档的的一些增删改查等常用方法
- 让NodeJS操作Mongodb数据库变得更加灵活简单
- Mongoose因为封装了MongoDB对文档操作的常用方法，可以高效处理mongodb,还提供了类似Schema的功能，如hook、plugin、virtual、populate等机制。

mongoose官网：http://mongoosejs.com/ 

**使用mongoose**
``` js
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://user:pwd@ip:port/databases');
```

例如：
``` js
var mongoose = require('mongoose');
var connection = mongoose.createConnection("mongodb://127.0.0.1/zfpx");
connection.on('error', function (error) {
    console.log('数据库连接失败: ' + error);
});
connection.on('open', function (error) {
    console.log('数据库连接成功');
});
```

**Schema**
Schema: 是数据库集合的模型骨架 定义了集合中的字段的名称和类型以及默认值等信息
Type: NodeJS中的基本数据类型都属于 Schema.Type 另外Mongoose还定义了自己的类型 基本属性类型有:  
* 字符串(String)
* 日期型(Date)
* 数值型(Number)
* 布尔型(Boolean)
* null
* 数组([])
* 内嵌文档

在操作数据库之前我们需要定义schema，例如:
```js
var personSchema = new Schema({
    name:String, //姓名
    binary:Buffer,//二进制
    living:Boolean,//是否活着
    birthday:Date,//生日
    age:Number,//年龄
    _id:Schema.Types.ObjectId,  //主键
    _fk:Schema.Types.ObjectId,  //外键
    array:[],//数组
    arrOfString:[String],//字符串数组
    arrOfNumber:[Number],//数字数组
    arrOfDate:[Date],//日期数组
    arrOfBuffer:[Buffer],//Buffer数组
    arrOfBoolean:[Boolean],//布尔值数组
    arrOfObjectId:[Schema.Types.ObjectId]//对象ID数组
    nested:{ //内嵌文档
        name:String,
    }
});
```

**Model**
Model是由通过Schema构造而成 除了具有Schema定义的数据库骨架以外，还可以操作数据库 如何通过Schema来创建Model呢，如下:
```js
//连接数据库
mongoose.connect("mongodb://123.57.143.189:27017/zfpx");
//两个参数表示定义一个模型
var PersonModel = mongoose.model("Person", PersonSchema);
// 如果该Model已经定义，则可以直接通过名字获取
var PersonModel = mongoose.model('Person');//一个参数表示获取已定义的模型
```
拥有了Model，我们也就拥有了操作数据库的能力 在数据库中的集合名称等于 模型名转小写再转复数,比如
> Person>person>people,Child>child>children



### 附录
objectId的构成：
之前用传统的关系型数据库的时候，主键往往是设置成自增的，但在分布式的环境下，自增的主键就不可行了。因为会出现重复值。
为此，mongodb采用了一种ObjectId的类型来作为主键。objectid是12字节的BSON类型的字符串，按照字节顺序，依次代表
* 4字节： UNIX时间戳
* 3字节：表示运行mongodb的机器
* 2字节：表示生成此_id的进程
* 3字节：由一个随机数开始的计数器生成的值

















