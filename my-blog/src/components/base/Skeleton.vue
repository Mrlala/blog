<template>
  <div class="skeleton" :style="{width, height}"></div>
</template>
<script setup>
const props = defineProps({ width: String, height: String })
</script>
<style>
.skeleton {
  background: linear-gradient(90deg, #f2f2f2 25%, #e9edff 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  animation: skeleton 1.2s ease-in-out infinite;
  border-radius: 8px;
}
@keyframes skeleton {
  100% { background-position: -400% 0;}
}
</style>
