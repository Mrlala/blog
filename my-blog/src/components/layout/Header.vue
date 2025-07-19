<template>
  <header class="header">
    <div class="container">
      <h1 class="logo">My Blog</h1>
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
        <router-link to="/archives" class="nav-link">归档</router-link>
        <router-link to="/contact" class="nav-link">联系</router-link>
      </nav>
      <ThemeSwitcher />
    </div>
  </header>
</template>

<!-- ...你的原有样式可保持不变... -->


<script setup>
import { ref, computed } from 'vue'
import themeOverrides, { themeNames } from '@/theme/theme-overrides.js'
import ThemeSwitcher from '@/components/layout/ThemeSwitcher.vue'

// 当前主题名
const theme = ref(localStorage.getItem('naive-theme') || 'light')

// 动态生成所有主题下拉
const themeOptions = computed(() =>
  Object.keys(themeOverrides).map(key => ({
    label: themeNames[key] || key,
    value: key
  }))
)
const themeLabel = computed(
  () => themeOptions.value.find(t => t.value === theme.value)?.label ?? ''
)
function handleThemeChange(val) {
  theme.value = val
  localStorage.setItem('naive-theme', val)
  window.dispatchEvent(new CustomEvent('naive-theme-change', { detail: val }))
}
</script>

<style scoped>
.header {
  background: var(--header-bg-color, #fff);
  color: var(--header-text-color, #1e293b);
  padding: 0.9rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgb(0 0 0 / 0.07);
  position: sticky;
  top: 0;
  z-index: 999;
  transition: background 0.32s, color 0.32s;
}
.container {
  max-width: 1200px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.logo {
  font-weight: 900;
  font-size: 1.8rem;
  user-select: none;
  flex-shrink: 0;
}
.nav {
  display: flex;
  gap: 1.2rem;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
}
.nav-link {
  color: inherit;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  transition: background-color 0.25s, color 0.25s;
}
.nav-link:hover,
.nav-link:focus {
  background: var(--header-text-color, #2563eb);
  color: var(--header-bg-color, #fff);
  outline: none;
}
.theme-select {
  min-width: 100px;
  flex-shrink: 0;
}
</style>
