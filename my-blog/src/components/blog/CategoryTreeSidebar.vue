<template>
  <nav class="category-sidebar">
    <ul>
      <li
        v-for="cat in mainCategories"
        :key="cat.id"
        :class="{ active: modelValue === cat.id }"
        @click="$emit('update:modelValue', cat.id)"
      >
        <span class="cat-icon" v-if="cat.icon" v-html="cat.icon"></span>
        <span class="cat-name">{{ cat.name }}</span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCategoryTree } from '@/api/category'

const props = defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])

const mainCategories = ref([])

async function fetchCategoryTree() {
  try {
    const data = await getCategoryTree()
    mainCategories.value = Array.isArray(data)
      ? data.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon || '',
        }))
      : []
  } catch {
    mainCategories.value = []
  }
}

onMounted(fetchCategoryTree)
</script>

<style scoped>
.category-sidebar {
  background: var(--sidebar-bg, #f4f6fa);
  border-radius: 1.1em;
  box-shadow: 0 2px 22px var(--card-shadow, #2563eb12);
  padding: 1.08em 0.2em;
  width: 184px;
  min-width: 110px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-right: 1.4em;
  margin-top: 2.1em;
  user-select: none;
  font-size: 1.07em;
  position: sticky;
  top: 95px;
  border: 1.5px solid var(--sidebar-border, #e6e9f0);
  height: 420px; /* 固定高度 */
  overflow: hidden;
}
.category-sidebar ul {
  padding: 0;
  margin: 0;
  list-style: none;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.category-sidebar li {
  display: flex;
  align-items: center;
  gap: 0.82em;
  flex: 1 1 0;      /* 动态平分高度 */
  min-height: 0;
  border-radius: 0.7em;
  padding: 0 1.3em 0 1.45em;
  color: var(--sidebar-text, #2563eb);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.16s, color 0.16s;
  margin-bottom: 0.13em;
  justify-content: flex-start;
  overflow: hidden;
  /* 字体溢出处理 */
  text-overflow: ellipsis;
  white-space: nowrap;
}
.category-sidebar li.active {
  background: var(--sidebar-active-bg, #e5efff);
  color: var(--sidebar-active-text, #2563eb);
  font-weight: 700;
}
.category-sidebar li:hover:not(.active) {
  background: var(--sidebar-hover-bg, #e5f1ff);
  color: var(--sidebar-hover-text, #2563eb);
}
.cat-icon {
  font-size: 1.15em;
  width: 1.5em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.cat-name {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  font-size: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
