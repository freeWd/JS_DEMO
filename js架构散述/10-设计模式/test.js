class Test {
    constructor(name) {
        console.log(this.demo2);
        this.name = name;
    }

    say() {
        console.log(this.name);
    }
}

Test.prototype.demo2 = {
    a: '123'
};



var a = new Test('a');
var b = new Test('b');
console.log(a.__proto__, b.__proto__, a.__proto__ === b.__proto__);
console.log(a, b);
a.demo2 = 'xxx';
console.log(a.__proto__, b.__proto__, a.__proto__ === b.__proto__);
console.log(a, b);

