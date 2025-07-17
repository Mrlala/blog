<template>
  <div class="tabs">
    <span
      v-for="tab in tabs"
      :key="tab"
      :class="{active: tab === modelValue}"
      @click="$emit('update:modelValue', tab)"
    >{{ tab }}</span>
  </div>
</template>
<script setup>
const props = defineProps({
  tabs: Array,
  modelValue: String
})
</script>
<style>
.tabs { display: flex; gap: 0.7em; margin-bottom: 1.2em; }
.tabs span {
  cursor: pointer; background: #f4f5fa; border-radius: 7px; padding: 0.45em 1.2em; color: #646cff; font-size: 1em;
}
.tabs span.active { background: #646cff; color: #fff; font-weight: bold;}
</style>
