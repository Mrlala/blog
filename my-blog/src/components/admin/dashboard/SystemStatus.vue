<!-- src/components/SystemStatus.vue -->
<template>
  <n-card title="服务器状态监控" class="mb-12">
    <template v-if="status">
      <div class="status-row">
        <span>🖥️ CPU 核心数：</span>
        <strong>{{ status.cpuCount }}</strong>
      </div>
      <div class="status-row">
        <span>⚡ CPU 1分钟平均负载：</span>
        <strong>{{ status.cpuLoad }}</strong>
        <small>（{{ cpuLoadPercent }}% 使用率）</small>
      </div>
      <div class="status-row">
        <span>💾 内存使用率：</span>
        <strong :style="{ color: memUsageColor }">{{ status.memory?.usedPercent ?? '加载中' }}%</strong>
      </div>
      <div class="status-row">
        <span>📂 磁盘剩余空间：</span>
        <strong :style="{ color: diskFreeColor }">
          {{ formatBytes(status.disk?.free ?? 0) }} / {{ formatBytes(status.disk?.size ?? 0) }} ({{ status.disk?.freePercent ?? '加载中' }}%)
        </strong>
      </div>
      <div class="status-row">
        <span>🗄️ 数据库连接数：</span>
        <strong :style="{ color: dbConnColor }">{{ status.dbConnections ?? '加载中' }}</strong>
      </div>
    </template>
    <template v-else>
      <div>正在加载系统状态...</div>
    </template>
  </n-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchSystemStatus } from '@/api/systemStatus'

const status = ref(null)

async function loadStatus() {
  try {
    const data = await fetchSystemStatus()
    status.value = data
  } catch (e) {
    console.error('获取系统状态失败', e)
  }
}

const cpuLoadPercent = computed(() => {
  if (!status.value) return 0
  const load = parseFloat(status.value.cpuLoad || 0)
  const cores = status.value.cpuCount || 1
  return ((load / cores) * 100).toFixed(1)
})

const memUsageColor = computed(() => {
  const p = Number(status.value?.memory?.usedPercent ?? 0)
  if (p > 85) return 'red'
  if (p > 65) return 'orange'
  return 'green'
})

const diskFreeColor = computed(() => {
  const p = Number(status.value?.disk?.freePercent ?? 100)
  if (p < 10) return 'red'
  if (p < 30) return 'orange'
  return 'green'
})

const dbConnColor = computed(() => {
  const n = Number(status.value?.dbConnections ?? 0)
  if (n > 100) return 'red'
  if (n > 50) return 'orange'
  return 'green'
})

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

onMounted(() => {
  loadStatus()
})
</script>

<style scoped>
.status-row {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 0.6em;
  font-size: 1rem;
  color: var(--text-color-base, #333);
}
.status-row small {
  color: var(--text-color-secondary, #888);
  margin-left: 0.3em;
  font-weight: 400;
}
</style>
