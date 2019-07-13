<template>
    <div>
        <menu-item v-if="!data.subChild">{{ data.title }}</menu-item>
        <sub-menu v-else>
            <template #title>
                {{ data.title }}
            </template>
            <template v-for="child in data.subChild">
            <menu-item v-if="!child.subChild" :key="child.title">{{ child.title }}</menu-item>
            <re-sub v-else :key="child.title" :data="child"></re-sub>
            </template>
        </sub-menu>
    </div>
</template>

<script>
import SubMenu from "./sub-menu";
import MenuItem from "./menu-item";

export default {
    name: 'ReSub',
    components: {
        SubMenu,
        MenuItem
    },
    props: {
        data: {
            type: Object,
            defalut: () => {}
        }
    }
};
</script>

