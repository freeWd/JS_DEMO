let http = require('http');

let client =http.request({
    hostname: 'localhost',
    port: 3003,
    path: '/xxx?a=3&b=4',
    method: 'post',
    headers: {
        'a': 1,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}, (response) => {
    response.on('data', function(data) {
        console.log(JSON.parse(data));
    })
});

client.end('name=123&pwd=234');