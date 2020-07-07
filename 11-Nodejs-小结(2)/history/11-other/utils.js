const util = require('util')

// util.callbackify(original) 将 async 异步函数（或者一个返回值为 Promise 的函数）
// 转换成遵循异常优先的回调风格的函数
async function fn() {
    return 'hello world'
    // return Promise.reject('reject~~')
}
const callBackFn = util.callbackify(fn)

callBackFn((err, ret) => {
    if (err) throw err
    console.log(ret)
})


//  util.inspect(object,[showHidden],[depth],[colors])  是一个将任意对象转换 为字符串的方法，通常用于调试和错误输出
//  如果 colors 值为 true，输出格式将会以 ANSI 颜色编码，通常用于在终端显示更漂亮 的效果
const obj = {
    a: '123',
    b: '234',
    c: '567'
}
console.log(util.inspect(obj, false, 2, false))


// 基本的数据类型的判断
console.log(util.isArray([1,2,3]))
console.log(util.isDate(new Date()))
console.log(util.isRegExp(/\d/));

