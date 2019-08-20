import Vue from 'vue'
import Vuex from 'vuex'
import { login } from './api/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isShowLoading: false,
    username: ''
  },
  mutations: {
    showLoading(state) {
      state.isShowLoading = true;
    },
    hiddenLoading(state) {
      state.isShowLoading = false;
    },
    setUserName(state, username) {
      state.username = username;
    }
  },
  // 存放接口调用
  actions: {
    async toLogin({commit}, username) {
      let result = await login(username);
      if (result.code === 0) {
        commit('setUserName', username);
      } else {
        return Promise.reject(result.data);
      }
    }
  }
})
