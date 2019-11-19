<template>
  <div>
    <p class="title">Hello Login</p>
    <button @click="login">模拟登陆</button>
    <button @click="logout">模拟退出登录</button>

    <hr>
     <IncrementCount />
    <DecreaseCount />
  </div>
</template>

<script>
import IncrementCount from "../components/IncrementCount";
import DecreaseCount from "../components/DecreaseCount";

export default {
  components: {
    IncrementCount,
    DecreaseCount
  },
  methods: {
    login() {
      localStorage.setItem("isLogin", "isLogin");
    },
    logout() {
      localStorage.removeItem("isLogin");
    }
  }
};
</script>
