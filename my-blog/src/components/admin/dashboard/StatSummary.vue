<template>
  <n-card title="统计数据" class="stat-card">
    <n-space wrap gap="12px 8px">
      <div v-for="item in statItems" :key="item.key" class="stat-item">
        <div class="stat-icon">{{ item.icon }}</div>
        <div class="stat-value">{{ stat[item.key] ?? 0 }}</div>
        <div class="stat-label">{{ item.label }}</div>
      </div>
    </n-space>
  </n-card>
</template>

<script setup>
const props = defineProps({ stat: Object })

const statItems = [
  { label: '文章总数', key: 'articles', icon: '📝' },
  { label: '分类数', key: 'categories', icon: '🗂️' },
  { label: '标签数', key: 'tags', icon: '🏷️' },
  { label: '总浏览', key: 'views', icon: '👁️' }
]
</script>

<style scoped>


.stat-item {
  min-width: 40px;
  padding: 4px 8px;
  /* 减小上下内边距 */
  background: var(--card-color, #fff);
  border-radius: 8px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  cursor: default;
  height: 60px;
  /* 固定较矮的高度，可调整 */
  justify-content: center;
  /* 垂直居中内容 */
}

.stat-icon {
  font-size: 1.2rem;
  /* 略微缩小图标 */
  margin-bottom: 2px;
  /* 缩小间距 */
}

.stat-value {
  font-size: 1rem;
  /* 缩小数字字体 */
  font-weight: 600;
  margin-bottom: 1px;
  /* 缩小间距 */
}

.stat-label {
  font-size: 0.75rem;
  /* 缩小标签字体 */
  font-weight: 500;
  color: var(--card-abstract-color, #64748b);
  line-height: 1;
  /* 控制行高更紧凑 */
}
</style>
