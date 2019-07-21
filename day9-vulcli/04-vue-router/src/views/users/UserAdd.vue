<template>
    <div>
        添加用户页面
        <input type="text" v-model="username">
        <p>{{ username }}</p>
        <button @click="toUserList">前往列表页面</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: null
        }
    },
    methods: {
        toUserList() {
            this.$router.push('/user/list');
        }
    },
    // 路由的钩子函数 - 在进入当前路由之前触发
    beforeRouteEnter(to, from, next) {
        // 此方法中无法获取到this
        if (from.name === 'userList') {
            // eslint-disable-next-line no-console
            console.log('从用户列表页面过来的');
        }
        next(vm => {
             //因为当钩子执行前，组件实例还没被创建
            // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
            // eslint-disable-next-line no-console
            console.log(vm); // 组件渲染完毕后会调用当前的beforeRouteEnter方法
        });
    },
    // 路由的钩子函数 - 在路由更新时触发
    beforeRouteUpdate(to, from, next) {
        //在当前路由改变，但是该组件被复用时调用
        //对于一个带有动态参数的路径 /good/:id，在 /good/1 和 /good/2 之间跳转的时候 或者查询？参数变化，
        // 由于会渲染同样的good组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`
        alert(1);
        next();
    },
    // 路由的钩子函数 - 在离开当前路由触发
    beforeRouteLeave(to, from, next) {
        if (this.username) {
            let confirm = window.confirm('是否要离开');
            if (confirm) {
                next();
            }
        } else {
            next();
        }
    }
}
</script>

