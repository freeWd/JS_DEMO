<template>
    <!-- 提供id=app 使得服务端渲染导入的 client.js 对应的vue的特性生效 -->
    <div id="app">
        <Bar></Bar>
        <Foo></Foo>
        hello world
    </div>
</template>

<script>
import Bar from './component/Bar.vue';
import Foo from './component/Foo.vue';

export default {
    components: {
        Bar,
        Foo
    }    
}
</script>