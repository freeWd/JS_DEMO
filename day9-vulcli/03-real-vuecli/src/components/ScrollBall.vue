<template>
  <div class="scrollball" :style="bgcolor" :id="ballId" @click="stop">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "red"
    },
    value: {
      type: Number,
      default: 0
    },
    end: {
      type: Number,
      default: 300
    }
  },
  computed: {
    bgcolor() {
      return { background: this.color };
    },
    ballId() {
      return `ball${this._uid}`;
    }
  },
  methods: {
    stop() {
      console.log(this.timer);
      cancelAnimationFrame(this.timer);
    }
  },
  mounted() {
    let fn = () => {
      let left = this.value;
      if (left >= this.end) {
        return cancelAnimationFrame(this.timer);
      }
      this.$emit("input", left + 2);
      this.$emit("update:value", left + 2);
      this.$el.style.transform = `translate(${left}px)`;
      this.timer = requestAnimationFrame(fn);
    };
    this.timer = requestAnimationFrame(fn);
  }
};
</script>

<style scoped>
.scrollball {
  width: 100px;
  height: 100px;
  border-radius: 100px;
  margin: 8px;
  line-height: 100px;
  color: #fff;
  cursor: pointer;
  text-align: center;
}
</style>
