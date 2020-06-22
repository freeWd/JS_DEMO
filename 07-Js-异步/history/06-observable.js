// 观察者模式

// 主题 - 被观察对象
function Subject() {
    this.observerArr = [];
    this.message = null;
}

Subject.prototype.attach = function(observer) {
    this.observerArr.push(observer);
}

Subject.prototype.next = function(message) {
    this.message = message;
    this.notifyAll(message);
}

Subject.prototype.notifyAll = function(message) {
    let that = this;
    this.observerArr.forEach(function(observableItem) {
        observableItem.fn(that.message);
    });
}


// 观察者
function Observer(name, subject) {
    this.name = name;
    this.fn = undefined;
    subject.attach(this);
}

Observer.prototype.subscribe = function(fn) {
    this.fn = fn;
};

let subject = new Subject();
let observer1 = new Observer('张三', subject);
let observer2 = new Observer('李四', subject);

observer1.subscribe(function(msg) {
    console.log('我是' + this.name + '---' + msg);
});
observer2.subscribe(function(msg) {
    console.log('我是' + this.name + '---' + msg);
});

subject.next('hello world');