<template>
  <n-popselect
    v-model:value="theme"
    :options="themeOptions"
    size="small"
    trigger-props="{ placement: 'bottom-end' }"
    class="theme-switcher"
    @update:value="handleThemeChange"
  >
    <template #default>
      <slot>
        <n-button size="small" secondary>
          {{ themeLabel }}
        </n-button>
      </slot>
    </template>
  </n-popselect>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { NButton, NPopselect } from 'naive-ui'
import themeOverrides, { themeNames } from '@/theme/theme-overrides.js'

const theme = ref(localStorage.getItem('naive-theme') || 'light')

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
.theme-switcher {
  min-width: 100px;
  flex-shrink: 0;
}
</style>
