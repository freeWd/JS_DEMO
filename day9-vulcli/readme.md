> 禁庭春昼，莺羽披新绣。百草巧求花下斗，只赌珠玑满斗。日晚却理残妆，御前闲舞霓裳。谁道腰肢窈窕，折旋笑得君王。 - 李白

* 01-demo.vue简单的展示了下在.vue的文件中如何编写代码
* 02-menu则是自定义了菜单组件并展示，这个自定义的菜单组件展示了面对可能无限向下纵深的层层子菜单。如何通过递归的方式将这些菜单信息较好的展示出来
* 03-real-vuecli 就是利用vue-cli真正搭建的一个vue小项目 主要展示了vue.config.js中一些配置的用法
* 04-vue-router 展示了vue中路由的用法
* 05-vuex 展示了vuex的用法
* 06-render展示了脚手架中的mian.js中render函数的概念 - 主要内容在其main.js处


## vue-cli初体验
之前都是用script引入vue.js来写vue,那个vue最初级的用法，目的是为了快速的用上vue,熟悉vue的语法。
但用在正式的项目中不是特别高效。现在我们尝试用vue-cli来写vue项目

```sh
# 全局安装 vue/cli 和 vue-cli-service
sudo npm install @vue/cli -g
sudo npm install -g @vue/cli-service-global
```

编写vue代码，新建文件.vue， 里面分三部分：
1. template - html
2. script - js
3. style - css

执行：
```sh
vue serve filename.vue
# 针对 filename.vue启动一个server, 在浏览器可以直接看到当前页面内容
# vue serve 01-demo.vue
```

**尝试写一个小组件**  
此处和vue-cli用法关系不大，但却是用vue-cli来构建了一个通用的组件，这个组件是一个循环嵌套的组件：根据提供的数据，动态生成菜单栏，菜单栏可以无限嵌套，具体情况有数据来驱动

构建这种组件需要先考虑清楚组件之间的组织&数据接口
下面是简陋的写法，更全面正确的写法在**02-menu**文件夹下面
```html
<template>
  <div>
    <ul>
      <li v-for="(menuItem, index) in menuList" :key="index">
        <template v-if="!menuItem.subChild">
          <span>{{ menuItem.title }}</span>
        </template>
        <template v-else>
          <span>{{ menuItem.title }}</span>
          <Menu :menuList="menuItem.subChild"></Menu>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Menu",
  props: {
    test: {
      type: String,
      default: "123"
    },
    menuList: {
      type: Array,
      // 动态菜单栏数据结构
      default: () => [
        {
          title: "菜单1"
        },
        {
          title: "菜单2"
        },
        {
          title: "菜单3"
        },
        {
          title: "菜单4",
          subChild: [
            {
              title: "菜单4-1"
            },
            {
              title: "菜单4-2"
            },
            {
              title: "菜单4-3",
              subChild: [
                { title: "菜单4-3-1" },
                { title: "菜单4-3-2" },
                { title: "菜单4-3-3" }
              ]
            }
          ]
        }
      ]
    }
  }
};
</script>
```


## vue-cli 自定义配置
对应03-real-vuecli

利用cli创建一个完整的vue项目：
```sh
vue create '项目名称'
# 或者使用vue ui - GUI界面选择创建
```
自定义打包和运行配置：
**vue-config.js  - 基于node**

注意：node不支持import语法。
我们先来看看创建出来的项目常用到的配置：
```js
let path = require('path')
module.exports = {
    /**
     * 发布路径 - 部署应用包时的基本 URL
     * Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/。
     * 默认使用 vue-cli-service build就是产线环境。 打包后的index.html上关于路径的引用的链接都会加上/vue-project路径
     * /
    publicPath:process.env.NODE_ENV === 'production'? '/vue-project':'/',

    // 输出路径 - 默认是dist
    outputDir:'myassets', 

    // 生成静态目录的文件夹 - 默认打包后dist的文件夹下就是js,img,css。 使用assetsDir后就移植static文件夹下面
    assetsDir:'static',

     // 是否可以使用template模板
     // 我们可以看下main.js - new Vue是通过render函数将App导入进来的。 如果某些情况下我们就是想要template来渲染而不是render函数，就会报异常。因为默认启动server使用runtion-only build。模板不可以，下面参数为true可以使得模板可用，但会增加100k
    runtimeCompiler: true,

    // 多余1核cpu时 启动并行压缩。 - 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
    parallel:require('os').cpus().length > 1,

    //生产环境下 不使用soruceMap。 
    //默认打包后的代码js文件夹下面每一个js文件都对应一个map映射文件。配置后生产环境打包不生产map文件
    productionSourceMap:false,

    // https://github.com/neutrinojs/webpack-chain
    // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。 - 注意和下面configureWebpack的区别，一个是修改一个是新增
    chainWebpack:config=>{
        // 控制webpack内部配置，再增加一些自己的逻辑
        // 下面是配置目录别名 
        config.resolve.alias.set('component',path.resolve(__dirname,'src/components'));

    },

    // https://github.com/survivejs/webpack-merge
    // 在原来webpack基础上新增一些新功能。 将你在此处的配置与内部的webpack配置做一个合并
    configureWebpack:{
        // 新增插件等
        plugins:[],
        module: {

        }
    },

    devServer:{ // 配置代理
        proxy:{
            '/api':{
                target:'http://a.zf.cn:3000',
                changeOrigin:true
            }
        }
    },

    // 第三方插件配置
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                // 插入全局样式
                path.resolve(__dirname,'src/assets/common.less'), 
            ],
        }
    }
}
```

