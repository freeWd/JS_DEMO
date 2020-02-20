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
};

obj.methods.fn1();

console.log(123);
let p = new Promise(resolve => {
  console.log("xxx");
  resolve(123);
});
p.then(() => {
  console.log(123);
});
console.log(234);

// 发布订阅  a  - 中间者 - b  -  a发布信息 中间商知道 然后通知b
// 中介
class Event {
  constructor() {
    this._arr = [];
  }

  on(fn) {
    this._arr.push(fn);
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
    console.log("读取完毕", data);
  }
});
event.emit("123");
event.emit("123");
event.emit("123");

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
    this.observerList.forEach(observer => {
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
ob1.subscribe(value => {
  console.log(value, "<---111");
});
ob2.subscribe(value => {
  console.log(value, "<---222");
});
sub1.emit("hello");

console.log(process.env.NODE_ENV);

function readFile(url) {
  return new Promise(function(resolve, reject) {
    fs.readFile(url, "utf8", function(error, data) {
      if (err) reject(err);
      resolve(data);
    });
  });
}

readFile("./day1/static/age.txt")
  .then(function(value) {
    console.log(value);
    return readFile("./day1/static/name.txt");
  })
  .then(data => {
    console.log(data);
    return 100;
  })
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.log(err);
    // throw err;
  })
  .then(
    data => {
      console.log(data);
    },
    () => {
      console.log("error");
    }
  );

class Promise {
  constructor(fn) {
    this.value = null;
    this.status = "pending";
    fn(this.resolve, this.reject);
  }

  resolve(value) {
    (() => {
      this.value = value;
      this.status = "resolve";
    })();
  }

  reject(value) {
    (() => {
      this.value = value;
      this.status = "reject";
    })();
  }

  then(resolveFn, rejectFn) {
    if (this.status === "resolve") {
      resolveFn(this.value);
    }
    if (this.status === "reject") {
      rejectFn(this.value);
    }
  }
}

let xx = (resolve, reject) => {
  console.log(this);
  resolve("xxx");
};

let test = new Promise(xx);
test.then(
  result => {
    console.log(result);
  },
  () => {
    console.log(result);
  }
);

const str =
  "public cn.seczone.iast.server.common.json.JsonResult cn.seczone.iast.server.vulnerability.service.impl.VulnerabilityServiceImpl.storyByVulnerabilityId(cn.seczone.iast.server.common.DomainSecurity,java.lang.String) throws java.lang.Exception";
const content = str.replace(/\w+\./g, (...args) => {
  return "";
});
console.log(content);

class Test {
  constructor() {
    this.demoArr = [];
    this.value = null;
  }

  addDemo(demo) {
    this.demoArr.push(demo);
  }

  changeValue(value) {
    this.value = value;
    this.notify();
  }

  notify() {
    this.demoArr.forEach(demoItem => {
      if (demoItem.fn) {
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
demo1.handle(value => {
  console.log(value, "001");
});
demo2.handle(value => {
  console.log(value, "002");
});
test.changeValue("hello world");

function* test() {
  let a1 = yield Promise.resolve("123");
  console.log(a1);
  let a2 = yield Promise.resolve("234");
  console.log(a2);
  return a2;
}

let a = test();
console.log(a.next("a1"));
console.log(a.next("a2"));
console.log(a.next("a3"));

let p1 = new Promise((resolve, reject) => {
  let a = 2;
  if (a / 2 === 1) {
    reject("error-p1");
  } else {
    resolve("success-p1");
  }
});

let p2 = new Promise((resolve, reject) => {
  let a = 2;
  if (a / 2 === 1) {
    reject("error-p2");
  } else {
    resolve("success-p2");
  }
});

async function test2() {
  let a = await p1;
  console.log("a---->", a);
  let b = await p2;
  console.log("b---->", b);
  console.log(a, b);
  return a + b;
}

test2()
  .then(data => {
    console.log(data);
  })
  .catch(data => {
    console.log(data, "error");
  });

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
        done: length++ === that.length
      }
    };
  }
};

var b = new Buffer(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTY2MzUyMDYwLCJleHAiOjE1NjYzNTIwODB9.v_IGmPIIOLaFO3oF6jLGUfop_lrzykoEqYkUvplRFTI",
  "base64"
);
var s = b.toString();
console.log(s);

function test() {
  var a = 1;
  return function() {
    console.log(a);
  };
}

test()();

var p = new Promise(resolve => {
  resolve(123);
});

var a = p.then(value => {
  return value;
});

console.log(a);

var arr = new Array(5);
function insertRandonNum(index) {
  if (index < arr.length) {
    var randomNums = Math.floor(Math.random() * 30 + 2);
    arr[index++] = randomNums;
    insertRandonNum(index);
  }
}
insertRandonNum(0);
console.log(arr);

const arr = [1, 2];
console.log(arr.slice(0, 3));
console.log(arr.splice(3));

class Observer {
  constructor() {
    this.subscriber = [];
    this.data = null;
  }

