<template>
    <div @click="show" class="red">
        bar component
    </div>
</template>

<script>
export default {
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