## Vue 路由功能
**Vue路由实例介绍**
```js
// 从代码的规范性来说，我们会专门新建一个router文件夹在此处添加router信息
// 路由时如何工作的？
// 在router文件夹中 routes.js文件是专门处理路由的 配置影射关系

// -- router/router.js
import Home from '_views/home/Home.vue';
import Version from '_views/home/Version.vue';
// 路由的映射文件就是一个对象，将路由url和对应的组件关联起来，访问对应的url就显示关联的组件
export default [
    {
        path: '',
        redirect: { name: 'home' }
    }, 
    {
        path: '/home',
        // 可以加name用于标记路由
        name: 'home',
        // 一个路由还能映射不同的组件？当然了，怎么关联了。后面再看
        // 如果只有一个组件： component: Home
        components: {
            default: Home,
            version: Version
        }
    },
    // 后面是有vue路由懒加载 - 默认情况下只显示首页，其他页面点击才加载
    {
        path: '/login',
        name: 'login',
        component: () => import('_views/Login.vue')
    },
    {
        path: '/user',
        name: 'user',
        component: () => import('_views/users/User.vue'),
        // 路由元信息的传递
        meta: {needLogin: true},
        children: [
            {
                path: '',
                redirect: { name: 'userList' }
            },
            {
                path: 'list',
                name: 'userList',
                component: () => import('_views/users/UserList.vue')
            },
            // 路由参数传递
            {
                // 路径参数 必须通过id跳转
                path: 'detail/:id',
                name: 'userDetail',
                component: () => import('_views/users/UserDetail.vue')
            }
        ]
    },
    {
        // 正则，匹配上面所有没匹配到的url
        path: '*',
        component: () => import('_views/404.vue')
    }
]

// -- router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
// 第三方插件 VueRouter引入后 要使用Vue.use() => install
// install 方法中注册了两个全局组件，router-link, router-view
// 会在每个组件上定义两个属性 $router $route  this.$router, this.$route
// 注意区分这两个属性 $router 里面都是方法   $route里面都是属性
Vue.use(VueRouter);

export default new VueRouter({
    mode: 'hash',
    routes
});


// -- main.js
// VueRouter已经在router/index中安装，此处导入new Vue中将路由信息全部配置到vue里面
import router from './router/index';

new Vue({
  router, // 在实例中引入路由
  render: h => h(App),
}).$mount('#app')
```
如上面描述一个完整的路由逻辑就出来了
> 大概的思路是：安装VueRouter 同时将配置的url和组件的映射导入进去，在安装完成的VueRouter在Vue中声明。

主要用到路由的知识点：
* 每个路由除了标记url和对应的组件之外还可以定一个name属性，相当于当前映射的别名
* 注意懒加载路由的写法： component: () => import('_views/users/UserDetail.vue')
* 路由连接执行有两部分组成
```html
// 有对应的链接
// 父路径跳转必须使用路径跳转不能使用name, 不然不显示默认子路径
// 比如 user组件默认redirect到用户列表组件，如果访问user时用name而不是path, 就不会有自动redirect的效果了。如下，所以访问 user用的是path
// -- app.vue
<router-link :to="{name:'home'}">首页</router-link>
<router-link :to="{path:'/user'}">用户管理</router-link>
// link传递参数
// -- user.vue 
<router-link :to="{ name: 'userDetail', params: {id: '001'}, query: {name: '王小虎'}}">用户一</router-link>

// 有对应的路由视图
// 点击对应的link，其url对应的组件会替换路由视图的标签显示。
// 一般情况下一个模板文件中只需要一个router-view，但也只是多个，如果是多个，除了默认的router-view, 其他的需要带上属性name，配合router.js文件，默认加载对应的组件，下面的两个路由视图可以对应一个路由映射不同的组件的情况
<router-view></router-view>
<router-view name="version"></router-view>
```
* 路由元信息的传递
每个路由匹配是，除了path,name还可以传递自定义的一些信息，这些信息存在在meta属性里面，称为元信息
```js
// 路由元信息的传递
meta: {needLogin: true},
```

