<template>
  <div class="article-page">
    <button class="back-btn" @click="$router.back()">返回上一页</button>
    <button class="edit-btn" @click="editArticle">编辑</button>

    <div v-if="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <h1>{{ articleTitle }}</h1>
      <div class="date">{{ articleDate }}</div>
      <!-- 文章内容Markdown渲染 -->
      <div class="markdown-body" v-html="htmlContent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()

const route = useRoute()
const loading = ref(true)
const error = ref('')
const htmlContent = ref('')
const articleTitle = ref('')
const articleDate = ref('')

const editArticle = () => {
  router.push({ path: '/write', query: { edit: route.params.name } })
}

onMounted(async () => {
  const name = route.params.name
  loading.value = true
  error.value = ''
  try {
    // 获取文章内容
    const res = await fetch(`/articles/${name}`)
    if (!res.ok) throw new Error('找不到文章')
    const content = await res.text()
    // 提取标题（假设第一行为# 标题），提取日期（从文件名或md内容）
    const lines = content.split('\n')
    if (lines[0].startsWith('# ')) {
      articleTitle.value = lines[0].replace(/^# /, '').trim()
    } else {
      articleTitle.value = name
    }
    // 假设文件名为2025-07-17-xxx.md
    const dateMatch = name.match(/^(\d{4}-\d{2}-\d{2})/)
    articleDate.value = dateMatch ? dateMatch[1] : ''
    // 渲染Markdown
    htmlContent.value = marked.parse(content)
  } catch (e) {
    error.value = e.message
  }
  loading.value = false
})
</script>

<style>
.article-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2em 0;
  text-align: left;
}
.back-btn {
  margin-bottom: 2em;
  padding: 0.6em 1.2em;
  font-size: 1em;
  background: #eee;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.markdown-body {
  font-size: 1.08em;
  line-height: 1.7;
  padding: 1em 0;
  word-break: break-all;
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
.date {
  color: #888;
  font-size: 0.98em;
  margin-bottom: 1.2em;
}
.error {
  color: red;
}
</style>
