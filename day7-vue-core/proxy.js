let obj = {
    name: { name: 'z3' },
    age: 28,
    arr: []
}

let handle = {
    get: function(target, key, receiver) {
        if (typeof target[key] === 'object' && target[key] !== null) {
            return new Proxy(target[key], handle);
        } else {
            return Reflect.get(target, key, receiver);
        }
    },
    set: function(target, key, value ,receiver) {
        if (key === 'length') return true;
        console.log('update')
        return Reflect.set(target,key,value,receiver);
    }
};

let proxy = new Proxy(obj, handle);

proxy.arr = [1,2,3,4,5];
proxy.arr.length = 3;
console.log(proxy.arr);

obj.arr = [1,2,3,4,5];
obj.arr.length = 3;
console.log(obj.arr);