**完整的路由的生命周期解析流程**
1. 导航被触发。
2. 在失活的组件里调用离开守卫beforeRouteLeave。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

在上面的路由的生命周期是需要理解+记忆的，它同组件的生命周期一样重要。  
在路由的跳转周期里面，引入了路由守卫的概念  
路由守卫一共有下面几种
* 全局路由守卫
    * beforeEach - 全局前置守卫
    ```js
    // to: Route: 即将要进入的目标 路由对象
    // from: Route: 当前导航正要离开的路由
    // next: Function: 一定要调用该方法来 resolve 这个钩子
    // --- next(): 进行管道中的下一个钩子
    // --- next(false): 中断当前的导航
    // --- next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 next 传递任意位置对象
    // --- next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回
    router.beforeEach((to, from, next) => {
    // ...
    // next()
    })
    ```
    * beforeResolve - 全局解析守卫
    ```js
    router.beforeResolve((to, from, next) => {
        console.log('resolve');
        next();
    });
    ```
    * afterEach - 全局后置钩子
    ```js
    // 这个地方不需要next这样的继续往下走方法的执行、next is not a function
    router.afterEach((to, from) => {
        // ...
    })
    ```
* 组件路由守卫
    * beforeRouteEnter 
    ```js
    beforeRouteEnter (to, from, next) {
        // 在渲染该组件的对应路由被 confirm 前调用
        // 不！能！获取组件实例 `this`
        // 因为当守卫执行前，组件实例还没被创建
        next(vm => {
             //因为当钩子执行前，组件实例还没被创建
            // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
            // eslint-disable-next-line no-console
            console.log(vm); // 组件渲染完毕后会调用当前的beforeRouteEnter方法
        });
    },
    ```
    * beforeRouteUpdate
    ```js
    beforeRouteUpdate (to, from, next) {
        // 在当前路由改变，但是该组件被复用时调用
        // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
        // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`
        this.name = to.params.name
        next()
    }
    ```
    * beforeRouteLeave
    ```js
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
        if (answer) {
            next()
        } else {
            next(false)
        }
    }
    ```
* 路由配置文件守卫 - 路由独享守卫
    * beforeEnter
    ```js
    routes: [
        {
            path: '/foo',
            component: Foo,
            beforeEnter: (to, from, next) => {
                // ...
                // next()
            }
        }
    ]
    ```

## Vuex
**Vuex流程**

https://vuex.vuejs.org/zh/

![image](/static/vuex.png)

vuex的内容存储在新建的文件夹store中, 图片中的vuex的状态和行为，依次创建不同的文件

* state类比组件中的状态
* getters类比组件中的计算属性
* mutation突变，唯一修改状态的方式
* actions就是用来处理异步的请求，异步更新状态

**Vuex实践**
它的引入和router的引入类似。从规范角度而言建议构建文件夹专门存放vuex的相关内容
```js
// 引入vuex, 通过Vue.use() => install安装vuex。导入Vuex实例
// 路由安装会在每个组件定义两个属性 $router $route，而vuex会在每个组件定义$store
// -- store/index.js
import Vue from 'vue';
import vuex from 'vuex';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

import user from './modules/user';

Vue.use(vuex);

// 这地方注意vuex.Store实例中传递的对象和上面图片vuex概念之间的联系
export default new vuex.Store({
    modules: {
        // 在体量大的情况下需要模块化，每个模块底下都有独立的state, getters, actions, mutations
        user
    },
    strict:process.env.NODE_ENV !== 'production', // 严格模式修改状态只能通过mutation来修改
    actions, // 存放同步修改state值的方法
    mutations, // 存放异步修改state值的方法
    state, // 存在变量
    getters // 存放类似计算属性的函数
})

// -- store/user.js
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


// 在mian.js 中引入Vuex实例，并在new Vue是声明
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 引入vuex.Store实例
import store from './store';

new Vue({
  render: h => h(App),
  // 声明store
  store
}).$mount('#app')
```

具体的使用
```html
// -- App.vue - 具体的使用
// 获取state，getter中的值
<template>
  <div id="app">
      <!-- eg1: 这样写可以获取到vuex中的值，但是很难看，尤其是子级越来越多的情况下，耦合度会很高。 -->
      <p>{{ $store.state.lesson }}</p>
      <p>{{ $store.getters.getNewName }}</p>

      <!-- eg2: 可以通过计算属性获取store中的值，简化在模板中的多级对象选择 -->
      <p>{{ getNewName }}</p>

      <!-- eg3: 通过设置构建 eg2: -->
      <p>{{ lesson }}</p>
      <p>{{ userName }}</p>
      <p>{{ u }}</p>

      <p>{{ getNewName }}</p>
      <p>{{ getUserName }}</p>

      <button @click="change">change user name</button>
      <button @click="change2">async change user name</button>
  </div>
