import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes';

// 第三方插件 引入后 要使用Vue.use() => install
// install 方法中注册了两个全局组件，router-link, router-view
// 会在每个组件上定义两个属性 $router $route  this.$router, this.$route
// 注意区分这两个属性 $router 里面都是方法   $route里面都是属性
Vue.use(VueRouter);

export default new VueRouter({
    mode: 'hash',
    routes
});