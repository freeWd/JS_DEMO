import Vue from 'vue'
import Vuex from 'vuex'
import { login, valideUser } from './api/user'
import { setLocal } from './libs/storage';

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
        setLocal('token', result.token);
        commit('setUserName', username);
      } else {
        return Promise.reject(result.data);
      }
    },
    async valideUser({commit}) {
      let result = await valideUser();
      if (result.code === 0) {
        setLocal('token', result.token);
        commit('setUserName', result.username);
        return true;
      }
      return false;
    }
  }
})