</template>

<script>
// 总结
// 1 如果我们在mainjs中注入了store，那么每个组件实例中都会存在一个属性 $store
// 2 在vue中如果想使用模块，最好使用辅助的方法，限制模块的作用域
// 3 如果直接修改状态可以commit, mapMutations
// 4 如果异步修改状态 可以dispatch, mapActions
// 5 getters类比组件中的计算属性 如果获取的state的值要做一些简单处理显示给用户，通过getter内的函数来调用

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  name: 'app',
  computed: {
    getNewName() {
      return '当前课程：' + this.$store.state.lesson;
    },
    // 通过map构建的对象，可以直接获取到，看eg3
    ...mapState(['lesson', 'userName']), // 获取根模块底下的数据
    ...mapState('user', ['userName']), // 获取某个模块（user模块）下面的数据（userName）
    ...mapState('user', {u: (state) => state.userName}), // 如果要改名字需要通过对象的方式传递参数

    ...mapGetters(['getNewName']), 
    ...mapGetters('user', ['getUserName']),
  },
  methods: {
    ...mapMutations('user', ['change_user']),
    change() {
      // 下面两种方式都可以
      this['change_user']('new name')
      // this.$store.commit('user/change_user', 'new_name');
    },
    ...mapActions('user', ['change_user2']),
    change2() {
      this['change_user2']('async new name').then(msg => {
        console.log(msg);
      });
      // this.$store.dispatch('user/change_user2', 'async new name');
    }
  }
}
</script>
```


## Render函数
**什么是render函数**
注意main.js中的new Vue
```js
new Vue({
  render: h => h(App),
  store
}).$mount('#app')
```
render用来渲染组件内容的函数  

**render函数的实践**
```js
// main.js
import Vue from 'vue'
import App from './App.vue'
import Test from './components/Test.vue'

Vue.config.productionTip = false


// Vue 推荐在绝大多数情况下使用模板来创建你的 HTML。
// 然而在一些场景中，你真的需要 JavaScript 的完全编程的能力。这时你可以用渲染函数，它比模板更接近编译器。

// 在生成的默认的vue-cli实例中。将app.vue引入，通过render函数加载app.vue(根组件)
// render渲染函数用法：
// - 01 第一个参数标签
// - 02 第一个参数属性，事件等：attrs,style,props,on,nativeOn,class,directives,slot,key,ref,domProps
// - 03 第一个参数是内容


// render函数和虚拟dom jsx的更多内容 查看官方文档
// https://cn.vuejs.org/v2/guide/render-function.html#ad


Vue.component('MyTitle', {
  props: {
    level: {},
  },
  render: function(createElement) {
    return createElement(
      'h' + this.level, // 标签名称
      this.$slots.default // 子节点数组
    )
  }
})

new Vue({
  // 默认的渲染函数写法
  render: h => h(App),

  // 渲染dom元素的写法
  // render: h => h('div', {
  //   class: 'test',
  //   attrs: {
  //     id: 1,
  //   },
  //   style: {
  //     color: 'red',
  //     cursor: 'pointer'
  //   },
  //   on: {
  //     click() {
  //       alert(1)
  //     }
  //   }
  // }, 'hello world')

  // 渲染组件
  // render: h => h(Test, {
  //   props: {
  //     name: 'zf'
  //   },
  //   on: {
  //     change(e) {
  //       e.stopPropagation();
  //       alert('123')
  //     }
  //   },
  //   nativeOn: {
  //     click() {
  //       alert(1);
  //     }
  //   }
  // }, 'hello world')

  // 用render函数渲染的优势
  // vue官网上举了一个很直接的案例，比如我们展示的内容的标签需要根据props传递过来的值动态渲染。
  // props： level = 1 ==> 渲染 <h1>标签，依次类推知道 level=6 ==> 渲染 <h6>标签
  // 如果我们任然用.vue的模板的写法，需要再模板中多次使用 v-if v-else-if 判断，但是如果用render就很方便
  // render: h => h('MyTitle', {
  //   props: {
  //     level: 3,
  //   }
  // }, 'My Title')

  // 在 Vue 中使用 JSX 尝试书写MyTitle语法，它可以让我们回到更接近于模板的语法上
  // render: h => {
  //   return <MyTitle level="1">My Title</MyTitle>
  // }


}).$mount('#app')
```

上面展示了render函数的多种写法，包括模板，渲染dom, 渲染自定义组件，jsx写法。
这些只能是皮毛级别的入门内容，更多的还需要查看官方文档
https://cn.vuejs.org/v2/guide/render-function.html#ad  
看看render函数的全面用法，以及jsx和虚拟dom的相关内容






