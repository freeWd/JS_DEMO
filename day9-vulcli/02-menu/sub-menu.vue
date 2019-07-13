<template>
    <div class="test">
        <div class="title" @click="isShow = !isShow">
            <slot name="title"></slot>
        </div>
        <template v-if="isShow">
            <slot></slot>
        </template> 
    </div>
</template>

<script>
export default {
    data() {
        return {
            isShow: false
        }
    },
    methods: {
        test() {
            this.isShow = !this.isShow;
        }
    }
}
</script>

<style scoped>
.test {
    margin-left: 23px;
}
.title {
    cursor: pointer;
}
</style>

