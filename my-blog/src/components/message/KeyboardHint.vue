<template>
  <div class="keyboard-hint">
    <b>快捷键：</b>
    <span>Ctrl+B 加粗</span>
    <span>Ctrl+I 斜体</span>
    <span>Ctrl+K 插入链接</span>
    <span>Ctrl+S 保存</span>
    <!-- 你可以自行补充其它 -->
  </div>
</template>
<script setup>
</script>
<style>
.keyboard-hint {
  background: #f7fcfa;
  border-radius: 7px;
  color: #555;
  font-size: 0.97em;
  margin: 0.5em 0;
  padding: 0.5em 1em;
  display: flex;
  gap: 1.2em;
  flex-wrap: wrap;
}
.keyboard-hint span { color: #646cff; margin-right: 0.7em; }
</style>
