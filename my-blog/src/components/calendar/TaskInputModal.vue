<template>
  <n-modal
    :show="show"
    preset="dialog"
    :title="modalTitle"
    @update:show="val => emit('update:show', val)"
  >
    <n-input
      v-model:value="taskTitle"
      placeholder="请输入任务内容"
      @keyup.enter="submit"
      style="margin-bottom:1em;"
    />
    <n-select
      v-model:value="taskPriority"
      :options="priorityOptions"
      placeholder="选择重要程度"
      style="margin-bottom: 1em; width: 150px"
      clearable
    />
    <n-select
      v-model:value="taskIcon"
      :options="iconOptions"
      placeholder="选择图标(可选)"
      style="margin-bottom: 1em; width: 150px"
      clearable
    />
    <n-input
      v-model:value="taskDesc"
      placeholder="备注（可选）"
      type="textarea"
      rows="3"
      style="margin-bottom:1.2em;"
      :autosize="{ minRows: 2, maxRows: 4 }"
    />
    <template #action>
      <n-button @click="close">取消</n-button>
      <n-button type="primary" :disabled="!taskTitle.trim()" @click="submit">
        {{ modalTitle.includes('编辑') ? '保存' : '添加' }}
      </n-button>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  modalTitle: { type: String, default: '添加任务' },
  editTask: Object
})
const emit = defineEmits(['update:show', 'submit'])

const taskTitle = ref('')
const taskDesc = ref('')
const taskIcon = ref('')
const taskPriority = ref('')

const priorityOptions = [
  { label: '普通', value: '' },
  { label: '重要', value: 'important' },
  { label: '紧急', value: 'urgent' }
]

const iconOptions = [
  { label: '🧑‍💻 工作', value: '🧑‍💻' },
  { label: '💡 灵感', value: '💡' },
  { label: '🛒 购物', value: '🛒' },
  { label: '⚡️ 紧急', value: '⚡️' },
  { label: '🌟 重要', value: '🌟' },
  { label: '🏃‍♂️ 运动', value: '🏃‍♂️' },
  { label: '📚 学习', value: '📚' },
  { label: '❤️ 健康', value: '❤️' },
  { label: '🎵 娱乐', value: '🎵' },
  { label: '🗂 其它', value: '🗂' }
]

watch(
  () => props.show,
  v => {
    if (v && props.editTask) {
      taskTitle.value = props.editTask.title || ''
      taskDesc.value = props.editTask.desc || ''
      taskIcon.value = props.editTask.icon || ''
      taskPriority.value = props.editTask.priority || ''
    } else if (v) {
      taskTitle.value = ''
      taskDesc.value = ''
      taskIcon.value = ''
      taskPriority.value = ''
    }
  }
)

function submit() {
  if (!taskTitle.value.trim()) return
  emit('submit', {
    title: taskTitle.value.trim(),
    desc: taskDesc.value.trim(),
    icon: taskIcon.value,
    priority: taskPriority.value
  })
  emit('update:show', false)
}

function close() {
  emit('update:show', false)
}
</script>
