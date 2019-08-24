<template>
    <div>
        <p class="title">Hello Login</p>
        <button @click="login">模拟登陆</button>
        <button @click="logout">模拟退出登录</button>
    </div>
</template>

<script>
export default {
    methods: {
        login() {
            localStorage.setItem('isLogin', 'isLogin');
        },
        logout() {
            localStorage.removeItem('isLogin');
        }
    }
}
</script>