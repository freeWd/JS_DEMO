<template>
    <div>
        <Bar></Bar>
        <Foo></Foo>
    </div>
</template>

<script>
import Bar from './component/Bar';
import Foo from './component/Foo';

export default {
    components: {
        Bar,
        Foo
    }    
}
</script>