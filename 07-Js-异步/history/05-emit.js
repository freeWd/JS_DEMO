function Event() {
    this.arrFn = [];
}

Event.prototype.on = function(fn) {
    this.arrFn.push(fn);
}

Event.prototype.emit = function(message) {
    this.arrFn.forEach(function(arrFnItem) {
        arrFnItem(message);
    });
}


let event = new Event();
let arr = [];
event.on(function(data) {
    arr.push(data);
    if (arr.length === 2) {
        console.log(arr);
    }
});

event.emit('张三');
event.emit('18');