  next(data) {
    this.data = data;
  }

  addSub(sub) {
    this.subscriber.push(sub);
  }

  emit(data) {
    this.data = data;
    this.subscriber.forEach(subscribeItem => {
      subscribeItem.execute(data);
    });
  }
}

let observer = new Observer();

class Subject {
  constructor(fn) {
    observer.addSub(this);
    this.fn = fn;
  }

  execute(data) {
    console.log(this);
    this.fn(data);
  }
}

const s1 = new Subject(function(data) {
  console.log("a", data, this);
});

const s2 = new Subject(function(data) {
  console.log("b", data, this);
});

observer.emit("123");

LazyMan("Hank");
// Hi! This is Hank!
LazyMan("Hank")
  .sleep(10)
  .eat("dinner");
// Hi! This is Hank!
// 等待10 秒..
// Wake up after 10
// Eat dinner~
LazyMan("Hank")
  .eat("dinner")
  .eat("supper");
// Hi This is Hank!
// Eat dinner~
// Eat supper~
LazyMan("Hank")
  .sleepFirst(5)
  .eat("supper");
// 等待 5 秒
// Wake up after 5
// Hi This is Hank!
// Eat supper

var length = 10;
function fn() {
  console.log(this.length);
}

var obj = {
  length: 5,
  method: function(fn) {
    fn();
    arguments[0]();
  }
};

obj.method(fn, 1);

var yideng = {
  bar: function() {
    return this.baz;
  },
  baz: 1
};

(function() {
  console.log(typeof arguments[0]());
})(yideng.bar);

const timeout = ms =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
const ajax1 = () =>
  timeout(1000).then(() => {
    console.log("1");
    return 1;
  });
const ajax2 = () =>
  timeout(2000).then(() => {
    console.log("1");
    return 1;
  });
const ajax3 = () =>
  timeout(1000).then(() => {
    console.log("1");
    return 1;
  });

const mergePromise = ajaxArr => {
  // const ajaxArr2 = ajaxArr.map((arrItem) => {
  //   return arrItem();
  // })
  // return Promise.all(ajaxArr2);
  return new Promise(resolve => {
    const result = [];
    ajaxArr.map(item => {
      item().then(value => {
        result.push(value);
        if (result.length === ajaxArr.length) {
          resolve(result);
        }
      });
    });
  });
};

mergePromise([ajax1, ajax2, ajax3]).then(data => {
  console.log(data);
});

var arr = Array(3);
arr[0] = 2;
var result = arr.map(function(elem) {
  return "1";
});
console.log(result);

while (1) {
  console.log(Math.random());
  return;
}

var length = 10;
var obj = {
  length: 5,
  method: () => {
    console.log(this.length);
  }
};
console.log(obj.method());

var yi = new Date("2018-08-20"),
  deng = new Date(2018, 08, 20);
console.log(yi, deng);
console.log([yi.getDay() === deng.getDay()]);

for (
  let i = (setTimeout(() => console.log("a ->", i)), 0);
  setTimeout(() => console.log("b ->", i)), i < 2;
  i++
) {
  console.log(i, "<---123");
  i++;
}

for (let index = 0; index < 3; index++) {
  console.log(index);
}

let i = setTimeout(() => console.log("a ->", i));
let i = ("123", "0", 12);
console.log(i);

function test1(arr) {
  arr[0] = arr[1];
}

function test2(a, b, c = 3) {
  c = 10;
  test1(arguments);
  console.log(a + b + c);
}

test2(1, 1, 1);

test();
var flag = true;
if (flag) {
  function test() {
    console.log("123");
  }
} else {
  function test() {
    console.log("234");
  }
}

function test() {
  console.log("123");
}
(function() {
  if (false) {
    function test() {
      console.log("1234");
    }
  }
  test();
})();

var big = "xxx";
var obj = {
  big: "yyy",
  showBig: function() {
    return this.big;
  }
};
console.log(obj.showBig.call(big));

var a = "234";
function test() {
  var a = "123";
  var init = new Function("console.log(a)");
  init();
}
test();

function foo(p1, p2) {
  this.val = p1 + p2;
}

var bar = foo.bind(null, "p1");
var baz = new bar("p2");
console.log(baz.val);

let sum = 0;
function sum1(i) {
  console.log(sum, i);
  sum += i;
  if (i === 1) return sum;
  return sum1(i - 1);
}
console.log(sum1(3));

function sum2(i, total) {
  total += i;
  if (i === 1) return total;
  return sum2(i - 1, total);
}
console.log(sum2(5, 0));

// --------------
console.log(a);
console.log(typeof yideng(a));
var flag = true;
if (!flag) {
  var a = 1;
}
if (flag) {
  function yideng(a) {
    yideng = a;
    console.log("yideng1");
  }
} else {
  function yideng(a) {
    yideng = a;
    console.log("yideng2");
  }
}

var Container = function(x) {
  this._value = x;
};
Container.of = x => new Container(x);
Container.prototype.map = function(f) {};

for (let index = 0; index < 100; index++) {
  console.log(Math.round(Math.random() * 5));
}




function debounce(fn) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn();
    }, 1000);
  }
} 

