<template>
  <form @submit.prevent="$emit('submit')">
    <input v-model="title" placeholder="请输入标题" class="input-title" />
    <TagInput v-model="tags" />
    <slot name="toolbar" />
    <textarea v-model="content" placeholder="请输入内容" rows="18" class="input-content" />
    <slot name="footer" />
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import TagInput from './TagInput.vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ title: '', content: '', tags: [] }) }
})
const emit = defineEmits(['update:modelValue', 'submit'])

const title = ref(props.modelValue.title)
const content = ref(props.modelValue.content)
const tags = ref(props.modelValue.tags || [])

watch([title, content, tags], ([t, c, tg]) => {
  emit('update:modelValue', { title: t, content: c, tags: tg })
})
watch(() => props.modelValue, (v) => {
  title.value = v.title
  content.value = v.content
  tags.value = v.tags
})
</script>

<style>
.input-title { width: 100%; font-size: 1.3em; margin-bottom: 1em; padding: 0.7em; border-radius: 8px; border: 1px solid #ccc; }
.input-content { width: 100%; font-size: 1em; padding: 1em; border-radius: 8px; border: 1px solid #ccc; margin-bottom: 1em; resize: vertical; min-height: 300px; }
</style>
