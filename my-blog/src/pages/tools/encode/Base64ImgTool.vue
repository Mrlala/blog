<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">📷 Base64 转图片</h2>
      <p class="tool-desc">支持图片Base64字符串还原为图片，可用于预览与下载。</p>
      <div class="tool-content" style="flex-direction: column; align-items: stretch;">
        <textarea
          class="tool-input tool-input-area"
          v-model="input"
          placeholder="请输入图片的Base64字符串（支持 data:image/*;base64, 前缀和裸数据）"
          rows="6"
        />
        <div class="tool-btn-row">
          <button class="tool-btn" :disabled="!imgSrc" @click="download">下载图片</button>
          <button class="tool-btn" @click="clearAll" style="margin-left:.6em;">清空</button>
        </div>
      </div>
      <div v-if="imgSrc" class="tool-result" style="flex-direction: column;align-items: flex-start;">
        <label style="margin-bottom:.5em;font-weight:600;">图片预览：</label>
        <img :src="imgSrc" style="max-width:320px;max-height:180px;border-radius:9px;border:1px solid #e3e8f7;background:#fff;" />
      </div>
      <div v-else-if="error" class="tool-error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const input = ref('')
const imgSrc = ref('')
const error = ref('')

watch(input, (val) => {
  error.value = ''
  imgSrc.value = ''
  if (!val) return
  try {
    // 自动补前缀
    let b64 = val.trim()
    if (!b64) return
    if (!b64.startsWith('data:')) {
      // 默认用png
      b64 = 'data:image/png;base64,' + b64.replace(/[\r\n\s]/g, '')
    }
    imgSrc.value = b64
  } catch (e) {
    error.value = 'Base64 数据格式不正确'
  }
})

function clearAll() {
  input.value = ''
  imgSrc.value = ''
  error.value = ''
}

function download() {
  if (!imgSrc.value) return
  const a = document.createElement('a')
  a.href = imgSrc.value
  a.download = 'image.png'
  a.click()
}
</script>

<style scoped>
.tool-bg {
  min-height: 100vh;
  background: var(--body-color, #f8fafb);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 2.8em;
}
.tool-card {
  width: 100%;
  max-width: 1200px;
  background: var(--card-color, #fff);
  border-radius: var(--card-radius, 1.4em);
  box-shadow: var(--card-shadow, 0 4px 22px #6091ff17);
  padding: 2.2em 1.5em 2.4em;
  color: var(--text-color-base, #1e293b);
  margin-bottom: 3.5em;
  transition: background 0.3s, color 0.3s;
}
.tool-title {
  font-size: 1.35em;
  font-weight: bold;
  margin-bottom: 0.18em;
  color: var(--primary-color, #2563eb);
}
.tool-desc {
  font-size: 1em;
  color: var(--card-abstract-color, #5a6d8c);
  margin-bottom: 1.4em;
}
.tool-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1.1em 0.8em;
  align-items: center;
  margin-bottom: 1.45em;
}
.tool-btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9em;
  margin-top: 1em;
}
.tool-input {
  font-size: 1em;
  padding: 0.38em 0.5em;
  border-radius: var(--input-radius, 10px);
  border: 1.5px solid var(--input-border, #e3e8f7);
  background: var(--input-bg, #f8faff);
  color: var(--input-text, #1e293b);
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
  transition: border 0.18s, background 0.18s, color 0.18s;
  margin-bottom: 0;
  resize: none;
}
.tool-input-area {
  min-height: 110px;
  resize: vertical;
  margin-bottom: 1em;
  font-family: 'JetBrains Mono', 'Menlo', 'Consolas', monospace;
  font-size: 1.04em;
  line-height: 1.5;
}
.tool-btn {
  border-radius: var(--btn-radius, 999px);
  padding: 0.45em 1.35em;
  background: var(--btn-bg, linear-gradient(90deg,#75c7fa,#4e8ef7));
  color: var(--btn-text,#fff);
  font-weight: 600;
  font-size: 1.02em;
  border: none;
  cursor: pointer;
  transition: background 0.18s, filter 0.13s;
  min-width: 100px;
}
.tool-btn:disabled {
  filter: grayscale(0.2);
  opacity: 0.7;
  cursor: not-allowed;
}
.tool-btn:hover:enabled {
  background: var(--btn-hover-bg, linear-gradient(90deg,#1e40af,#3b82f6));
}
.tool-result {
  margin-top: 1.3em;
  display: flex;
  align-items: flex-start;
  gap: 0.8em;
  font-size: 1.08em;
  word-break: break-all;
}
.tool-error {
  color: #e25840;
  background: #fff2f0;
  border-radius: 8px;
  padding: 0.6em 1em;
  margin: 1em 0 0.8em 0;
  font-size: 1em;
}
@media (max-width: 900px) {
  .tool-card { max-width: 100vw; }
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
  .tool-content, .tool-btn-row, .tool-result { flex-direction: column; gap: 0.7em 0; font-size: 1em;}
}
</style>
