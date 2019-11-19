<template>
  <div>
    <p class="title">Hello Home</p>

    <hr />
    <strong>接收 EventBus</strong>
    <div class="container">
      <div class="show-front">FontCount: {{ fontCount }}</div>
      <div class="show-front">DegValue: {{ degValue }}</div>
      <!-- <IncrementCount />
      <DecreaseCount /> -->
    </div>
  </div>
</template>

<script>
// eventbus包括全局和局部之分，在销毁组件时要异常监听，否则会触发多次
// import IncrementCount from "../../components/IncrementCount";
// import DecreaseCount from "../../components/DecreaseCount";
// import { EventBus } from "../../event-bus";

export default {
  components: {
    // IncrementCount,
    // DecreaseCount
  },
  data() {
    return {
      degValue: 0,
      fontCount: 0
    };
  },
  mounted() {
    // 全局
    this.$bus.$on("incremented", ({ num, deg }) => {
      console.log(num, deg);
      this.fontCount += num;
      this.degValue += deg;
    });
    this.$bus.$on("decreased", ({ num, deg }) => {
      console.log(num, deg);
      this.fontCount -= num;
      this.degValue -= deg;
    });

    // 局部
    // EventBus.$on...
  },
  beforeDestroy() {
    console.log("before desotry");
    this.$bus.$off("decreased", {});
    this.$bus.$off("incremented", {});
  }
};
</script>
