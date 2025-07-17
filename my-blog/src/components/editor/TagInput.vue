<template>
  <div class="tag-box">
    <input
      v-model="input"
      @keyup.enter="addTag"
      @input="onInput"
      placeholder="输入标签，回车或逗号分隔"
      class="tag-input"
    />
    <span v-for="(t, i) in modelValue" :key="t" class="tag-chip">
      {{ t }}
      <span class="tag-remove" @click="remove(i)">×</span>
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  modelValue: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])
const input = ref('')
function onInput(e) {
  const v = e.target.value.trim()
  if (v.endsWith(',') || v.endsWith('，') || v.endsWith(' ')) {
    const tag = v.replace(/,|，/g, '').trim()
    if (tag && !props.modelValue.includes(tag)) {
      emit('update:modelValue', [...props.modelValue, tag])
    }
    input.value = ''
  }
}
function addTag() {
  const tag = input.value.trim()
  if (tag && !props.modelValue.includes(tag)) {
    emit('update:modelValue', [...props.modelValue, tag])
  }
  input.value = ''
}
function remove(i) {
  const tags = props.modelValue.slice()
  tags.splice(i, 1)
  emit('update:modelValue', tags)
}
</script>

<style>
.tag-box { margin-bottom: 1em; }
.tag-input { padding: 0.5em 1em; border-radius: 8px; border: 1px solid #bbb; margin-right: 1em; }
.tag-chip { display: inline-block; background: #e9edff; color: #4754be; border-radius: 6px; padding: 0.1em 0.7em 0.1em 0.5em; margin: 0 0.5em 0.2em 0; font-size: 0.99em; cursor: pointer; }
.tag-remove { margin-left: 4px; color: #e93f3f; cursor: pointer; }
</style>
