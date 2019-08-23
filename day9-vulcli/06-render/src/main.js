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