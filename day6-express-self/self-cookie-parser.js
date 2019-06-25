// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
const http = require('http');

http.createServer((req, resp) => {
    req.headers
});


function cookieParser() {

}

cookieParser.json = function () {
    return function(req, resp, next) {
        if (req.headers['content-type'] === 'application/json') {
            const arr = [];
            req.on('data', function(data) {
                arr.push(data);
            });
            req.on('end', function() {
                req.body = JSON.parse(Buffer.concat(arr).toString());
                next();
            });
        } else {
            next();
        }
    }
}

cookieParser.urlencoded = function (options) {
    return function(req, resp, next) {

        next();
    }
}

module.exports = cookieParser;