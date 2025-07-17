<template>
  <div class="editor-toolbar">
    <button @click="$emit('command', 'bold')"><b>B</b></button>
    <button @click="$emit('command', 'italic')"><i>I</i></button>
    <button @click="toggleEmoji">😀</button>
    <button @click="toggleImg">🖼️</button>
    <select v-model="localFontSize" @change="$emit('font-size', localFontSize)">
      <option v-for="s in [14,16,18,20,22]" :key="s" :value="s">{{ s }}px</option>
    </select>
    <button @click="$emit('command', 'clear')">清空</button>
    <div v-if="showEmoji" class="toolbar-float" @mouseleave="showEmoji=false">
      <EmojiPicker @pick="onPickEmoji" />
    </div>
    <div v-if="showImg" class="toolbar-float" @mouseleave="showImg=false">
      <ImageUploader @uploaded="onUploadImg" />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import EmojiPicker from './EmojiPicker.vue'
import ImageUploader from './ImageUploader.vue'
const showEmoji = ref(false)
const showImg = ref(false)
const localFontSize = ref(16)
function toggleEmoji() {
  showEmoji.value = !showEmoji.value
  showImg.value = false
}
function toggleImg() {
  showImg.value = !showImg.value
  showEmoji.value = false
}
function onPickEmoji(emoji) {
  showEmoji.value = false
  emit('emoji', emoji)
}
function onUploadImg(url) {
  showImg.value = false
  emit('image', url)
}
const emit = defineEmits(['command', 'emoji', 'image', 'font-size'])
</script>
<style>
.editor-toolbar { display: flex; gap: 0.5em; align-items: center; margin-bottom: 1em; flex-wrap: wrap; position: relative; }
.editor-toolbar button, .editor-toolbar select {
  border-radius: 5px; border: none; background: #f4f5fa; color: #4754be;
  padding: 0.28em 1.1em; font-size: 1em; cursor: pointer;
}
.editor-toolbar button:hover { background: #d6daff; }
.toolbar-float {
  position: absolute;
  top: 2.5em;
  left: 7em;
  background: #fff;
  border-radius: 7px;
  box-shadow: 0 2px 12px rgba(60,60,60,0.13);
  padding: 0.7em 1.2em 0.5em 1.2em;
  z-index: 22;
}
</style>
