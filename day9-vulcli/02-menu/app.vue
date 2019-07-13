<template>
  <div>
    <Menu>
      <template v-for="(menuItem, index) in menuList">
        <re-sub :key="index" :data="menuItem"></re-sub>
      </template>
    </Menu>
  </div>
</template>

<script>
import Menu from "./menu";
import ReSub from './re-sub';

export default {
  components: {
    Menu,
    ReSub
  },
  data() {
    return {
      menuList: [
        {
          title: "菜单1"
        },
        {
          title: "菜单2"
        },
        {
          title: "菜单3"
        },
        {
          title: "菜单4",
          subChild: [
            {
              title: "菜单4-1"
            },
            {
              title: "菜单4-2"
            },
            {
              title: "菜单4-3",
              subChild: [
                { title: "菜单4-3-1" },
                { title: "菜单4-3-2" },
                { title: "菜单4-3-3" }
              ]
            }
          ]
        }
      ]
    };
  }
};
</script>



