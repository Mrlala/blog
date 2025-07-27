<template>
  <n-card title="最近新增文章" class="mb-8 actitvity-card">
    <n-list bordered>
      <n-list-item v-for="article in articles" :key="article.id">
        <div class="list-item-content">
          <router-link :to="`/article/${article.id}`" class="title" v-text="article.title || '无标题'" />
          <span class="views">👁️ {{ article.views ?? 0 }}</span>
          <div class="created-at">{{ formatDate(article.created_at) }}</div>
        </div>
      </n-list-item>
    </n-list>
  </n-card>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  articles: {
    type: Array,
    default: () => []
  }
})

function formatDate(dateStr) {
  if (!dateStr) return '无时间'
  const d = new Date(dateStr)
  if (isNaN(d)) return '无时间'
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}/${m}/${day}`
}
</script>

<style scoped>


.list-item-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  height: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title {
  flex: 1 1 auto;
  font-weight: 600;
  color: var(--n-link-color, #409eff);
  text-decoration: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.title:hover {
  text-decoration: underline;
  cursor: pointer;
}

.views {

  flex-shrink: 0;
  color: var(--text-color-secondary, #888);
  white-space: nowrap;
}

.created-at {
  flex-shrink: 0;
  color: var(--text-color-secondary, #888);
  font-size: 0.875rem;
  white-space: nowrap;
}
</style>
