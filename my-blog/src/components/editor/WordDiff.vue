<template>
  <div class="word-diff">
    <div class="diff-title">内容对比：</div>
    <div class="diff-content">
      <span v-for="(part, idx) in diffResult" :key="idx" :class="part.type">
        {{ part.text }}
      </span>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
// 这里只做最简单的行级 diff，高级功能可用第三方库
const props = defineProps({
  oldText: String,
  newText: String
})
const diffResult = computed(() => {
  const oldArr = (props.oldText || '').split('\n')
  const newArr = (props.newText || '').split('\n')
  // 简单实现：新内容用绿色，缺失用红色
  const arr = []
  newArr.forEach((line, idx) => {
    if (!oldArr[idx]) arr.push({ text: line + '\n', type: 'added' })
    else if (line !== oldArr[idx]) arr.push({ text: line + '\n', type: 'changed' })
    else arr.push({ text: line + '\n', type: '' })
  })
  for (let i = newArr.length; i < oldArr.length; ++i)
    arr.push({ text: oldArr[i] + '\n', type: 'removed' })
  return arr
})
</script>
<style>
.word-diff { font-size: 1em; margin-bottom: 1em; }
.diff-title { font-weight: bold; color: #888; margin-bottom: 0.5em; }
.diff-content { background: #f5f5f7; padding: 1em; border-radius: 7px; font-family: monospace; white-space: pre-wrap; }
.added { background: #d5ffe4; }
.removed { background: #ffe1e1; text-decoration: line-through; color: #d04c4c; }
.changed { background: #ffe5ad; }
</style>
