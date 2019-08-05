export default {
    // 开启命名空间 让他变成模块
    namespaced: true,
    state: {
        userName: '我是共产主义接班人'
    },
    getters: {
        getUserName(state) {
            return "nb~" + state.userName
        }
    },
    mutations: {
        // 同步修改state
        change_user(state, payload) {
            state.userName = payload;
        }
    },
    actions: {
        // 异步修改state
        change_user2({
            commit
        }, payload) {
            setTimeout(() => {
                commit('change_user', payload);
            }, 1000)
        }
    }
}