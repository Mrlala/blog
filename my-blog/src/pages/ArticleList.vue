<template>
  <div class="article-list-page">
    <!-- 写新文章按钮 -->
    <router-link to="/write">
      <button class="write-btn">写新文章</button>
    </router-link>
    <h1>文章列表</h1>

    <!-- 搜索框 -->
    <div class="search-bar">
      <input
        v-model="keyword"
        placeholder="搜索标题或摘要"
        class="search-input"
      />
    </div>

    <!-- 标签筛选区域 -->
    <div class="filter-bar" v-if="allTags.length">
      <span>标签筛选：</span>
      <span
        v-for="t in allTags"
        :key="t"
        class="tag-chip"
        :class="{ active: t === selectedTag }"
        @click="selectTag(t)"
      >{{ t }}</span>
      <span v-if="selectedTag" class="tag-clear" @click="clearTag">[清除筛选]</span>
    </div>

    <div v-if="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div v-if="filteredArticles.length === 0" class="no-article">暂无匹配文章</div>
      <div class="article-list">
        <!-- 遍历文章列表，渲染每个卡片 -->
        <div
          class="article-card"
          v-for="a in filteredArticles"
          :key="a.file"
        >
          <!-- 封面图 -->
          <img v-if="a.cover" class="cover" :src="a.cover" alt="cover" @click.stop="goTo(a.file)" />
          <!-- 文章主要信息 -->
          <div class="meta" @click="goTo(a.file)">
            <div class="title">{{ a.title }}</div>
            <div class="date">{{ a.date }}</div>
            <div class="summary">{{ a.summary }}</div>
            <!-- 文章标签 -->
            <div class="tags">
              <span
                v-for="t in a.tags"
                :key="t"
                class="tag-chip"
                @click.stop="selectTag(t)"
              >{{ t }}</span>
            </div>
          </div>
          <!-- 编辑/删除按钮 -->
          <button class="edit-btn" @click.stop="editArticle(a.file)">编辑</button>
          <button class="delete-btn" @click.stop="confirmDelete(a.file)">删除</button>
        </div>
      </div>
    </div>
    <!-- 删除确认弹窗 -->
    <div v-if="showConfirm" class="confirm-modal">
      <div class="confirm-box">
        <div>确定要删除这篇文章吗？</div>
        <button @click="doDelete">确定</button>
        <button @click="showConfirm = false">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 文章数据
const articles = ref([])
// 加载/错误状态
const loading = ref(true)
const error = ref('')
// 搜索关键词
const keyword = ref('')
// 标签筛选相关
const selectedTag = ref('')
// 路由
const router = useRouter()

// 删除弹窗与当前要删除文件
const showConfirm = ref(false)
const fileToDelete = ref('')

// 首次加载文章列表
onMounted(fetchList)

// 获取文章索引（index.json）
async function fetchList() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/articles/index.json')
    if (!res.ok) throw new Error('获取文章列表失败')
    articles.value = await res.json()
  } catch (e) {
    error.value = e.message
  }
  loading.value = false
}

// 所有标签去重集合
const allTags = computed(() => {
  const set = new Set()
  articles.value.forEach(a => (a.tags || []).forEach(t => set.add(t)))
  return Array.from(set)
})

// 筛选后的文章（按标签和关键字）
const filteredArticles = computed(() => {
  let arr = articles.value
  // 标签优先筛选
  if (selectedTag.value) {
    arr = arr.filter(a => a.tags && a.tags.includes(selectedTag.value))
  }
  // 关键词筛选
  if (keyword.value.trim()) {
    const key = keyword.value.trim().toLowerCase()
    arr = arr.filter(a =>
      (a.title && a.title.toLowerCase().includes(key)) ||
      (a.summary && a.summary.toLowerCase().includes(key))
    )
  }
  return arr
})

// 跳转到文章详情页
const goTo = (file) => {
  router.push(`/article/${file}`)
}

// 跳转到写作页，编辑模式
const editArticle = (file) => {
  router.push({ path: '/write', query: { edit: file } })
}

// 标签筛选相关方法
function selectTag(tag) {
  selectedTag.value = tag
}
function clearTag() {
  selectedTag.value = ''
}

// 删除相关逻辑
const confirmDelete = (file) => {
  fileToDelete.value = file
  showConfirm.value = true
}
const doDelete = async () => {
  if (!fileToDelete.value) return
  showConfirm.value = false
  try {
    const res = await fetch('http://localhost:3001/api/article/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: fileToDelete.value })
    })
    const data = await res.json()
    if (data.success) {
      await fetchList()
    } else {
      alert('删除失败')
    }
  } catch (e) {
    alert('请求异常')
  }
}
</script>

<style>
.article-list-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2em 0;
  text-align: left;
}
.write-btn {
  margin-bottom: 2em;
  padding: 0.8em 2em;
  font-size: 1.2em;
  background: #646cff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.write-btn:hover {
  background: #535bf2;
}
.search-bar {
  margin-bottom: 1.5em;
}
.search-input {
  width: 60%;
  padding: 0.8em 1.5em;
  border-radius: 8px;
  font-size: 1.05em;
  border: 1px solid #ccc;
}
.filter-bar {
  margin-bottom: 1em;
  font-size: 1.06em;
}
.tag-chip {
  display: inline-block;
  background: #e9edff;
  color: #4754be;
  border-radius: 6px;
  padding: 0.1em 0.7em 0.1em 0.5em;
  margin: 0 0.5em 0.2em 0;
  font-size: 0.99em;
  cursor: pointer;
}
.tag-chip.active {
  background: #4754be;
  color: #fff;
}
.tag-clear {
  color: #e93f3f;
  margin-left: 1em;
  cursor: pointer;
}
.tags {
  margin-top: 0.3em;
}
.article-list {
  display: flex;
  flex-direction: column;
  gap: 2em;
}
.article-card {
  display: flex;
  align-items: flex-start;
  background: #f6f6f6;
  border-radius: 12px;
  padding: 1.5em 1em;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.article-card:hover {
  box-shadow: 0 4px 24px rgba(100, 108, 255, 0.10);
  background: #e9edff;
}
.cover {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1.5em;
  flex-shrink: 0;
  background: #ddd;
}
.meta {
  flex: 1;
}
.title {
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 0.5em;
}
.date {
  color: #999;
  font-size: 0.98em;
  margin-bottom: 0.6em;
}
.summary {
  color: #555;
  font-size: 1em;
}
.edit-btn {
  margin-left: 1em;
  background: #ffb300;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4em 1.1em;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.2s;
}
.edit-btn:hover {
  background: #ea9800;
}
.delete-btn {
  margin-left: 1.2em;
  background: #ff4444;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4em 1.1em;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.2s;
}
.delete-btn:hover {
  background: #d61f1f;
}
.confirm-modal {
  position: fixed;
  left: 0; right: 0; top: 0; bottom: 0;
  background: rgba(30,30,30,0.18);
  display: flex; align-items: center; justify-content: center;
  z-index: 99;
}
.confirm-box {
  background: #fff;
  padding: 2em 2.5em;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.13);
  text-align: center;
}
.confirm-box button {
  margin: 1.5em 0.8em 0 0.8em;
  padding: 0.5em 1.5em;
  border-radius: 8px;
  border: none;
  font-size: 1em;
  background: #646cff;
  color: #fff;
  cursor: pointer;
}
.confirm-box button:last-child {
  background: #bbb;
  color: #444;
}
.no-article {
  color: #999;
  margin-top: 3em;
  text-align: center;
}
.error {
  color: red;
  margin: 2em 0;
}
</style>
