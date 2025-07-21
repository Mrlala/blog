<template>
  <div class="article-page-bg">
    <div class="article-page">
      <div class="article-actions">
        <!-- 只有登录后才显示编辑按钮 -->
        <EditButton v-if="isLoggedIn()" @click="editArticle" />
      </div>
      <ErrorMessage v-if="error" :message="error" />
      <ArticleSkeleton v-else-if="loading" />
      <template v-else>
        <div class="article-md-preview">
          <ArticleTitle :title="articleTitle" />
          <ArticleDate :date="articleDate" />
          <MdPreview :modelValue="markdownContent" :theme="theme" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import EditButton from '@/components/article/EditButton.vue'
import ErrorMessage from '@/components/article/ErrorMessage.vue'
import ArticleSkeleton from '@/components/article/ArticleSkeleton.vue'
import ArticleTitle from '@/components/article/ArticleContent/ArticleTitle.vue'
import ArticleDate from '@/components/article/ArticleContent/ArticleDate.vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
// ===== 新增权限控制工具 =====
import { isLoggedIn } from '@/utils/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const error = ref('')
const markdownContent = ref('')
const articleTitle = ref('')
const articleDate = ref('')

// 主题变量，默认从 localStorage 读取
const theme = ref(localStorage.getItem('naive-theme') || 'light')

function onThemeChange(event) {
  const newTheme = event.detail
  if (newTheme === 'light' || newTheme === 'dark') {
    theme.value = newTheme
  }
}

const editArticle = () => {
  router.push({ path: '/write', query: { edit: route.params.id } })
}

onBeforeUnmount(() => {
  window.removeEventListener('naive-theme-change', onThemeChange)
})

onMounted(async () => {
  window.addEventListener('naive-theme-change', onThemeChange)
  const id = route.params.id
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE_URL}/api/articles/${id}`)
    if (!res.ok) throw new Error('找不到文章')
    const data = await res.json()
    articleTitle.value = data.title
    articleDate.value = data.created_at ? data.created_at.slice(0, 10) : ''
    markdownContent.value = data.content
  } catch (e) {
    error.value = e.message
  }
  loading.value = false
})
</script>

<style scoped>
:deep(.md-editor-preview-wrapper),
:deep(.md-editor-preview),
:deep(.md-editor-content) {
  background: var(--article-bg, transparent) !important;
}

.article-page-bg {
  min-height: 100vh;
  background: var(--body-color, #f8fafb);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transition: background 0.35s;
}

.article-page {
  width: 100%;
  max-width: 980px;
  margin: 2.5em auto 2em;
  padding: 2.6em 0 3.2em 0;
  background: var(--article-bg, #fff);
  color: var(--article-text-color, #232a3a);
  border-radius: var(--article-radius, 2em);
  box-shadow: var(--article-shadow, 0 8px 32px rgba(60, 60, 110, 0.08));
  min-height: 66vh;
  transition: background 0.35s, color 0.35s;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.article-actions {
  display: flex;
  gap: 1em;
  margin-bottom: 1.3em;
  align-items: center;
  padding: 0 2.2em;
}

.article-md-preview {
  flex: 1 1 auto;
  width: 100%;
  padding: 0 2.2em;

  box-sizing: border-box;
}

.md-editor-preview {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  font-size: 1.1em;
  line-height: 1.72;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  word-break: break-word;
}

@media (max-width: 1024px) {
  .article-page {
    max-width: 100%;
    border-radius: 0;
  }

  .article-md-preview,
  .article-actions {
    padding: 0 1em;
  }
}

@media (max-width: 700px) {
  .article-md-preview,
  .article-actions {
    padding: 0 0.3em;
  }

  .article-page {
    padding: 1em 0 2em 0;
  }
}
</style>
