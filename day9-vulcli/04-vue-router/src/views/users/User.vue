<template>
  <div>
    <p class="title">Hello This is User Page</p>
    <div class="col-md-3">
      <ul class="nav nav-pills nav-stacked">
        <li role="presentation">
          <router-link to="/user/list">用户管理</router-link>
        </li>
        <li role="presentation">
          <router-link to="/user/add">添加用户</router-link>
        </li>
      </ul>
    </div>
    <div class="col-md-9">
        <router-view></router-view>
    </div>
  </div>
</template>

