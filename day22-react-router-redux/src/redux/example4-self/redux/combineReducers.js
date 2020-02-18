export default function combineReducers(reducerObj) {
   const reducerKeys = Object.keys(reducerObj);
   return function combination(state={}, action) {
        const nextState = {};
        for (let index = 0; index < reducerKeys.length; index++) {
            const key = reducerKeys[index];
            const reducer = reducerObj[key];
            nextState[key] = reducer(state[key], action);
        }
        return nextState;
   }
}