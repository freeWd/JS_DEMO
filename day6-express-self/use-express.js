const express = require('./self-express');
// const express = require('express');

const route1 = require('./use-route');
const cookieParse = require('./self-cookie-parser');

const app = express();

app.use(function(req, resp, next) {
    console.log('middleware 1');
    next();
});

app.use(cookieParse.json());

app.use('/route1', route1);

app.get('/test/:id/:name', (req, resp, next) => {    
    next();
    // resp.end('hello world')
});

app.post('/post', (req, resp, next) => {   
    console.log(req.body, '<---body'); 
    next();
});

app.all('*', (req, resp) => {
    resp.send({"content": "all methods"});
});


app.listen(3003, () => {
    console.log('server start');
});