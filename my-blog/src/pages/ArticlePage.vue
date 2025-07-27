<template>
  <div class="article-page-bg">
    <div class="article-page">
      <!-- 返回主页按钮 -->
      <div class="article-header">
        <button class="go-home-btn" @click="goHome">
          <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none">
            <path d="M8 12h8M8 12l-3.5-3.5M8 12l3.5 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
          返回首页
        </button>
      </div>

      <ErrorMessage v-if="error" :message="error" />
      <ArticleSkeleton v-else-if="loading" />

      <template v-else>
        <ArticleTitle :title="articleTitle" />
        <ArticleMetaInline :category="categoryName" :date="articleDate" :tags="articleTags" :views="views" />



        <div v-if="summary" class="article-summary">{{ summary }}</div>
        <div class="article-md-preview">
          <MdPreview :modelValue="markdownContent" :theme="theme" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ErrorMessage from '@/components/article/ErrorMessage.vue'
import ArticleSkeleton from '@/components/article/ArticleSkeleton.vue'
import ArticleTitle from '@/components/article/ArticleContent/ArticleTitle.vue'
import ArticleMetaInline from '@/components/article/ArticleContent/ArticleMetaInline.vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

import { fetchArticle, addArticleView } from '@/api/article'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const error = ref('')
const markdownContent = ref('')
const articleTitle = ref('')
const articleDate = ref('')
const summary = ref('')
const articleTags = ref([])
const categoryName = ref('')
const views = ref(0)

const theme = ref(localStorage.getItem('naive-theme') || 'light')
function onThemeChange(event) {
  const newTheme = event.detail
  if (newTheme === 'light' || newTheme === 'dark') {
    theme.value = newTheme
  }
}
function goHome() {
  router.push({ path: '/' })
}

onBeforeUnmount(() => {
  window.removeEventListener('naive-theme-change', onThemeChange)
})
onMounted(async () => {
  window.addEventListener('naive-theme-change', onThemeChange)
  loading.value = true
  error.value = ''
  try {
    const id = route.params.id

    // 1. 先获取文章内容
    let data = await fetchArticle(id)
    articleTitle.value = data.title
    articleDate.value = data.created_at?.slice(0, 10) || ''
    markdownContent.value = data.content
    summary.value = data.summary || ''
    articleTags.value = Array.isArray(data.tags) ? data.tags : []
    categoryName.value = data.category?.name || ''
    views.value = data.views || 0

    // 2. 浏览计数+1（不等待结果）
    addArticleView(id).then(async res => {
      if (res.success) {
        // 再查一次最新views（如果你想显示最准确的实时数，否则可省略）
        let newData = await fetchArticle(id)
        views.value = newData.views || 0
      }
    })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>


<style scoped>
.article-page-bg {
  min-height: 100vh;
  background: var(--body-color, #f8fafb);
  display: flex;
  justify-content: center;
  padding: 3.2em 1em 3em 1em;
  transition: background 0.3s;
}

.article-page {
  width: 100%;
  max-width: 820px;
  background: var(--article-bg, #fff);
  border-radius: 1.6em;
  box-shadow: 0 4px 32px 0 rgba(47, 92, 150, 0.10);
  padding: 2.6em 2.3em 2.2em 2.3em;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  position: relative;
  animation: fadein 0.6s cubic-bezier(.77, .13, .17, .87);

}

@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(35px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.article-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1.1em;
}

.go-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  background: linear-gradient(95deg, #93cafc 0%, #406ff2 100%);
  border: none;
  color: #fff;
  border-radius: 2em;
  font-size: 1.05em;
  padding: 0.4em 1.5em 0.4em 1em;
  font-weight: 600;
  box-shadow: 0 1px 7px rgba(68, 126, 255, 0.13);
  cursor: pointer;
  letter-spacing: .01em;
  transition: box-shadow 0.16s, background 0.18s, filter 0.12s;
}

.go-home-btn:hover {
  filter: brightness(1.07);
  box-shadow: 0 4px 16px rgba(68, 126, 255, 0.22);
}

.article-category {
  font-size: 1em;
  font-weight: bold;
  color: #406ff2;
  background: #e8f0ff;
  border-radius: 1.1em;
  padding: 0.15em 1.3em;
  letter-spacing: 0.03em;
  box-shadow: 0 1px 6px rgba(50, 80, 160, 0.05);
}

.article-summary {
  font-size: 1.13em;
  color: #444a66;
  margin-bottom: 1.3em;
  background: #f6fafd;
  border-left: 4px solid #4e8ef7;
  padding: 0.9em 1.2em;
  border-radius: 0.9em;
  box-shadow: 0 2px 9px rgba(50, 90, 180, 0.07);
}

.article-md-preview {
  line-height: 1.74;
  font-size: 1.09em;
  color: var(--body-text, #212f47);
  background: var(--input-bg, #fff);
  border-radius: 0.8em;
  padding: 1.3em 1.1em 1.1em 1.1em;
  box-shadow: 0 1px 10px rgba(50, 80, 160, 0.04);
  transition: background 0.3s, color 0.3s;
  word-break: break-word;
}

:deep(.md-editor) {
  --md-bk-color: var(--article-bg, #fff);

}

:deep(.md-editor .md-editor-preview) {
  --md-theme-color: var(--article-date-color, #1e293b);
}
</style>
<!-- --article-date-color -->