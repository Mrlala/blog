<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">📱 二维码生成工具</h2>
      <p class="tool-desc">支持文本、网址、名片等内容，实时生成高清二维码，支持下载与复制。</p>

      <div class="tool-content" style="flex-direction: column; align-items: stretch;">
        <textarea
          v-model="text"
          class="tool-input tool-textarea"
          rows="3"
          placeholder="请输入要生成二维码的内容，比如网址、文本等"
        ></textarea>
        <div class="tool-btn-row">
          <button class="tool-btn" @click="generate">生成</button>
          <button class="tool-btn" @click="clearAll">清空</button>
        </div>
      </div>

      <div v-if="error" class="tool-error">{{ error }}</div>

      <div v-if="qrcodeDataUrl" class="tool-result qrcode-result">
        <img :src="qrcodeDataUrl" class="qrcode-img" alt="二维码" />
        <div class="qrcode-actions">
          <button class="tool-btn" @click="download">下载二维码</button>
          <button class="tool-btn" @click="copyImage">{{ copied ? '已复制!' : '复制二维码' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QRCode from 'qrcode'

const text = ref('')
const error = ref('')
const qrcodeDataUrl = ref('')
const copied = ref(false)

async function generate() {
  error.value = ''
  qrcodeDataUrl.value = ''
  if (!text.value.trim()) {
    error.value = '请输入内容'
    return
  }
  try {
    qrcodeDataUrl.value = await QRCode.toDataURL(text.value, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'M'
    })
  } catch (e) {
    error.value = '生成二维码失败'
  }
  copied.value = false
}

function clearAll() {
  text.value = ''
  qrcodeDataUrl.value = ''
  error.value = ''
  copied.value = false
}

function download() {
  if (!qrcodeDataUrl.value) return
  const a = document.createElement('a')
  a.href = qrcodeDataUrl.value
  a.download = 'qrcode.png'
  a.click()
}

async function copyImage() {
  if (!qrcodeDataUrl.value) return
  try {
    const blob = await (await fetch(qrcodeDataUrl.value)).blob()
    await navigator.clipboard.write([
      new window.ClipboardItem({ [blob.type]: blob })
    ])
    copied.value = true
    setTimeout(() => (copied.value = false), 1200)
  } catch (e) {
    error.value = '复制失败，可能浏览器不支持'
  }
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
  color: var(--cardAbstractColor, #5a6d8c);
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
  gap: 0.9em;
  margin-top: 1em;
  flex-wrap: wrap;
}
.tool-input {
  font-size: 1em;
  padding: 0.38em 0.5em;
  border-radius: var(--input-radius, 10px);
  border: 1.5px solid var(--input-border, #e3e8f7);
  background: var(--input-bg, #f8faff);
  color: var(--input-text, #1e293b);
  width: 100%;
  margin-bottom: .1em;
  box-sizing: border-box;
  font-family: inherit;
  transition: border 0.18s;
}
.tool-textarea {
  resize: vertical;
  font-family: 'JetBrains Mono', 'Menlo', 'monospace';
  min-height: 80px;
  max-height: 320px;
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
  margin-bottom: 0;
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
  gap: 1.8em;
  font-size: 1.08em;
  word-break: break-all;
}
.qrcode-result {
  align-items: center;
  flex-direction: row;
  gap: 2.2em;
}
.qrcode-img {
  width: 220px;
  height: 220px;
  border-radius: 20px;
  background: #f1f3fa;
  border: 1px solid #e3e8f7;
  box-shadow: 0 4px 18px #1e293b13;
}
.qrcode-actions {
  display: flex;
  flex-direction: column;
  gap: 1.1em 0;
  min-width: 140px;
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
  .qrcode-result { flex-direction: column; gap: 1.1em; }
  .qrcode-img { width: 150px; height: 150px;}
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
  .tool-content, .tool-btn-row, .tool-result, .qrcode-result { flex-direction: column; gap: 0.7em 0; font-size: 1em;}
  .qrcode-img { width: 120px; height: 120px;}
}
</style>
