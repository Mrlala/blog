<template>
  <div class="admin-dashboard">
    <n-h2 prefix="bar">管理后台首页</n-h2>
    <n-grid :x-gap="24" :y-gap="16" :cols="3" class="mb-8">
      <n-gi>
        <n-statistic label="文章总数" :value="stat.articles"/>
      </n-gi>
      <n-gi>
        <n-statistic label="分类数" :value="stat.categories"/>
      </n-gi>
      <n-gi>
        <n-statistic label="标签数" :value="stat.tags"/>
      </n-gi>
    </n-grid>
    <n-card title="快速入口" class="mb-8">
      <n-space>
        <n-button @click="$router.push('/admin/category')">分类管理</n-button>
        <n-button @click="$router.push('/admin/tag')">标签管理</n-button>
        <n-button @click="$router.push('/admin/article')">文章管理</n-button>
      </n-space>
    </n-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { NButton, NCard, NH2, NStatistic, NGrid, NGi, NSpace } from 'naive-ui'

// 你自己封装的 API
import { fetchArticleList } from '@/api/article'
import { getCategoryTree } from '@/api/category'
import { getTags } from '@/api/tag'

const stat = ref({ articles: 0, categories: 0, tags: 0 })

onMounted(async () => {
  try {
    const [a, c, t] = await Promise.all([
      fetchArticleList({ pageSize: 1 }).then(r => r.total || 0),
      getCategoryTree().then(list => Array.isArray(list) ? list.length : 0),
      getTags({ page: 1, pageSize: 1 }).then(res => res.total || 0)
    ])
    stat.value = { articles: a, categories: c, tags: t }
  } catch (e) {
    window.$message?.error?.('部分统计接口出错：' + (e.message || e))
  }
})
</script>

<style scoped>
.admin-dashboard { padding: 2.2em 2em 2em; }
.mb-8 { margin-bottom: 2em; }
</style>
