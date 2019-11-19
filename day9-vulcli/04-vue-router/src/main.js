import Vue from 'vue'
import App from './App.vue'

import router from './router';
import 'bootstrap/dist/css/bootstrap.css'
import './assets/common.css'

import './event-bus';

Vue.config.productionTip = false


// 全局的路由生命周期控制

// 1 每次路由跳转进下一个组件之前触发
router.beforeEach((to, from, next) => {
  // eslint-disable-next-line no-console
  console.log('all');
  let needLogin = to.matched.some(match => match.meta && match.meta.needLogin);
  let isLogin = localStorage.getItem('isLogin');
  if (needLogin) {
    if (isLogin) {
      next();
    } else {
      // eslint-disable-next-line no-console
      console.log('yyy');
      next('/login');
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('xxx', to.path);
    next();
  }
});

// 2 当前路由解析后会跳转的钩子
router.beforeResolve((to, from, next) => {
  // eslint-disable-next-line no-console
  console.log('resolve');
  next();
});

// 3 每次路由跳转进下一个组件之后触发
// eslint-disable-next-line no-unused-vars
router.afterEach((to, from) => {
  // eslint-disable-next-line no-console
  console.log('after');
  // 这个地方不需要next这样的继续往下走方法的执行、next is not a function
});



new Vue({
  router, // 在实例中引入路由
  render: h => h(App),
}).$mount('#app')
