<template>
    <div>
        <h1>Hello {{ msg }}</h1>
        <ul class="test">
            <li>test1</li>
            <li>test1</li>
            <li>test1</li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {msg: 'hello world'}
    }
}
</script>

<style>
    .test > li {
        float: left;  
        list-style: none;
    }
</style>


