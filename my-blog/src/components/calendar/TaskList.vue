<template>
  <ul>
    <li v-for="task in tasks" :key="task.id" :class="['task-item', task.priority, { done: task.done }]">
      <div class="task-main">
        <n-checkbox
          v-model:checked="task.done"
          @update:checked="val => toggleDone(task.id, val)"
        >
          <span v-if="task.icon" class="task-icon">{{ task.icon }}</span>
          <span class="task-title">{{ task.title }}</span>
          <span v-if="task.priority === 'important'" class="task-priority-important">[重要]</span>
          <span v-if="task.priority === 'urgent'" class="task-priority-urgent">[紧急]</span>
        </n-checkbox>

        <div class="actions">
          <n-button size="tiny" @click="edit(task)">编辑</n-button>
          <n-button size="tiny" type="info" @click="view(task)">详情</n-button>
          <n-button size="tiny" tertiary type="error" @click="remove(task.id)">删除</n-button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  tasks: Array
})
const emit = defineEmits(['remove', 'toggle-done', 'edit', 'view'])

function remove(id) {
  emit('remove', id)
}
function toggleDone(id, val) {
  emit('toggle-done', id, val)
}
function edit(task) {
  emit('edit', task)
}
function view(task) {
  emit('view', task)
}
</script>

<style scoped>
.task-item {
  border-radius: 8px;
  margin-bottom: 0.6em;
  padding: 0.5em 0.8em 0.5em 0.6em;
  transition: background 0.23s;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.12);
  border-left: 4px solid transparent;
}

.task-item.done .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2em;
}

.actions {
  display: flex;
  gap: 0.5em;
  margin-left: auto;
}

.task-icon {
  margin-right: 4px;
}

.task-title {
  font-weight: 500;
  font-size: 1em;
  color: var(--text-color-base, #1e293b);
}

.task-priority-important {
  color: #eab308;
  font-size: 0.98em;
  margin-left: 4px;
  font-weight: 600;
}

.task-priority-urgent {
  color: #ef4444;
  font-size: 0.98em;
  margin-left: 4px;
  font-weight: 600;
}

.task-item.important {
  background: rgba(234, 179, 8, 0.12);
  border-left: 4px solid #eab308;
}

.task-item.urgent {
  background: rgba(239, 68, 68, 0.11);
  border-left: 4px solid #ef4444;
}

.task-item:hover {
  background: #f1f5ff44;
}
ul {
  max-height: 400px; /* 你可根据实际容器高度调整 */
  overflow-y: auto;
  padding-right: 8px; /* 给滚动条留点空间 */
}

/* Webkit 浏览器滚动条样式 */
ul::-webkit-scrollbar {
  width: 8px;
}

ul::-webkit-scrollbar-track {
  background: transparent;
}

ul::-webkit-scrollbar-thumb {
  background-color: rgba(37, 99, 235, 0.5); /* 主题色半透明 */
  border-radius: 8px;
  border: 2px solid transparent;
  background-clip: content-box;
}

/* Firefox滚动条美化（需设置滚动条宽度） */
ul {
  scrollbar-width: thin;
  scrollbar-color: var(--card-color) transparent;
  /* var(--body-color, #f8fafb); */
}

</style>
