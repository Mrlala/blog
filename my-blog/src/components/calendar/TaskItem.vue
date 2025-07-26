<template>
  <li class="task-item" :class="{ done: task.done, important: task.priority === 'important', urgent: task.priority === 'urgent' }">
    <n-checkbox v-model:checked="task.done" @update:checked="toggleDone">
      <span v-if="task.icon" class="task-icon">{{ task.icon }}</span>
      <span class="task-title">{{ task.title }}</span>
    </n-checkbox>
    <n-button size="tiny" @click="showDetail = true" style="margin-left:6px">详情</n-button>
    <n-button size="tiny" tertiary type="error" @click="remove" style="margin-left:4px">删除</n-button>

    <n-modal v-model:show="showDetail" preset="dialog" title="任务详情" style="max-width:340px">
      <div>
        <b>内容：</b>{{ task.title }}<br>
        <b>备注：</b><span style="white-space:pre-wrap">{{ task.desc || '无' }}</span><br>
        <b>图标：</b>{{ task.icon || '无' }}
      </div>
      <template #action>
        <n-button @click="edit">编辑</n-button>
        <n-button @click="showDetail = false">关闭</n-button>
      </template>
    </n-modal>
  </li>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ task: Object })
const emit = defineEmits(['remove', 'toggle-done', 'edit'])

const showDetail = ref(false)

function remove() { emit('remove', props.task.id) }
function toggleDone(val) { emit('toggle-done', props.task.id, val) }
function edit() {
  emit('edit', props.task)
  showDetail.value = false
}
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4em 0.6em;
  border-radius: 6px;
  margin-bottom: 0.5em;
  background: #fff;
  transition: background 0.3s;
}

.task-item.done .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-item.important {
  border-left: 4px solid #eab308;
  background: #fffbe8;
}

.task-item.urgent {
  border-left: 4px solid #ef4444;
  background: #fff4f4;
}

.task-icon {
  margin-right: 6px;
}

.task-title {
  font-weight: 500;
  font-size: 1em;
  color: #333;
}
</style>
