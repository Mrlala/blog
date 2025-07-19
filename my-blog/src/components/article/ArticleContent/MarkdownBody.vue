<template>
  <div class="markdown-body" v-html="content"></div>
</template>

<script setup>
defineProps({ content: String })
</script>

<style scoped>
.markdown-body {
  font-size: 1.1em;
  line-height: 1.75;
  padding: 1.1em 0 0.6em;
  color: var(--markdown-text-color, #232a3a);
  word-break: break-word;
}
.markdown-body pre {
  background: var(--markdown-pre-bg, #23272e);
  color: var(--markdown-pre-text, #eee);
  padding: 1em;
  border-radius: 10px;
  overflow-x: auto;
  font-size: 0.96em;
  margin: 1.3em 0;
}
.markdown-body code {
  background: var(--markdown-code-bg, #f2f2f2);
  color: var(--markdown-code-text, #c7254e);
  padding: 0.13em 0.36em;
  border-radius: 5px;
  font-size: 0.98em;
}

/* 可以引入自定义的 markdown.css 以实现更丰富的排版效果 */
</style>
