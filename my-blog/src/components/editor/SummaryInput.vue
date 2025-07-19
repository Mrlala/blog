<template>
  <div class="title-input-wrapper mb-block">
    <textarea
      v-model="localValue"
      :maxlength="180"
      placeholder="请输入摘要"
      class="title-input"
      @input="onInput"
      rows="3"
      @keydown.enter.prevent
    ></textarea>
    <div class="count">{{ localValue.length }} / 180</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue || '')
watch(() => props.modelValue, (val) => {
  localValue.value = val || ''
})

function onInput(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<style scoped>
.title-input-wrapper {
  position: relative;
  width: 100%;
}

.title-input {
  width: 100%;
  box-sizing: border-box;
  font-size: 1.13em;
  font-weight: 700;
  color: var(--input-text, #1e293b);
  background: var(--input-bg, #f8faff);
  border: 1.5px solid var(--input-border, #e3e8f7);
  border-radius: var(--input-radius, 10px);
  padding: 0.62em 1.15em;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  font-family: inherit;
  resize: none;
  min-height: 4.5em; /* 三行左右 */
}

.title-input:focus {
  border-color: var(--input-focus-border, #60a5fa);
  background: var(--input-focus-bg, #fff);
}

.title-input::placeholder {
  color: var(--input-placeholder, #b1b7c7);
  opacity: 1;
}

.count {
  position: absolute;
  right: 1.15em;
  bottom: 0.35em;
  font-size: 0.85em;
  color: var(--input-placeholder, #b1b7c7);
  user-select: none;
  pointer-events: none;
}
</style>
