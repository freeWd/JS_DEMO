const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

 
app.use(bodyParser.json());
app.use((req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization', 'Cookie');
    if (req.method.toLowerCase() === 'options') {
        return resp.end();
    }
    next();
});

// 验证方式： cookie, token(json web token == JWT)
app.post('/login', (req, resp) => {
    let {username} = req.body;
    if (username === 'admin') {
        resp.json({
            code: 0,
            username: 'admin',
            token: jwt.sign({username}, 'test', {
                expiresIn: 20
            })
        })
    } else {
        resp.json({
            code: 1,
            data: '用户名不存在'
        })
    }
});

app.listen(3000);