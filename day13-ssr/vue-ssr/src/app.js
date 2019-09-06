import Vue from 'vue';
import App from './App.vue';

// 为了兼容服务端 要将这个方法改造成一个新函数 - 服务端中每个用户访问都要单独的new一个实例出来 而不能只用一个实例（单例）
// 前端之所以可以先在这么写，是因为前端是天然分布式的，每个电脑 每个浏览器的每个tab都是相互独立的
// let vm = new Vue({
//     el: '#app',
//     render: (h) => h(App)
// });


// 适用于服务端的新函数，不需要挂载
export default () => {
    let  app = new Vue({
        render: (h) => h(App)
    });
    return {app};
}

