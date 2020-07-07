// test.js
function ClassDemo(val) {
  this.prop = val
}

var a = new ClassDemo('123')
var b = new ClassDemo('456')

b.prop2 = '789'

console.log('hello world')


console.log(parseInt('0xff', 16))

console.log((0xff).toString(10))


const test = 'hello world'
console.log(Buffer.from(test).toString('base64'))