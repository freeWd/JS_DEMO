// Node.js 有多个内置的事件，我们可以通过引入 events 模块，并通过实例化 EventEmitter 类来绑定和监听事件
const events = require('events');

const eventEmitter = new events.EventEmitter();

function connected(arg1, arg2) {
    console.log('连接成功', arg1, arg2)
    eventEmitter.emit('data_received_event')
}

eventEmitter.on('connect_event', connected)
eventEmitter.on('data_received_event', function() {
    console.log('数据接收成功')
})

eventEmitter.emit('connect_event', '参数1', '参数2')

