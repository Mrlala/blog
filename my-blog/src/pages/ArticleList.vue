<script setup>
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ArticleCard from '@/components/blog/ArticleCard.vue'
import SearchBar from '@/components/blog/SearchBar.vue'
import TagFilterBar from '@/components/blog/TagFilterBar.vue'
import ArticleActionButtons from '@/components/blog/ArticleActionButtons.vue'

const articles = ref([])
const loading = ref(true)
const error = ref('')
const keyword = ref('')
const selectedTag = ref('')
const defaultCover = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
const router = useRouter()

onMounted(fetchList)

async function fetchList() {
  loading.value = true
  error.value = ''
  try {
    // 改为后端API
    const res = await fetch(`${API_BASE_URL}/api/articles`)
    if (!res.ok) throw new Error('获取文章列表失败')
    articles.value = await res.json()
  } catch (e) {
    error.value = e.message
  }
  loading.value = false
}

const allTags = computed(() => {
  const set = new Set()
  articles.value.forEach(a => (a.tags || []).forEach(t => set.add(t)))
  return Array.from(set)
})

const filteredArticles = computed(() => {
  let arr = articles.value
  if (selectedTag.value) {
    arr = arr.filter(a => a.tags && a.tags.includes(selectedTag.value))
  }
  if (keyword.value.trim()) {
    const key = keyword.value.trim().toLowerCase()
    arr = arr.filter(a =>
      (a.title && a.title.toLowerCase().includes(key)) ||
      (a.summary && a.summary.toLowerCase().includes(key))
    )
  }
  return arr
})

function goDetail(id) {
  router.push({ path: '/article/' + id })
}

function onEdit(article) {
  router.push({ path: '/write', query: { edit: article.id } })
}

async function onDelete(article) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/articles/${article.id}`, {
      method: 'DELETE'
    })
    const data = await res.json()
    if (data.success) {
      alert('删除成功')
      fetchList()
    } else {
      alert('删除失败')
    }
  } catch {
    alert('请求异常')
  }
}
</script>

<template>
  <div class="article-list-bg">
    <div class="article-list-card">
      <div class="list-header">
        <h2 class="list-title">文章列表</h2>
        <router-link to="/write">
          <button class="write-btn">写新文章</button>
        </router-link>
      </div>

      <SearchBar v-model="keyword" placeholder="搜索标题或摘要" input-class="search-input" />
      <TagFilterBar :tags="allTags" v-model="selectedTag" tag-class="tag-chip" />

      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div v-if="filteredArticles.length === 0" class="no-article">暂无匹配文章</div>
        <div class="article-list">
          <ArticleCard
            v-for="a in filteredArticles"
            :key="a.id"
            :title="a.title"
            :abstract="a.summary"
            :cover="a.cover"
            :tags="a.tags"
            :time="a.created_at"
            :default-cover="defaultCover"
            @click="goDetail(a.id)"
          >
            <template #actions>
              <ArticleActionButtons
                @edit="() => onEdit(a)"
                @delete="() => onDelete(a)"
              />
            </template>
          </ArticleCard>
        </div>
      </div>
    </div>
  </div>
</template>




<style scoped>
.article-list-bg {
  min-height: 100vh;
  background: var(--body-color, #f8fafb);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.article-list-card {
  width: 100%;
  max-width: 720px;
  background: var(--card-color, #fff);
  color: var(--text-color-base, #1e293b);
  border-radius: var(--card-radius, 1.4em);
  box-shadow: var(--card-shadow, 0 4px 18px #60a5fa13);
  margin: 3.5em auto 2.5em auto;
  padding: 2.6em 1.6em 2.4em 1.6em;
  min-height: 75vh;
  transition: background 0.3s, color 0.3s;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2em;
}

.list-title {
  font-size: 1.7em;
  font-weight: bold;
  color: var(--primary-color, #2563eb);
  letter-spacing: 0.01em;
}

.write-btn {
  background: var(--btn-bg, linear-gradient(90deg, #2563eb, #60a5fa));
  color: var(--btn-text, #fff);
  box-shadow: var(--btn-shadow, 0 4px 18px #60a5fa13);
  border-radius: var(--btn-radius, 1.3em);
  border: var(--btn-border, none);
  font-size: var(--btn-font-size, 1.13em);
  padding: var(--btn-padding, 0.48em 1.6em);
  transition: background 0.2s, transform 0.15s;
  cursor: pointer;
}

.write-btn:hover {
  background: var(--btn-hover-bg, linear-gradient(90deg, #1e40af, #3b82f6));
  color: var(--btn-hover-text, #fff);
  transform: scale(1.03);
}

.search-input {
  background: var(--input-bg, #fff);
  color: var(--input-text, #274b8b);
  border: 1.5px solid var(--input-border, #c7d6ea);
  border-radius: var(--input-radius, 1.2em);
  padding: 0.55em 1.4em;
  font-size: 1.07em;
  outline: none;
  transition: border 0.15s, background 0.2s;
}

.search-input::placeholder {
  color: var(--input-placeholder, #b1b7c7);
  opacity: 1;
}

.tag-chip {
  background: var(--tag-bg, #e6f0ff);
  color: var(--tag-text, #2360a2);
  border-radius: var(--tag-radius, 1em);
  padding: var(--tag-padding, 0.18em 1.1em);
  font-size: 0.98em;
  margin-right: 0.4em;
  margin-bottom: 0.25em;
  border: none;
  cursor: pointer;
  transition: background 0.22s, color 0.22s;
  outline: none;
}

.tag-chip.active,
.tag-chip:active,
.tag-chip.selected {
  background: var(--tag-active-bg, #2563eb);
  color: var(--tag-active-text, #fff);
}

.loading {
  text-align: center;
  color: var(--loading-color, #89a0c5);
  padding: 2em 0;
}

.error {
  text-align: center;
  color: var(--error-color, #ef4444);
  padding: 2em 0;
}

.no-article {
  text-align: center;
  color: var(--no-article-color, #c5d0e4);
  font-size: 1.09em;
  font-weight: 600;
  letter-spacing: 0.1em;
  margin: 2.5em 0 3em 0;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 1.4em;
}

.article-list-card::-webkit-scrollbar {
  width: 8px;
  background: var(--scrollbar-color, #dde6ef);
}

.article-list-card::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb, #bcd2e6);
  border-radius: 4px;
}
</style>
