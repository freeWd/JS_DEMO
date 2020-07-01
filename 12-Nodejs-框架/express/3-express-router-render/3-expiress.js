//  路由  | 模板 
const express = require('express');
const path = require('path');
const router1 = require('./3-router1');
const router2 = require('./3-router2');


const app = express();
app.set('view engine','ejs');
app.set('views',__dirname);

app.use('/router1', router1);
app.use('/router2', router2);

app.get('/index', function (req,res) {
    // res.render('index.ejs',{title:'hello'});
    res.render('3-index',{title:'hello'},function(err,data){
        console.log(data);
        res.send(data);
    });
});

app.listen(3003);
