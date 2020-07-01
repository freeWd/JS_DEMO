var http = require('http');

var server = http.createServer(function(req, res){
    res.setTimeout(1000, function() {
      clearTimeout(timer)
      res.writeHead(500, 'time out')
      res.end('Error Timeout');
    })
    
    let timer = setTimeout(function(){
        res.write('world');
        res.end();
    }, 2000);
});

server.listen(3000);