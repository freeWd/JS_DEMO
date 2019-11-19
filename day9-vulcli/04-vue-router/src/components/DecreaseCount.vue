<template>
  <button @click="increment()">+</button>
</template>

<script>
// import { EventBus } from "../event-bus";
export default {
  name: "DecreaseCount",
  data() {
    return {
      num: 1,
      deg: 180
    };
  },
  methods: {
    increment() {
      this.$bus.$emit("decreased", {
        num: this.num,
        deg: this.deg
      });
    }
  }
};
</script>
