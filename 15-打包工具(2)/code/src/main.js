import foo from './foo.js';
import { version } from './demo.json'

// ==> 第三方库依赖，只引入需要使用的函数, 会进行tree-sharking优化
import { cloneDeep } from 'lodash-es'
console.log(cloneDeep({id: '123'}))

// ===> 第三方库依赖，但是lodash是commonjs的导出，使用插件先将其转化为es module
// import _ from 'lodash'
// console.log(_.cloneDeep({id: '123'}))

const arrowFn = () => {
    console.log('hello world')
}

arrowFn()

export default function () {
  console.log(foo, version);
}