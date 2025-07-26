<template>
  <div class="article-meta-inline">
    <div class="meta-left">

      <span class="article-date">
        <svg width="1em" height="1em" style="margin-right: 0.25em;opacity:0.85" fill="none" viewBox="0 0 24 24">
          <path d="M7 3v2m10-2v2M4.5 7h15M6 21h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
            stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ date }}
      </span>
    </div>
    <div class="meta-tags" v-if="tags && tags.length">
      <span v-for="t in tags" :key="t.id || t.name" class="article-tag"
        :style="{ background: t.color || defaultTagColor(t.name) }">{{ t.name }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  category: String,
  date: String,
  tags: {
    type: Array,
    default: () => [],
  },
})
function defaultTagColor(name) {
  const colorList = ['#3b82f6', '#10b981', '#f59e42', '#a78bfa', '#ef4444', '#fbbf24']
  if (!name) return '#64748b'
  const idx = (name.charCodeAt(0) + name.length) % colorList.length
  return colorList[idx]
}
</script>

<style scoped>
.article-meta-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.1em;
  flex-wrap: wrap;
  margin-bottom: 1.3em;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 1.2em;
  font-size: 1em;
  color: #8d94a7;
}

.article-category {
  font-weight: bold;
  color: #406ff2;
  background: #e8f0ff;
  border-radius: 1em;
  padding: 0.15em 1.1em;
  letter-spacing: 0.03em;
}

.article-date {
  display: flex;
  align-items: center;
  color: var(--article-date-color, #888);
  font-size: 1em;
}

.meta-tags {
  display: flex;
  gap: 0.5em;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.article-tag {
  padding: 0.18em 0.95em;
  border-radius: 1.1em;
  color: #fff;
  font-size: 0.97em;
  font-weight: 500;
  letter-spacing: 0.02em;
  background: #a5b4fc;
  box-shadow: 0 2px 8px rgba(120, 120, 180, 0.05);
  margin-bottom: 0.13em;
  transition: filter 0.16s;
}

.article-tag:hover {
  filter: brightness(1.09);
}
</style>
