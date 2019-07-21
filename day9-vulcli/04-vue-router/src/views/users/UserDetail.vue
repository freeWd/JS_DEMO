<template>
    <div>
        当前查看到的用户详情
        <p>用户ID: {{ userId }}</p>
        <p>用户Name: {{ userName }}</p>
        <hr>
        <router-link to="/user/list">返回列表</router-link>
    </div>
</template>

<script>
export default {
    computed: {
        userId() {
            return this.$route.params.id;
        },
        userName() {
            return this.$route.query.name;
        }
    }
}
</script>



