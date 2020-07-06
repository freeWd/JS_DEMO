// test.js
function ClassDemo(val) {
  this.prop = val
}

var a = new ClassDemo('123')
var b = new ClassDemo('456')

console.log(%HaveSameMap(a,b))

b.prop2 = '789'
console.log(%HaveSameMap(a,b))