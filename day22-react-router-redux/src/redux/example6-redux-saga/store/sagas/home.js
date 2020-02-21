import { delay, put, takeEvery, takeLatest, call, take } from "redux-saga/effects";
import * as types from "../action-types";

// ====> Sagas 被实现为 Generator functions，它会 yield 对象到 redux-saga middleware。 被 yield 的对象都是一类指令，指令可被 middleware 解释执行。当 middleware 取得一个 yield 后的 Promise，middleware 会暂停 Saga，直到 Promise 完成
//incrementAsync 这个 Saga 会暂停直到 delay 返回的 Promise 被 resolve，这个 Promise 将在 1 秒后 resolve
function* increaseAsync() {
  // 工具函数 delay，这个函数返回一个延迟 1 秒再 resolve 的 Promise 我们将使用这个函数去 block(阻塞) Generator
  // 当 middleware 拿到一个被 Saga yield 的 Effect，它会暂停 Saga，直到 Effect 执行完成，然后 Saga 会再次被恢复
  yield delay(1000);

  // 一旦 Promise 被 resolve，middleware 会恢复 Saga 接着执行，直到遇到下一个 yield
  // 在这里下一个语句是另一个被 yield 的对象：调用 put({type: 'INCREMENT'}) 的结果，意思是告诉 middleware 发起一个 INCREMENT 的 action
  // put 就是我们称作 Effect 的一个例子。Effects 是一些简单 Javascript 对象，包含了要被 middleware 执行的指令
  yield put({ type: types.INCREMENT }); // 类似于但不是 dispatch({type: types.INCREMENT})
}

function* incrementAsync2() {
  try {
    const result = yield call(incrementOpt, 1000);
    console.log(result);
    yield put({ type: types.INCREMENT });
    console.log("操作成功");
  } catch (error) {
    console.log("操作失败");
  }
}

function incrementOpt(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = Math.random();
      if (result > 0.5) {
        resolve(true);
      } else {
        reject(false);
      }
    }, time);
  });
};


export default function* watchIncrementAsync() {
  // ===> takeEvery，用于监听所有的 INCREMENT_ASYNC action，并在 action 被匹配时执行 incrementAsync 任务
  // yield takeEvery(types.INCREMENT_ASYNC, increaseAsync)

  // ===> //只想得到最新那个请求的响应,如果已经有一个任务在执行的时候启动另一个 fetchData ，那之前的这个任务会被自动取消
  yield takeLatest(types.INCREMENT_ASYNC, incrementAsync2);
}


// takeEvery 只是一个在强大的低阶 API 之上构建的 wrapper effect
// take 就像我们更早之前看到的 call 和 put。它创建另一个命令对象，告诉 middleware 等待一个特定的 action
export function* watchIncrementAsync2() {
    //在 takeEvery 的情况中，被调用的任务无法控制何时被调用， 它们将在每次 action 被匹配时一遍又一遍地被调用。并且它们也无法控制何时停止监听
    //在 take 的情况中，控制恰恰相反。与 action 被 推向（pushed） 任务处理函数不同，Saga 是自己主动 拉取（pulling） action 的。 看起来就像是 Saga 在执行一个普通的函数调用 action = getNextAction()，这个函数将在 action 被发起时 resolve
    for (let index = 0; index < 3; index++) {
        const action = yield take(types.INCREMENT_ASYNC);
        console.log(action);
        yield put({type: types.INCREMENT});
    }
    alert('最多点击三次');
}
