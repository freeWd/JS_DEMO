module.exports = function(pathname, resp) {
    let data = null
    if (pathname === '/api/module1') {
        data = [{
            name: '123'
        }, {
            name: '1234'
        }, {
            name: '1235'
        }]
    } 
    if (pathname === '/api/module2') {
        data = [{
            name: '12333'
        }, {
            name: '1234444'
        }, {
            name: '1235555'
        }]
    }

    resp.setHeader("content-type", 'application/json' + ";charset=utf-8");
    resp.end(JSON.stringify(data));
}