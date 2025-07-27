<template>
  <div class="admin-dashboard">

    <div class="dashboard-main">
      <!-- 左栏 -->
      <div class="dashboard-left">
        <stat-summary :stat="stat" class="mb-12" />
        <quick-entry class="mb-12" />
        <recent-article-list :articles="recentArticles" />
      </div>
      <!-- 右栏 -->
      <div class="dashboard-right">
        <n-card title="近7日阅读趋势" class="mb-12">
          <trend-chart :data="trendData" />
        </n-card>

        <!-- 新增系统状态 -->
        <system-status />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatSummary from '@/components/admin/dashboard/StatSummary.vue'
import QuickEntry from '@/components/admin/dashboard/QuickEntry.vue'
import TrendChart from '@/components/admin/dashboard/TrendChart.vue'
import RecentArticleList from '@/components/admin/dashboard/RecentArticleList.vue'
import SystemStatus from '@/components/admin/dashboard/SystemStatus.vue'

import { fetchDashboardInfo } from '@/api/dashboard'

const stat = ref({ articles: 0, categories: 0, tags: 0, views: 0 })
const trendData = ref([])
const recentArticles = ref([])

onMounted(async () => {
  try {
    const data = await fetchDashboardInfo()
    console.log('仪表盘数据:', data)
    stat.value = {
      articles: data.articles || 0,
      categories: data.categories || 0,
      tags: data.tags || 0,
      views: data.views || 0
    }
    recentArticles.value = data.recentArticles || []
    trendData.value = data.readingTrend || []
  } catch (e) {
    console.error('获取仪表盘数据失败', e)
  }
})
</script>

<style scoped>
.admin-dashboard {
  padding: 1.2em 1em 1em;

  display: flex;
  flex-direction: column;
  background: var(--body-color, #181c22);
}

.dashboard-main {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: center;
  flex: 1 1 auto;
  height: 100%;  /* 这里 */
  overflow: hidden;
}

.dashboard-left {
  flex: 1 1 320px;
  min-width: 280px;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 4px;
  height: 100%;  /* 这里 */
}

.dashboard-right {
  flex: 2 1 600px;
  min-width: 360px;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-left: 4px;
  height: 100%;  /* 这里 */
}

.mb-12 {
  margin-bottom: 0.8em !important;
}

/* 响应式调整：小屏时上下排列，自动撑开 */
@media (max-width: 1024px) {
  .dashboard-main {
    flex-direction: column;
    gap: 0.6em;
    align-items: stretch;
    height: auto;
  }
  .dashboard-left,
  .dashboard-right {
    max-width: 100%;
    min-width: 0;
    overflow: visible;
    padding: 0;
    height: auto; /* 移除固定高度 */
  }
}

</style>
