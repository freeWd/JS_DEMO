import { createStore } from 'redux';
import reducers from './reducers';

let store = createStore(reducers);

//挂载到window上为了方便调试 上线要删掉
window.store = store; 

export default store;