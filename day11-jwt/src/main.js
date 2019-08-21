import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView);

router.beforeEach(async (to, form, next) => {
  const isLogin = await store.dispatch('valideUser');
  const needLogin = to.matched.some(routeItem => routeItem.meta.needLogin);
  if (needLogin) {
    if (isLogin) {
      next();
    } else {
      next('/login');
    }
  } else {
    if (isLogin && to.name === 'login') {
      next('/');
    } else {
      next();
    }
  }
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
