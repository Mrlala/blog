<template>
  <h1 class="article-title">{{ title }}</h1>
</template>
<script setup>
defineProps({ title: String })
</script>
<style scoped>
.article-title {
  font-size: 2.2em;
  font-weight: bold;
  margin: 0.3em 0 0.8em 0;
  color: var(--article-title-color, #234087);
  line-height: 1.18;
  word-break: break-word;
}
</style>
