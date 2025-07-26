<template>
  <div class="search-bar">
    <!-- 搜索输入框 -->
    <input
      v-model="inputValue"
      :placeholder="placeholder"
      class="search-input"
      @input="onInput"
      @keydown.enter="onSearch"
    />
    <!-- 二级分类下拉 -->
    <div class="subcategory-select">
      <select v-model="selectedSub" @change="onSubChange">
        <option value="">全部</option>
        <option v-for="sub in subCategories" :key="sub.id" :value="sub.id">
          {{ sub.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: '搜索…' },
  subCategories: { type: Array, default: () => [] },
  subCategory: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'search', 'update:subCategory'])

// 输入框双向绑定
const inputValue = ref(props.modelValue || '')
watch(
  () => props.modelValue,
  v => { inputValue.value = v }
)
function onInput() {
  emit('update:modelValue', inputValue.value)
}
function onSearch() {
  emit('search', inputValue.value)
}

// 二级分类下拉
const selectedSub = ref(props.subCategory)
watch(
  () => props.subCategory,
  v => { selectedSub.value = v }
)
// 当 subCategories（即主分类切换导致的子分类列表）变化时，重置下拉
watch(
  () => props.subCategories,
  () => {
    selectedSub.value = ''
    emit('update:subCategory', '')
    // 可选：切换主分类后也触发一次搜索
    emit('search', inputValue.value)
  }
)
function onSubChange() {
  emit('update:subCategory', selectedSub.value)
  emit('search', inputValue.value)
}
</script>

<style scoped>
.search-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8em;
  width: 100%;
  margin-bottom: 1.2em;
}

/* 二级分类选择 固定宽度 */
.subcategory-select {
  flex-shrink: 0;
  width: 160px;
}
.subcategory-select select {
  width: 100%;
  padding: 0.75em 0.8em;
  border-radius: var(--input-radius, 1.2em);
  border: 1.5px solid var(--input-border, #e3e8f7);
  background: var(--input-bg, #f6f8fa);
  color: var(--input-text, #274b8b);
  font-size: var(--input-font-size, 1.08em);
  outline: none;
  transition: border 0.2s, background 0.2s, color 0.2s;
}

.search-input {
  flex: 1;
  padding: var(--input-padding, 0.75em 1.2em);
  border-radius: var(--input-radius, 1.2em);
  border: 1.5px solid var(--input-border, #e3e8f7);
  background: var(--input-bg, #f6f8fa);
  color: var(--input-text, #274b8b);
  font-size: var(--input-font-size, 1.08em);
  outline: none;
  transition: border 0.2s, background 0.2s, color 0.2s;
}

.search-input:focus {
  border-color: var(--input-focus-border, #60a5fa);
  background: var(--input-focus-bg, #fff);
}

.search-input::placeholder {
  color: var(--input-placeholder, #b1b7c7);
  opacity: 1;
}
</style>