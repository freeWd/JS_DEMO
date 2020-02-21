import { all } from 'redux-saga/effects'

import homeSagaWatch from './home'
import { watchIncrementAsync2 } from './home';

import loginSagaWatch from './login';

export default function* rootSagas() {
    //这个 Saga yield 了一个数组，值是调用 多个 Saga  监听函数的结果。意思是说这多个 Generators 将会同时启动
    yield all([homeSagaWatch(), loginSagaWatch()])
    // yield all([watchIncrementAsync2()])
}