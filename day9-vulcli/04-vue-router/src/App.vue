<template>
  <div id="app">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">管理系统</a>
        </div>
        <ul class="navbar-nav nav">
          <li>
            <router-link :to="{name:'home'}">首页</router-link>
          </li>
          <li>
            <router-link :to="{name:'profile'}">个人中心</router-link>
          </li>
          <li>
            <router-link :to="{path:'/user'}">用户管理</router-link>
          </li>
          <li>
            <router-link :to="{name:'login'}">登录</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
    <router-view name="version"></router-view>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
