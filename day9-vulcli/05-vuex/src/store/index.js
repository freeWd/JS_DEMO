import Vue from 'vue';
import vuex from 'vuex';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

import user from './modules/user';

Vue.use(vuex);

export default new vuex.Store({
    modules: {
        user
    },
    strict:process.env.NODE_ENV !== 'production', // 严格模式修改状态只能通过mutation来修改
    actions,
    mutations,
    state,
    getters
})
