const obj = {
  bar: {
    c: '1',
    d: '2'
  },
  get foo() {
    return 47;
  },
  test() {
    console.log(this.bar)
  },
};
const temp = Object.assign({}, obj)

Object.defineProperty(obj, 'bar', {
  get() {
    return temp['bar']
  },
  set(value) {
    temp['bar'] = value+ '123'
  }
})


console.log(obj.bar)
obj.bar = 'xxx'
console.log(obj.bar)