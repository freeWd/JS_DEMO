<template>
    <!-- 提供id=app 使得服务端渲染导入的 client.js 对应的vue的特性生效 -->
    <div id="app">
        <button>
            <router-link to="/">去 Bar</router-link>
        </button>
        <button>
            <router-link to="/foo">去 Foo</router-link>
        </button>
        <p>hello world</p>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
  
}
</script>