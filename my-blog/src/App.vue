<script setup>
import { ref, onMounted, onUnmounted, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { NConfigProvider, darkTheme } from 'naive-ui'
import themeOverrides from '@/theme/theme-overrides.js'
import { setThemeCssVars } from '@/utils/setThemeCssVars'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

const route = useRoute()
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
watchEffect(() => {
  setThemeCssVars(themeOverride.value.common)
})
</script>

<template>
  <n-config-provider :theme="naiveTheme" :theme-overrides="themeOverride">
    <div class="main-layout">
      <Header v-if="route.path !== '/login'" />
      <div class="main-content">
        <router-view />
      </div>
      <Footer v-if="route.path !== '/login'" />
    </div>
  </n-config-provider>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--body-color, #f8fafb);
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
