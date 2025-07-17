<template>
  <div class="content-toc">
    <div class="toc-title">目录</div>
    <ul>
      <li v-for="h in toc" :key="h.text" :style="{marginLeft: (h.level-1)*1.3+'em'}">
        <a href="#" @click.prevent="$emit('jump', h.anchor)">{{ h.text }}</a>
      </li>
    </ul>
  </div>
</template>
<script setup>
// 简易目录提取
const props = defineProps({ content: String })
const toc = computed(() => {
  const arr = []
  ;(props.content || '').split('\n').forEach(line => {
    const m = line.match(/^(#+)\s+(.+)/)
    if (m) arr.push({ level: m[1].length, text: m[2], anchor: m[2] })
  })
  return arr
})
</script>
<style>
.content-toc { background: #f5f6fa; border-radius: 8px; padding: 1em; margin-bottom: 1em; }
.toc-title { font-weight: bold; color: #888; margin-bottom: 0.6em; }
ul { padding-left: 0; list-style: none; }
li { margin-bottom: 0.25em; }
a { color: #4754be; text-decoration: none; cursor: pointer; }
a:hover { text-decoration: underline; }
</style>
