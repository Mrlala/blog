<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="任务详情"
    :closable="true"
  >
    <div class="detail-content">
      <p><strong>标题：</strong>{{ task?.title || '-' }}</p>
      <p><strong>图标：</strong><span v-if="task?.icon">{{ task.icon }}</span><span v-else>-</span></p>
      <p><strong>优先级：</strong>{{ priorityText }}</p>
      <p><strong>备注：</strong><br />{{ task?.desc || '-' }}</p>
      <p><strong>完成状态：</strong>{{ task?.done ? '已完成' : '未完成' }}</p>
      <p><strong>日期：</strong>{{ task?.date || '-' }}</p>
    </div>
    <template #action>
      <n-button @click="show = false">关闭</n-button>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, watch ,computed} from 'vue'

const props = defineProps({
  modelValue: Boolean,
  task: Object
})
const emit = defineEmits(['update:modelValue'])

const show = ref(false)

watch(() => props.modelValue, val => {
  show.value = val
})

watch(show, val => {
  emit('update:modelValue', val)
})

const priorityMap = {
  important: '重要',
  urgent: '紧急',
  normal: '普通'
}

const priorityText = computed(() => {
  if (!props.task || !props.task.priority) return '普通'
  return priorityMap[props.task.priority] || '普通'
})
</script>

<style scoped>
.detail-content p {
  margin: 0.8em 0;
  font-size: 1em;
  color: var(--text-color-base, #1e293b);
}
</style>
