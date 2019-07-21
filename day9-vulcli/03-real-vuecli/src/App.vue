<template>
  <div id="app">
    <div class="default-content">
      <img alt="Vue logo" src="./assets/logo.png">
      <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
    <h3 class="pos-content">
      <span>{{ pos1 }}</span> | <span>{{ pos2 }}</span> | <span>{{ pos3 }}</span> | <span>{{ pos4 }}</span>
      <button @click="stopFirstBall()">暂停第一个球</button>
    </h3>
    <div class="scroll-content">
      <!-- 常规的组件交互 :value - 父到子， @input - 子到父 -->
      <ScrollBall color="blue"  :value="pos1" :end="300" @input="refreshPos($event, 'pos1')" ref="ball1">小球1</ScrollBall>

      <!-- 如果一个数据既需要从父到子，也要子到父，就是当前数据在自定义组件中的双向绑定，可以写成 v-model - 上面那种写法的语法糖 -->
      <!-- 支持这种写法的前提：数据名默认为value，自定义方法默认名为input -->
      <!-- tip: 因为子组件中在调用$emit input的时候会将 新value传递过来。它会自动将新vlue搬到到 :value对应的pos2上面去 -->
      <ScrollBall color="black" v-model="pos2" :end="320">小球2</ScrollBall>

      <!-- 真正的双向绑定会带来维护上的问题，因为子组件可以修改父组件，且在父组件和子组件都没有明显的改动来源。 -->
      <!-- vue 2.3更新后 推荐以 update:myPropName 的模式触发事件取而代之 -->
      <ScrollBall color="gray"  :value="pos3" :end="340" @update:value="refreshPos($event, 'pos3')">小球3</ScrollBall>

      <!-- 上面这种写法的简写 - 语法糖 - .sync 修饰符 -->
      <!-- tip: 因为子组件中在调用$emit update.value 新value传递过来。它会自动将新vlue搬到到 :value对应的pos4上面去 -->
      <ScrollBall color="red"  :value.sync="pos4" :end="360">小球4</ScrollBall>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import ScrollBall from './components/ScrollBall.vue'

export default {
  name: 'app',
  data() {
    return {
      pos1: 10,
      pos2: 20,
      pos3: 30,
      pos4: 40 
    }
  },
  methods: {
    refreshPos(value, target) {
      this.$data[target] = value;
    },
    stopFirstBall() {
      this.$refs.ball1.stop();
    }
  },
  components: {
    HelloWorld,
    ScrollBall
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
