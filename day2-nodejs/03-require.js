
let test = require('./03-module-export');
let test2 = require('./03-module-export');

// 有缓存机制， console.log(123)只运行一次
test();
test2();