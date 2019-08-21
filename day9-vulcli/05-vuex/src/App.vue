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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
