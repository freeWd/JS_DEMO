// var obj = {
//     prop: 1,
//     func: function () {
//         var _this = this;

//         var innerFunc = () => {
//             this.prop = 1;
//         };

//         var innerFunc1 = function () {
//             this.prop = 1;
//         };
//     },
// };

// obj.func();

// var arr = [1,2,3];

// var obj2 = {
//     arr: [],
//     test: function() {
//         console.log(arr);
//     }
// }

// var fn = obj2.test;
// fn();


// function test() {
//     var a1 = 123;
//     let a1 = 234;
//     if (true) {
//         let a1 = 456;

//         function test1() {
//             console.log(a1);
//         }

//         tesst1();
//     }
// }


let obj = {
    b: 2,
    methods: {
        a: 1,
        fn: () => {
            console.log(this);
        },
        fn1: function() {
            console.log(this);
        }
    },
    func: function() {
        console.log(this);
    },
    func1: () => {
        console.log(this);
    }
}

obj.methods.fn1();



console.log(123);
let p = new Promise((resolve) => {
    console.log('xxx');
    resolve(123);
});
p.then(() => {
    console.log(123)
})
console.log(234);


// 发布订阅  a  - 中间者 - b  -  a发布信息 中间商知道 然后通知b
// 中介
class Event {
    constructor() {
        this._arr = [];
    }

    on(fn) {
        this._arr.push(fn)
    }

    emit(data) {
        this._arr.forEach(function(fnItem) {
            fnItem(data);
        });
    }
}
var event = new Event();
var arr = [];
event.on(function(data) {
    arr.push(data);
    if (arr.length === 2) {
        console.log('读取完毕', data);
    }
});
event.emit('123');
event.emit('123');
event.emit('123');


// 观察者模式 - 观察者和被观察对象 - 当被观察对象有某种行为时，会触发观察者的一些行为
class Subject {
    constructor() {
        this.observerList = [];
        this.value = null;
    }

    append(observer) {
        this.observerList.push(observer);
    }

    emit(value) {
        this.value = value;
        this.notify();
    }

    notify() {
        this.observerList.forEach((observer) => {
            if (observer.handle) {
                observer.handle(this.value);
            }
        });
    }
}

class Observer {
    constructor(subject) {
        subject.append(this);
        this.handle = null;
    }

    subscribe(fn) {
        this.handle = fn;
    }
}

let sub1 = new Subject();
let ob1 = new Observer(sub1);
let ob2 = new Observer(sub1);
ob1.subscribe((value) => {
    console.log(value, '<---111');
});
ob2.subscribe((value) => {
    console.log(value, '<---222');
});
sub1.emit('hello');



console.log(process.env.NODE_ENV);



function readFile(url) {
    return new Promise(function(resolve, reject) {
        fs.readFile(url, 'utf8', function(error, data) {
            if (err) reject(err);
            resolve(data);
        });
    });
}

readFile('./day1/static/age.txt').then(function(value) {
    console.log(value);
    return readFile('./day1/static/name.txt');
}).then(data => {
    console.log(data);
    return 100;
}).then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
    // throw err;
}).then(data => {
    console.log(data);
}, () => {
    console.log('error');
})


class Promise {
    constructor(fn) {
        this.value = null;
        this.status = 'pending';
        fn(this.resolve, this.reject);
    }

    resolve(value) {
        (() => {
            this.value = value;
            this.status = 'resolve';
        })();
    }

    reject(value) {
        (() => {
            this.value = value;
            this.status = 'reject';
        })();
    }

    then(resolveFn, rejectFn) {
        if (this.status === 'resolve') {
            resolveFn(this.value);
        }
        if (this.status === 'reject') {
            rejectFn(this.value);
        }
    }
}

let xx = (resolve, reject) => {
    console.log(this);
    resolve('xxx');
};

let test = new Promise(xx);
test.then((result) => {
    console.log(result);
}, () => {
    console.log(result);
});


const str = 'public cn.seczone.iast.server.common.json.JsonResult cn.seczone.iast.server.vulnerability.service.impl.VulnerabilityServiceImpl.storyByVulnerabilityId(cn.seczone.iast.server.common.DomainSecurity,java.lang.String) throws java.lang.Exception';
const content = str.replace(/\w+\./g, (...args) => {
    return '';
});
console.log(content);



class Test {
    constructor() {
        this.demoArr = [];
        this.value = null;
    }

    addDemo(demo) {
        this.demoArr.push(demo)
    }

    changeValue(value) {
        this.value = value;
        this.notify()
    }

    notify() {
        this.demoArr.forEach(demoItem => {
            if(demoItem.fn) {
                demoItem.fn(this.value);
            }
        });
    }
}

class Demo {
    constructor(test) {
        test.addDemo(this);
        this.fn = null;
    }

    handle(fn) {
        this.fn = fn;
    }
}


let test = new Test();
let demo1 = new Demo(test);
let demo2 = new Demo(test);
demo1.handle((value) => {
    console.log(value, '001');
})
demo2.handle((value) => {
    console.log(value, '002');
})
test.changeValue('hello world');



function* test() {
    let a1 = yield Promise.resolve('123');
    console.log(a1);
    let a2 = yield Promise.resolve('234');
    console.log(a2);
    return a2;
}

let a = test();
console.log(a.next('a1'));
console.log(a.next('a2'));
console.log(a.next('a3'));


let p1 = new Promise((resolve, reject) => {
    let a = 2;
    if (a/2 === 1) {
        reject('error-p1');
    } else {
        resolve('success-p1');
    }
});

let p2 = new Promise((resolve, reject) => {
    let a = 2;
    if (a/2 === 1) {
        reject('error-p2');
    } else {
        resolve('success-p2');
    }
});

async function test2() {
    let a = await p1;
    console.log('a---->', a);
    let b = await p2;
    console.log('b---->', b);
    console.log(a, b);
    return a + b;
}

test2().then((data) => {
    console.log(data);
}).catch(data => {
    console.log(data, 'error');
})

let object = {
    0: 1,
    1: 2,
    2: 3,
    length: 3,
    [Symbol.iterator]: function() {
        let length = 0;
        let that = this;
        return {
            next: {
                value: that[length],
                done:  length++ === that.length
            }
        }
    }
}

var b = new Buffer('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTY2MzUyMDYwLCJleHAiOjE1NjYzNTIwODB9.v_IGmPIIOLaFO3oF6jLGUfop_lrzykoEqYkUvplRFTI', 'base64')
var s = b.toString();
console.log(s);




function test() {
    var a = 1;
    return function() {
        console.log(a);
    }
}

test()();