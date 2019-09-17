<template>
    <div @click="show" class="red">
        bar component
        <h1>{{ $store.state.username }}</h1>
    </div>
</template>

<script>
export default {
    // 写的代码都是异步的，全部采用promsie
    // 规定只有页面级的组件才能使用
    asyncData({store}) { // 异步数据 这个方法在服务端执行，在客户端是不会执行的
        const newValue = 'new demo name';
        return store.dispatch('set_username', newValue);
    },
    // 只在客户单执行，和asyncData逻辑保持一致，确保路由跳转时，vuex state值也保持最新
    mounted() {
        const newValue = 'new demo name';
        this.$store.dispatch('set_username', newValue);
    },
    // vue-meta
    metaInfo: {
      title: 'Bar Page 123'
    },
    methods: {
        show() {
            alert(1);
        }
    }
}
</script>

<style scoped>
    .red {
        background: red;
    }
</style>