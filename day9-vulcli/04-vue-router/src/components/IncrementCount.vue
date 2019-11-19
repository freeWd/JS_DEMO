<!-- DecreaseCount.vue -->
<template>
  <button @click="decrease()">-</button>
</template>

<script>
// import { EventBus } from "../event-bus";
export default {
  name: "IncrementCount",
  data() {
    return {
      num: 1,
      deg: 180
    };
  },
  methods: {
    decrease() {
      this.$bus.$emit("incremented", {
        num: this.num,
        deg: this.deg
      });
    }
  }
};
</script>
