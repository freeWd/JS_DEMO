// 所有钩子都提供额外的拦截器API
// 可以拦截钩子注册，钩子触发，和钩子函数的每次执行

const { SyncHook } = require('tapable')

const hook = new SyncHook(['name'])

hook.intercept({
    // call:(...args) => void当你的钩子触发之前,(就是call()之前),就会触发这个函数,你可以访问钩子的参数.多个钩子执行一次
    call: () => {
        console.log('call')
    },
    // tap: (tap: Tap) => void 每个钩子执行之前(多个钩子执行多个),就会触发这个函数
    tap() {
        console.log('tap')
    },
    // 每添加一个tap都会触发 你interceptor上的register,
    // 你下一个拦截器的register 函数得到的参数 取决于你上一个register返回的值,所以你最好返回一个 tap 钩子.
    register: (tapInfo) => {
        console.log('register', tapInfo)
        return tapInfo
    }
})

hook.tap('1', (name) => {
    console.log(1, name)
})

hook.tap('2', (name) => {
    console.log(2, name)
})

hook.call('hello world')


// register { type: 'sync', fn: [Function], name: '1' }
// register { type: 'sync', fn: [Function], name: '2' }
// call
// tap
// 1 'hello world'
// tap
// 2 'hello world'