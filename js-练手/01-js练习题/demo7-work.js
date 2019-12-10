this.addEventListener('message', function(e) {
    console.log(e.data);
}, false);

while(true) {  
    postMessage('123');
}