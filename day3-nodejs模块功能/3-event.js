class EventEmitter {
    constructor() {
        this._events = {};
    }
    on(key, fn) {
        if(this._events[key]) {
           this. _events[key].push(fn);
        } else {
           this. _events[key] = [fn];
        }
    }

    emit(key) {
        this._events[key].forEach(fnItem => {
            fnItem()
        });
    }

    off(key, fn) {
        this._event[key] = this._events[key].filter((fnItem) => fnItem != fn);
    }
}

const myEmitter = new EventEmitter();
// 添加 listener 函数到名为 eventName 的事件的监听器数组的末尾
myEmitter.on('a', function() {
    console.log('1');
});
myEmitter.on('a', function() {
    console.log('2');
});
// 从名为 a 的事件的监听器数组中移除指定的 listener(方法)。
myEmitter.off('a', function() {
    console.log('2');
});
// 触发事件 a
myEmitter.emit('a');