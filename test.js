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


