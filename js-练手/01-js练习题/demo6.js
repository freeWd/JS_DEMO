// 写出下面的结果
let a = 0;
let yideng = async () => {
  console.log(a, "<---1");
  a = a + (await 10);
  console.log(a, "<---2");
};
yideng();
console.log(++a, "<----3");

// 结果：0 '<---1'  1 '<----3'  10 '<---2'
// 这题目主要考察的是同步异步的执行顺序 以及 async await的实现原理
// 方法async中的await是异步调用， await 10 ===> await Promise.resolve(10), 所以确定执行顺序是 1，3，2
// 既然 ++a优先执行，为什么 a + await 10 等于10 而不是11呢，这就涉及到async，await的实现方式了，通过async,await将异步函数写成同步的方式主要是用到了生成器，迭代器的方式，虽然执行上慢半拍，但是数据已经缓存进去了

function* test2(value) {
 yield value;
}
const a = new Promise((resolve, reject) => {
  return resolve(Promise.resolve(10));
})

test2(a).next().value.then(a => console.log(a));

function* test() {
  let a = yield 10;
  let b = yield 20;
  return a + b;
}

let c = test();
console.log(c.next());
console.log(c.next(1));
console.log(c.next(2));
