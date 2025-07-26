<template>
  <div v-if="tags.length" class="filter-bar">
    <span class="filter-label">标签筛选：</span>
    <span
      v-for="t in tags"
      :key="t.id"
      class="tag-chip"
      :class="{ active: t.id === modelValue }"
      :style="{ background: t.id === modelValue ? (t.color || '#2563eb') : '', color: t.id === modelValue ? '#fff' : '' }"
      @click="$emit('update:modelValue', t.id)"
    >{{ t.name }}</span>
    <span
      v-if="modelValue"
      class="tag-clear"
      @click="$emit('update:modelValue', '')"
    >[清除筛选]</span>
  </div>
</template>

<script setup>
defineProps({
  tags: { type: Array, default: () => [] },
  modelValue: [String, Number],
});
</script>


<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.filter-label {
  color: var(--filter-label-color, #7c90b2);
  font-size: 0.98em;
  margin-right: 0.7em;
}
.tag-chip {
  display: inline-block;
  padding: var(--tag-padding, 0.25em 1.1em);
  margin-right: 0.6em;
  border-radius: var(--tag-radius, 1.1em);
  background: var(--tag-bg, #f1f5fa);
  color: var(--tag-text, #5b7fa7);
  font-size: 0.98em;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.18s;
  font-weight: 500;
}
.tag-chip.active {
  background: var(--tag-active-bg, #2563eb);
  color: var(--tag-active-text, #fff);
  border-color: var(--tag-active-border, #2563eb);
  font-weight: 600;
}
.tag-clear {
  color: var(--tag-clear-color, #94a3b8);
  cursor: pointer;
  font-size: 0.95em;
  margin-left: 0.4em;
  transition: color 0.18s;
}
.tag-clear:hover {
  color: var(--tag-active-bg, #2563eb);
}
</style>
