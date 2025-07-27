<template>
  <div class="article-card article-card-rightimg">
    <div class="card-body" @click="$emit('click')">
      <h3 class="card-title">{{ title }}</h3>
      <div class="card-abstract">{{ abstract }}</div>
      <div class="card-meta">
        <span class="card-time">{{ formatTime(time) }}</span>
        <span class="card-views">
          <svg viewBox="0 0 16 16" width="1em" height="1em" style="margin-right:2px;vertical-align:-2px;">
            <path fill="currentColor" d="M8 3C3.58 3 1 8 1 8s2.58 5 7 5 7-5 7-5-2.58-5-7-5Zm0 8.3A3.3 3.3 0 1 1 8 4.7a3.3 3.3 0 0 1 0 6.6Zm0-5.3a2 2 0 1 0 0 4.001A2 2 0 0 0 8 6Z"/>
          </svg>
          {{ views || 0 }}
        </span>
        <span class="card-tags">
          <span class="tag-chip" v-for="t in tags" :key="t.id"
            :style="{ background: t.color || '#e6eeff', color: t.color ? '#fff' : '' }">
            {{ t.name }}
          </span>
        </span>
      </div>
      <div class="card-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="card-imgbox">
      <img v-if="coverImg" :src="coverImg" class="card-cover" alt="cover" loading="lazy" />
      <div v-else class="card-cover-placeholder"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  abstract: String,
  cover: String,
  tags: Array,
  time: String,
  views: Number, // 新增
  defaultCover: { type: String, default: '' }
})
const coverImg = props.cover || props.defaultCover

function formatTime(time) {
  if (!time) return ''
  const date = new Date(time)
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0') + ' ' +
    String(date.getHours()).padStart(2, '0') + ':' +
    String(date.getMinutes()).padStart(2, '0')
}
</script>

<style scoped>
.article-card.article-card-rightimg {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background: var(--card-color, #fff);
  border-radius: 1.1em;
  box-shadow: var(--card-shadow, 0 4px 22px #6091ff17);
  border: 1.5px solid var(--card-border, #ecedf3);
  transition: box-shadow 0.18s, border-color 0.18s, transform 0.15s;
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 1.2em;
  height: 160px;
  min-height: 80px;
}

.article-card.article-card-rightimg:hover {
  box-shadow: 0 8px 32px #60a5fa27;
  border-color: var(--card-hover-border, #7cb3ff);
  transform: translateY(-2px) scale(1.012);
}

.card-body {
  flex: 1;
  padding: 1.12em 1.3em 1.12em 1.6em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  align-self: stretch;
}

.card-title {
  font-size: 1.15em;
  font-weight: bold;
  margin-bottom: 0.48em;
  color: var(--card-title-color, #234087);
  line-height: 1.35;
}

.card-abstract {
  color: var(--card-abstract-color, #5a6d8c);
  font-size: 1em;
  margin-bottom: 0.45em;
  min-height: 2.2em;
  max-height: 3.2em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-top: 0.18em;
  font-size: 0.95em;
}

.card-time {
  color: var(--card-time-color, #b2bccc);
  font-size: 0.96em;
}

.card-views {
  color: #789;
  font-size: 0.95em;
  margin-left: 0.5em;
  display: inline-flex;
  align-items: center;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35em;
}

.tag-chip {
  background: var(--tag-bg, #e6eeff);
  color: var(--tag-text, #4875d2);
  font-size: 0.92em;
  border-radius: 1em;
  padding: 0.09em 0.8em;
  transition: background 0.2s, color 0.2s;
  margin-bottom: 0.1em;
}

.card-imgbox {
  width: 300px;
  min-width: 200px;
  height: auto;
  display: flex;
  align-items: stretch;
  border-left: 1px solid #ecedf3;
  background: #f6f7fb;
}

.card-cover,
.card-cover-placeholder {
  width: 100%;
  height: 100%;
  min-height: 110px;
  object-fit: cover;
  align-self: stretch;
  display: block;
  background: #eaf1fa;
}

.card-actions {
  margin-top: 0.62em;
  display: flex;
  justify-content: flex-end;
  gap: 0.5em;
}
</style>
