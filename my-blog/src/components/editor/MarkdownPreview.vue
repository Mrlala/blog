<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps({
  content: String,
  title: String
})

// marked 配置高亮
marked.setOptions({
  highlight: code => hljs.highlightAuto(code).value
})

// 拼接标题+内容并渲染为 HTML
const html = computed(() => {
  let src = (props.title ? `# ${props.title}\n` : '') + (props.content || '')
  return marked.parse(src)
})
</script>

<style>
.markdown-body {
  font-size: 1.08em;
  line-height: 1.7;
  word-break: break-all;
  background: #fff;
  padding: 1em 0;
}
.markdown-body pre {
  background: #23272e;
  color: #eee;
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
}
.markdown-body code {
  background: #f2f2f2;
  color: #c7254e;
  padding: 0.15em 0.3em;
  border-radius: 4px;
}
.markdown-body h1, .markdown-body h2, .markdown-body h3 {
  font-weight: bold;
  margin: 1.2em 0 0.7em 0;
}
.markdown-body ul, .markdown-body ol {
  margin-left: 1.2em;
  margin-bottom: 1.2em;
}
</style>
