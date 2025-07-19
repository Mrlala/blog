<script setup>
import { ref, onMounted, onUnmounted, computed, watchEffect } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'
import themeOverrides, { themeNames } from '@/theme/theme-overrides.js'
import { setThemeCssVars } from '@/utils/setThemeCssVars'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

const currentTheme = ref(localStorage.getItem('naive-theme') || 'light')
function handleThemeChange(e) {
  currentTheme.value = e.detail
  localStorage.setItem('naive-theme', e.detail)
}
onMounted(() => window.addEventListener('naive-theme-change', handleThemeChange))
onUnmounted(() => window.removeEventListener('naive-theme-change', handleThemeChange))

const naiveTheme = computed(() =>
  currentTheme.value === 'dark' ? darkTheme : null
)
const themeOverride = computed(() =>
  themeOverrides[currentTheme.value] || themeOverrides['light']
)

// 自动注入所有主题相关 css 变量！
watchEffect(() => {
  setThemeCssVars(themeOverride.value.common)
})
</script>

<template>
  <n-config-provider :theme="naiveTheme" :theme-overrides="themeOverride">
    <Header />
    <router-view />
    <Footer />
  </n-config-provider>
</template>
