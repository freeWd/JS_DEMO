const { pathToFileURL } = require("url");

var a = 10;
var b = 20;


function test(obj) {
  obj.test();
  obj.test2();
}

test({
  test: () => {
    console.log(this)
  },
  test2() {
    console.log(this)
  },
  a: 20
})


console.log(/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/.test('10.'))


console.log(/[a-zA-Z0-9]{32}/.test("8ca9732f5e884b0f87e21aae19360b9f"))



const path = require('path')
console.log(path.join('./test2', '/1.txt'))
console.log(path.resolve(".test2", "/1.txt"))