// ? * / \ < > : " |

console.log(/[^\?\/\\<>:\|"]+\.xml$/.test('sfsdfsf.a'))
console.log(/[^\?\/\\<>:\|"]+\.xml$/.test('sfsdfsf.xm'))
console.log(/[^\?\/\\<>:\|"]+\.xml$/.test('sfsdfsf.xml'))
console.log(/[^\?\/\\<>:\|"]+\.xml$/.test('.xml'))
console.log(/[^\?\/\\<>:\|"]+\.xml$/.test('?.xml'))
console.log(/[^\?\/\\<>:\|"]+\.xml$/.test('\.xml'))
console.log(/[^\?\/\\<>:\|"]+\.xml$/.test('|.xml'))
console.log(/[^\?\/\\<>:\|"]+\.xml$/.test('/.xml'))
console.log(/[^\?\/\\<>:\|"]+\.xml$/.test('..xml'))