<template>
  <div class="auto-draft-bar" v-if="visible">
    <span>已自动保存草稿{{ time ? '（' + time + '）' : '' }}</span>
    <button @click="$emit('restore')">恢复</button>
    <button @click="$emit('clear')">清除</button>
  </div>
</template>
<script setup>
const props = defineProps({
  visible: Boolean,
  time: String // 上次保存时间
})
</script>
<style>
.auto-draft-bar {
  background: #f7fcfa;
  color: #437962;
  padding: 0.5em 1em;
  border-radius: 7px;
  display: flex;
  gap: 1em;
  align-items: center;
  margin-top: 1em;
  font-size: 0.97em;
}
.auto-draft-bar button {
  border: none;
  background: #f3faf7;
  color: #277b4f;
  border-radius: 6px;
  padding: 0.28em 1em;
  cursor: pointer;
  font-size: 0.99em;
  transition: background 0.2s;
}
.auto-draft-bar button:hover {
  background: #a7e4c3;
}
</style>
