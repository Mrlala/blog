<template>
  <div class="custom-font-size">
    字号
    <button v-for="s in sizes" :key="s" :class="{active: s===modelValue}"
      @click="$emit('update:modelValue', s)">
      {{ s }}
    </button>
  </div>
</template>
<script setup>
const props = defineProps({ modelValue: Number })
const sizes = [14, 16, 18, 20, 22]
</script>
<style>
.custom-font-size { display: inline-flex; gap: 0.5em; align-items: center; }
.custom-font-size button {
  border: none; border-radius: 5px;
  background: #f4f6fb;
  color: #555;
  padding: 0.25em 0.8em;
  font-size: 1em;
  cursor: pointer;
}
.custom-font-size button.active {
  background: #646cff;
  color: #fff;
}
</style>
