/**
 * Object.defineProperty
 * {
    value: 123,
    writable: false,
    enumerable: true,
    configurable: false,
    get: undefined,
    set: undefined
    }
 */


// vue 监听数据的变化
function notify() {
    console.log('视图更新');
}

let data = {
    name: 'jw',
    age: 18,
    arr: [],
    test: {
        test1: 123
    }
}

// 重写数组的方法 - vue把所有的数组方法都重写了
let oldPrototype = Array.prototype;
let proto = Object.create(oldPrototype);
['push','shift', 'unshift', 'pop'].forEach((method) => {
    proto[method] = function() {
        notify();
        // 为什么这里要call一下？
        // 原来 是 [].push('2'), 这里如果不call一下就相当于 直接push('2'),方法虽然执行，但是没有添加到对应的数组上去
        oldPrototype[method].call(this, ...arguments);
    }
});

function observer(obj) {
    if (Array.isArray(obj)) {
        obj.__proto__ = proto;
    }
    if (typeof obj === 'object') {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                defineReactive(obj, key, obj[key]);
            }
        }
    }
}

function defineReactive(obj, key, value) {
    observer(value);
    Object.defineProperty(obj, key, {
        get() {
            return value;
        },
        set(newValue) {
            // ！如果属性初始化后设置为另一个值，这样observer一下就保证，设置的新值可以被监听到
            observer(newValue);
            notify();
            value = newValue;
        }
    });
}


observer(data);

data.name = '123';
data.test = { test1: '234' };
data.test.test1 = '234';
data.arr.push('2');
console.log(data.arr);

// 取值的时候还是取原来的值
// ！如果属性初始化定义时不存在，后来增加的内容，并不会刷新视图
// ！数组不能通过长度来修改，也不能通过索引进行更改





