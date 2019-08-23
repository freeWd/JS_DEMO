<template>
    <div class="test">
        <p class="test2" @click="$emit('change', $event)">{{ name }}</p>
        <slot></slot> 
    </div>
</template>

<style>
.test {
    border: 1px solid red;
}
.test2 {
    padding: 10px;
    border: 1px solid blue;
}
</style>


<script>
export default {
    name: 'test',
    props: {
        name: {}
    }
}
</script>

