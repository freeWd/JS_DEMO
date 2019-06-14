const express = require('express');
let path = require('path');

const app = express();


/**
 * /abc?d            `/abcd` and `/abd`:
 * /ab+cd            /abcd`, `/abbcd`, `/abbbbbcd
 * /ab\*cd           `/abcd`, `/abxcd`, `/abFOOcd`, `/abbArcd`,
 * /a(bc)?d          `/ad` and `/abcd`
 * /\/abc|\/xyz/    `/abc` and `/xyz`
 * ['/abcd', '/xyza', /\/lmn|\/pqr/]   /abcd`, `/xyza`, `/lmn`, and `/pqr`:
 */
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/static'));
app.use('/page/static', express.static(__dirname));

app.use(function(req,res,next){
    console.log('中间件');
    next();
});
app.use('/static', function(req,res,next){
    console.log('带路径过滤的中间件');
    next();
});
app.use('/static2', function(req,res,next){
    console.log('带路径过滤的中间件2');
    next('stone is too big'); // next里面带参数就会抛异常
});

app.get('/redirect', (req, res) => {
    res.redirect('https://www.baidu.com');
});

app.get('/page/static', (req, res) => {
    let filePath = path.join(__dirname, '2-express.html')
    console.log(filePath);
    res.sendFile(filePath, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', '2-express.html');
        }
    });
});

app.listen(3003);