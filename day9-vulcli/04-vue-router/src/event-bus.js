// lib/bus.js
// eventbus有全局和局部之分

// 全局eventBus 如下，同时eventbus还要导入的main文件中
import Vue from 'vue';
let $bus = new Vue();
Vue.prototype.$bus = $bus;

// 局部调用的eventBus如下，不需要导入到mian文件, 但在使用到eventbus组件的地方需要引入当前文件
// import Vue from 'vue';
//  export const EventBus = new Vue();