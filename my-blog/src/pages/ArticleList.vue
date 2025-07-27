<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ArticleCard from '@/components/blog/ArticleCard.vue'
import SearchBar from '@/components/blog/SearchBar.vue'
import TagFilterBar from '@/components/blog/TagFilterBar.vue'
import CategoryTreeSidebar from '@/components/blog/CategoryTreeSidebar.vue'
import { NPagination } from 'naive-ui'

// API 封装
import { fetchPublishedArticles } from '@/api/article'
import { getCategoryTree } from '@/api/category'

/** 列表数据相关 **/
const articles = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(5)
const loading = ref(false)
const initialLoading = ref(true)
const error = ref('')

/** 筛选条件 **/
const keyword = ref('')
const selectedTag = ref('')
const selectedCategory = ref('')      // 一级分类，由侧边栏控制
const selectedSub = ref('')           // 二级分类
const categoryTree = ref([])          // 分类树结构

/** 分类树 & 子分类列表 **/
const subCategories = computed(() => {
  if (!selectedCategory.value)
    return categoryTree.value.flatMap(cat => cat.children || [])
  const cat = categoryTree.value.find(cat => cat.id === selectedCategory.value)
  return cat?.children || []
})

// 监听一级分类变动自动重置二级
watch(selectedCategory, () => {
  selectedSub.value = ''
})

// 搜索和二级分类筛选方法
function handleSearch(val) {
  keyword.value = val
  page.value = 1
  fetchList()
}
function handleSubChange(val) {
  selectedSub.value = val
  page.value = 1
  fetchList()
}
const defaultCover = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
const router = useRouter()

/** 拉文章列表 **/
async function fetchList() {
  error.value = ''
  if (!articles.value.length) initialLoading.value = true
  else loading.value = true

  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
    }
    if (keyword.value.trim()) params.keyword = keyword.value.trim()
    if (selectedTag.value) params.tag = selectedTag.value
    if (selectedCategory.value) params.category_id = selectedCategory.value
    if (selectedSub.value) params.category_id = selectedSub.value

    const data = await fetchPublishedArticles(params)

    articles.value = Array.isArray(data.list) ? data.list : []
    total.value = data.total || 0
  } catch (e) {
    error.value = e.message
    console.error('[fetchList] 错误:', e)
  } finally {
    loading.value = false
    initialLoading.value = false
  }
}

/** 拉分类树 **/
async function fetchCategories() {
  try {
    const data = await getCategoryTree()
    categoryTree.value = Array.isArray(data) ? data : []
  } catch {
    categoryTree.value = []
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchList()
})

/** 当分页、筛选条件变更时重新拉 */
watch([page, pageSize, keyword, selectedTag, selectedCategory, selectedSub], fetchList)

/** 跳转详情 **/
function goDetail(id) {
  router.push({ path: '/article/' + id })
}
function handlePageChange(p) { page.value = p }
function handleSizeChange(s) { pageSize.value = s; page.value = 1 }

/** 聚合唯一标签 **/
const allTags = computed(() => {
  const map = new Map()
  articles.value.forEach(a => (a.tags || []).forEach(t => {
    if (!map.has(t.id)) map.set(t.id, t)
  }))
  return Array.from(map.values())
})
</script>

<template>
  <div class="with-tree-sidebar">
    <!-- 一级侧栏 -->
    <CategoryTreeSidebar v-model="selectedCategory" />

    <!-- 右侧内容区 -->
    <div class="article-list-bg">
      <div class="article-list-card">
        <!-- 搜索 + 二级分类 -->

        <SearchBar v-model="keyword" :sub-categories="subCategories" :sub-category="String(selectedSub)"
          @search="handleSearch" @update:subCategory="handleSubChange" />


        <!-- 标签筛选 -->
        <TagFilterBar :tags="allTags" v-model="selectedTag" tag-class="tag-chip" />

        <!-- 列表状态 -->
        <div v-if="initialLoading" class="loading">加载中...</div>
        <div v-else>
          <div v-if="error" class="error">{{ error }}</div>
          <template v-else>
            <div v-if="!articles.length" class="no-article">暂无匹配文章</div>
            <div class="article-list">
              <ArticleCard v-for="a in articles" :key="a.id" :title="a.title" :abstract="a.summary" :cover="a.cover"
                :tags="a.tags" :time="a.created_at" :views="a.views" :default-cover="defaultCover"
                @click="goDetail(a.id)" />

              <div v-if="loading && articles.length" class="loading-mask">
                <span class="spinner"></span>
              </div>
            </div>
            <n-pagination v-if="total > pageSize" class="pagination" :page="page" :page-size="pageSize"
              :page-count="Math.ceil(total / pageSize)" :page-sizes="[5, 10, 20, 50]" show-size-picker show-quick-jumper
              @update:page="handlePageChange" @update:page-size="handleSizeChange" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  margin-top: 2em;
}

.pagination :deep(.n-pagination-item) {
  border-radius: 8px;
}

.pagination :deep(.n-pagination-item--active) {
  background: var(--pagination-active-bg, #2563eb);
  color: var(--pagination-active-text, #fff);
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
  margin: 2.5em 0 3em;
}

.article-list {
  display: flex;
  flex-direction: column;
  position: relative;
}

.loading-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: var(--card-radius, 1.4em);
}

.spinner {
  width: 2.2em;
  height: 2.2em;
  border: 3px solid #2563eb44;
  border-radius: 50%;
  border-top-color: #2563eb;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.with-tree-sidebar {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  padding: 0 10vw;
  min-height: 100vh;
  background: var(--body-color, #f8fafb);
}

.category-sidebar {
  flex-shrink: 0;
  margin-top: 0;
}

.article-list-bg {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  background: var(--body-color, #f8fafb);
  padding-right: 8vw;
}

.article-list-card {
  width: 100%;
  max-width: 900px;
  background: var(--card-color, #fff);
  color: var(--text-color-base, #1e293b);
  border-radius: var(--card-radius, 1.4em);
  box-shadow: var(--card-shadow, 0 4px 18px #60a5fa13);
  margin: 3.5em auto 2.5em;
  padding: 3em 2.5em 2.5em;
  min-height: 75vh;
  transition: background 0.3s, color 0.3s;
}

@media (max-width: 600px) {
  .article-list-card {
    padding: 1.2em 0.7em;
    margin: 1.1em 0;
  }
}
</style>