function option() {
  console.log('xxx');
}

const f = debounce(option);
f();
f();




function test() {
  return new Promise(resolve => {
    resolve('123');
  }).then(() => {
    return Promise.resolve(null);
  });
}
console.log(test());

function* test() {
  let a = yield 3;
  console.log('xxx');
  let b = yield 4;
  return a + b;
}

const a = test();
for (const item of a) {
  console.log(item);
}
console.log(a.next());
console.log(a.next(8));
console.log(a.next(10));


var o = '12';
console.log(/^(0|1)$/.test(o));


const regex = /^([^\s][^\/:\*\?"<>\|][^.])$/;
const regex2 =/^[^\s]+[^\/:\*\?"<>\|]+[^.]$/;
const regex3 = /^[^\s\/:\*\?"<>\|\.]([^\/:\*\?"<>\|])*?[^\/:\*\?"<>\|^\.]*$/
const regex3 = /^([^\s\/:\*\?"<>\|\.]{1}|([^\s\/:\*\?"<>\|\.][^\/:\*\?"<>\|]*[^\/:\*\?"<>\|\.]))$/
console.log(regex3.test('<11'));
console.log(regex3.test('1 23'));
console.log(regex3.test('1.2  34'));
console.log(regex3.test('123.3.'));
console.log(regex3.test('.sdfdsf<'));
console.log(regex3.test(' 123.3'));


let blob = new Blob(['<xx>123</xx>'], {type: 'text/xml'});
let formdata = new FormData();
let reader = new FileReader();
let test = reader.readAsDataURL(blob);
console.log(test);


var arr = [1,2,3];
console.log(arr.join('xxx'));
console.log(arr.concat(1));



function test1(value) {
  return value + 'aaa';
}
function test2(value) {
  return value + 'bbb';
}
function compose(...fn) {
  return function (value) {
    let returnValue = value;
    const arr = [...fn];
    for (let index = 0; index < arr.length; index++) {
      returnValue = arr[index](returnValue);
    }
    return returnValue;
  }
}
function compose2(...fn) {
  return function(value) {
    return [...fn].reduce((preFn, nextFn) => {
      return nextFn(preFn(value));
    });
  }
}

console.log(compose2(test1, test2)('xxx'));



async function test() {
  await setTimeout(() => {
    return 100;
  }, 1000)
}
test().then(val => console.log(val))