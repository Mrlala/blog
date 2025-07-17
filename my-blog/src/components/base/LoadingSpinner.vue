<template>
  <div class="loading-spinner" :style="{width: size+'px', height: size+'px'}"></div>
</template>
<script setup>
const props = defineProps({ size: {type: Number, default: 32}})
</script>
<style>
.loading-spinner {
  border: 4px solid #f2f2f2;
  border-top: 4px solid #646cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: auto;
}
@keyframes spin {
  100% { transform: rotate(360deg); }
}
</style>
