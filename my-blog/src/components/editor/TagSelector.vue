<template>
  <n-select
    v-model:value="innerValue"
    tag
    multiple
    filterable
    :options="tagOptions"
    placeholder="请输入或选择标签"
    style="width: 100%"
    @update:value="onTagsChange"
  />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getTags } from '@/api/tag'

const props = defineProps({
  modelValue: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])

const tagOptions = ref([])
const innerValue = ref([...props.modelValue])

// 与父组件双向绑定
watch(() => props.modelValue, v => {
  if (JSON.stringify(v) !== JSON.stringify(innerValue.value)) {
    innerValue.value = v
  }
})
watch(innerValue, v => {
  if (JSON.stringify(v) !== JSON.stringify(props.modelValue)) {
    emit('update:modelValue', v)
  }
})

// 防止输入重复/空白
function onTagsChange(val) {
  innerValue.value = Array.from(new Set(val.filter(name => typeof name === 'string' && name.trim())))
}

// 拉取所有标签（只要名字，不要 id）
async function fetchTags() {
  const data = await getTags({ page: 1, pageSize: 100 })
  tagOptions.value = (data.list || []).map(t => ({
    label: t.name,
    value: t.name
  }))
}
onMounted(fetchTags)
</script>
