<template>
  <span class="badge" :class="{dot: dot, important: important}">
    <slot></slot>
  </span>
</template>
<script setup>
const props = defineProps({
  dot: Boolean,
  important: Boolean
})
</script>
<style>
.badge {
  display: inline-block;
  background: #646cff;
  color: #fff;
  border-radius: 16px;
  padding: 0.14em 0.9em;
  font-size: 0.97em;
  line-height: 1.5;
}
.badge.dot {
  width: 0.9em; height: 0.9em;
  border-radius: 50%; padding: 0; margin-left: 0.4em;
  background: #ff4444; display: inline-block;
}
.badge.important { background: #e93f3f; }
</style>
