import { createStore, applyMiddleware } from "redux";
import counterReduces from "./reducers/counter";

// 常用的第三方库中间件
import thunk from "redux-thunk"; // 异步dispatch
import promiseMiddleware from "redux-promise"; // dispatch promise
import { persistStore, persistReducer } from "redux-persist"; // 持久化 store数据，刷新浏览器时将数据存储在浏览器的localStorage中
import storage from "redux-persist/lib/storage";

// 基本的store
// const store = createStore(counterReduces);


// ---- redux-persist
const persistConfig = {
  key: "root",
  storage
};
const persistedReducer = persistReducer(persistConfig, counterReduces)

const store = createStore(
    persistedReducer,
    applyMiddleware(promiseMiddleware, thunk)
);

export const persistor = persistStore(store)
export default store
