<template>
  <div>
    <h1 class="article-title">{{ title }}</h1>
    <ArticleDate :date="date" />
    <MarkdownBody :content="content" />
  </div>
</template>

<script setup>
import ArticleDate from './ArticleContent/ArticleDate.vue'
import MarkdownBody from './ArticleContent/MarkdownBody.vue'
defineProps({
  title: String,
  date: String,
  content: String
})
</script>

<style scoped>
.article-title {
  font-size: 2.2em;
  font-weight: bold;
  margin: 0.3em 0 0.1em;
  color: var(--article-title-color, #234087);
  letter-spacing: 0.02em;
}

</style>
