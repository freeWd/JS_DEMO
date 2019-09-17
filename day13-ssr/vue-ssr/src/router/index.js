import Vue from 'vue';
import VueRouter from 'vue-router';
import Meta from 'vue-meta'

// import Foo from '../component/Foo.vue';
import Bar from '../component/Bar.vue';
const Foo = process.BROWSER  ? () => import('../component/Foo.vue') : require('../component/Foo.vue')

Vue.use(VueRouter);
Vue.use(Meta);

export default () => {
    return new VueRouter({
        mode: 'history',
        routes: [
            { path: '/', component: Bar },
            { path: '/foo', component: Foo },
            // { path: '/foo', component: () => import('../component/Foo.vue') },
        ]
    });
}