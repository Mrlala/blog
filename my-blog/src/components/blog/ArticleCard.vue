<template>
  <div class="article-card">
    <img
      v-if="coverImg"
      :src="coverImg"
      class="card-cover"
      alt="cover"
      loading="lazy"
    />
    <div v-else class="card-cover-placeholder"></div>
    <div class="card-body" @click="$emit('click')">
      <h3 class="card-title">{{ title }}</h3>
      <div class="card-abstract">{{ abstract }}</div>
      <div class="card-meta">
        <span class="card-time">{{ time }}</span>
        <span class="card-tags">
          <span class="tag-chip" v-for="t in tags" :key="t">{{ t }}</span>
        </span>
      </div>
      <!-- 操作按钮插槽 -->
      <div class="card-actions">
        <slot name="actions"></slot>
      </div>
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
  defaultCover: { type: String, default: '' }
})
const coverImg = props.cover || props.defaultCover
</script>

<style scoped>
.article-card {
  display: flex;
  background: var(--card-color, #fff);
  border-radius: var(--card-radius, 1.5em);
  box-shadow: var(--card-shadow, 0 4px 22px #6091ff17);
  border: 1.5px solid var(--card-border, #ecedf3);
  transition: box-shadow 0.18s, border-color 0.18s, transform 0.15s;
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 1.2rem;
  min-height: 115px;
}
.article-card:hover {
  box-shadow: 0 8px 32px #60a5fa27;
  border-color: var(--card-hover-border, #7cb3ff);
  transform: translateY(-2px) scale(1.012);
}
.card-cover {
  width: 124px;
  height: 100%;
  object-fit: cover;
  background: var(--cover-bg, #f2f6fd);
  border-right: 1.5px solid var(--cover-border, #f1f5f9);
  flex-shrink: 0;
}
.card-cover-placeholder {
  width: 124px;
  min-height: 115px;
  height: 100%;
  background: var(--cover-bg, #f2f6fd);
  border-right: 1.5px solid var(--cover-border, #f1f5f9);
  flex-shrink: 0;
}
.card-body {
  flex: 1;
  padding: 1.15em 1.4em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}
.card-title {
  font-size: 1.17em;
  font-weight: bold;
  margin-bottom: 0.48em;
  color: var(--card-title-color, #234087);
  line-height: 1.3;
}
.card-abstract {
  color: var(--card-abstract-color, #5a6d8c);
  font-size: 1em;
  margin-bottom: 0.5em;
  min-height: 2.2em;
}
.card-meta {
  display: flex;
  align-items: center;
  gap: 1.4em;
  margin-top: 0.3em;
}
.card-time {
  color: var(--card-time-color, #b2bccc);
  font-size: 0.96em;
}
.card-tags .tag-chip {
  margin-right: 0.5em;
  background: var(--tag-bg, #e6eeff);
  color: var(--tag-text, #4875d2);
  font-size: 0.93em;
  border-radius: var(--tag-radius, 1em);
  padding: var(--tag-padding, 0.08em 0.85em);
  transition: background 0.2s, color 0.2s;
}

/* 操作按钮容器 */
.card-actions {
  margin-top: 0.8em;
  display: flex;
  justify-content: flex-end;
  gap: 0.6em;
}
</style>
