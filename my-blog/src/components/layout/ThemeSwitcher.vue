<template>
  <div class="theme-switcher">
    <button @click="toggle" :class="{dark: isDark}">{{ isDark ? '🌙 暗色' : '☀️ 浅色' }}</button>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const isDark = ref(false)
function toggle() {
  isDark.value = !isDark.value
  document.body.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}
onMounted(() => {
  // 恢复主题
  isDark.value = document.body.getAttribute('data-theme') === 'dark'
})
</script>
<style>
.theme-switcher button {
  font-size: 1.09em;
  background: #fff;
  color: #4754be;
  border-radius: 7px;
  border: 1.5px solid #eee;
  padding: 0.35em 1.3em;
  cursor: pointer;
}
.theme-switcher button.dark {
  background: #23272e;
  color: #fff;
  border-color: #646cff;
}
</style>
