<template>
  <div class="preview-toggle">
    <button :class="{active: mode==='edit'}" @click="$emit('update:mode', 'edit')">编辑</button>
    <button :class="{active: mode==='split'}" @click="$emit('update:mode', 'split')">分栏</button>
    <button :class="{active: mode==='preview'}" @click="$emit('update:mode', 'preview')">仅预览</button>
  </div>
</template>
<script setup>
const props = defineProps({
  mode: String  // edit/split/preview
})
</script>
<style>
.preview-toggle { display: flex; gap: 0.7em; margin-bottom: 1em; }
.preview-toggle button {
  border: none;
  border-radius: 7px;
  padding: 0.45em 1.4em;
  background: #f4f5fa;
  color: #646cff;
  font-size: 1em;
  cursor: pointer;
}
.preview-toggle button.active {
  background: #646cff;
  color: #fff;
  font-weight: bold;
}
</style>
