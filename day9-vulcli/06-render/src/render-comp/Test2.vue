<template>
    <div>
        <p>This is test2 template</p>
        <List :name="name" :level="level" :render="renderFn"></List>
    </div>
</template>

<script>
import List from './List';

export default {
    components: {
        List
    },
    data() {
        return {
            level: 1,
            name: 'hello world lalala'
        }
    },
    methods: {
        renderFn: (h, name) => {
            return <h1>{ name }</h1>
        }
    }
}
</script>