<template>
  <div class="article-card">
    <img v-if="article.cover" class="cover" :src="article.cover" alt="cover" @click.stop="onView" />
    <div class="meta" @click="onView">
      <div class="title">{{ article.title }}</div>
      <div class="date">{{ article.date }}</div>
      <div class="summary">{{ article.summary }}</div>
      <div class="tags">
        <span
          v-for="t in article.tags"
          :key="t"
          class="tag-chip"
          @click.stop="onSelectTag(t)"
        >{{ t }}</span>
      </div>
    </div>
    <button class="edit-btn" @click.stop="onEdit">编辑</button>
    <button class="delete-btn" @click.stop="onDelete">删除</button>
  </div>
</template>

<script setup>
const props = defineProps({
  article: Object
})
const emit = defineEmits(['view', 'edit', 'delete', 'selectTag'])
function onView() { emit('view', props.article) }
function onEdit() { emit('edit', props.article) }
function onDelete() { emit('delete', props.article) }
function onSelectTag(tag) { emit('selectTag', tag) }
</script>

<style>
.article-card {
  display: flex;
  align-items: flex-start;
  background: #f6f6f6;
  border-radius: 12px;
  padding: 1.5em 1em;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.article-card:hover {
  box-shadow: 0 4px 24px rgba(100, 108, 255, 0.10);
  background: #e9edff;
}
.cover {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1.5em;
  flex-shrink: 0;
  background: #ddd;
}
.meta {
  flex: 1;
}
.title {
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 0.5em;
}
.date {
  color: #999;
  font-size: 0.98em;
  margin-bottom: 0.6em;
}
.summary {
  color: #555;
  font-size: 1em;
}
.tags {
  margin-top: 0.3em;
}
.tag-chip {
  display: inline-block;
  background: #e9edff;
  color: #4754be;
  border-radius: 6px;
  padding: 0.1em 0.7em 0.1em 0.5em;
  margin: 0 0.5em 0.2em 0;
  font-size: 0.99em;
  cursor: pointer;
}
.edit-btn {
  margin-left: 1em;
  background: #ffb300;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4em 1.1em;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.2s;
}
.edit-btn:hover {
  background: #ea9800;
}
.delete-btn {
  margin-left: 1.2em;
  background: #ff4444;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4em 1.1em;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.2s;
}
.delete-btn:hover {
  background: #d61f1f;
}
</style>
