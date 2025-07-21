<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🔗 短链生成与还原</h2>
      <p class="tool-desc">支持一键生成短网址，也可还原短链至原始地址。</p>
      <div class="tool-content" style="flex-direction:column;align-items:stretch;">
        <input
          v-model="input"
          class="tool-input"
          placeholder="请输入要生成短链的原始网址"
          @keydown.enter="createShort"
        />
        <div class="tool-btn-row">
          <button class="tool-btn" @click="createShort" :disabled="loading || !input">生成短链</button>
          <button class="tool-btn" @click="parseShort" :disabled="loading || !input">还原短链</button>
          <button class="tool-btn" @click="clearAll" style="margin-left:.7em;">清空</button>
        </div>
      </div>
      <div v-if="error" class="tool-error">{{ error }}</div>
      <div v-if="shortUrl || parsedUrl" class="tool-result" style="flex-direction:column;align-items:stretch;">
        <template v-if="shortUrl">
          <span>短链：<a :href="shortUrl" target="_blank" style="color:var(--primary-color,#2563eb);word-break:break-all;">{{ shortUrl }}</a></span>
          <button class="tool-btn" style="margin-top:.6em;width:140px;" @click="copy(shortUrl)">复制短链</button>
        </template>
        <template v-if="parsedUrl">
          <span>原网址：<a :href="parsedUrl" target="_blank" style="color:var(--primary-color,#2563eb);word-break:break-all;">{{ parsedUrl }}</a></span>
          <button class="tool-btn" style="margin-top:.6em;width:140px;" @click="copy(parsedUrl)">复制原网址</button>
        </template>
        <div v-if="copied" class="tool-copied">已复制！</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const shortUrl = ref('')
const parsedUrl = ref('')
const error = ref('')
const copied = ref(false)
const loading = ref(false)

async function createShort() {
  error.value = ''
  parsedUrl.value = ''
  shortUrl.value = ''
  if (!/^https?:\/\//.test(input.value.trim())) {
    error.value = '请输入合法的完整网址（需带 http/https）'
    return
  }
  loading.value = true
  try {
    // suo.yt 免费API，不用API key，直接请求即可
    const res = await fetch('https://suo.yt/api.php?url=' + encodeURIComponent(input.value.trim()))
    const text = await res.text()
    if (/^(http|https):\/\//.test(text)) {
      shortUrl.value = text
    } else {
      throw new Error(text)
    }
  } catch (e) {
    error.value = '生成失败：' + (e.message || '请稍后重试')
  }
  loading.value = false
}

async function parseShort() {
  error.value = ''
  parsedUrl.value = ''
  shortUrl.value = ''
  // suo.yt 还原接口
  loading.value = true
  try {
    const res = await fetch('https://suo.yt/api.php?act=decode&url=' + encodeURIComponent(input.value.trim()))
    const text = await res.text()
    if (/^(http|https):\/\//.test(text)) {
      parsedUrl.value = text
    } else {
      throw new Error(text)
    }
  } catch (e) {
    error.value = '还原失败：' + (e.message || '请稍后重试')
  }
  loading.value = false
}

function clearAll() {
  input.value = ''
  shortUrl.value = ''
  parsedUrl.value = ''
  error.value = ''
  copied.value = false
}

function copy(val) {
  navigator.clipboard.writeText(val)
  copied.value = true
  setTimeout(() => (copied.value = false), 1200)
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
  max-width: 550px;
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
  flex-direction: column;
  gap: 1.1em 0.8em;
  align-items: stretch;
  margin-bottom: 1.45em;
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
  margin-bottom: .4em;
  transition: border 0.18s, background 0.18s, color 0.18s;
}
.tool-btn-row {
  display: flex;
  gap: 0.9em;
  margin-bottom: .5em;
  flex-wrap: wrap;
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
  min-width: 100px;
  margin-bottom: 0;
  transition: background 0.18s, filter 0.13s;
}
.tool-btn:disabled {
  filter: grayscale(0.2);
  opacity: 0.7;
  cursor: not-allowed;
}
.tool-btn:hover:enabled {
  background: var(--btn-hover-bg, linear-gradient(90deg,#1e40af,#3b82f6));
}
.tool-error {
  color: #e25840;
  background: #fff2f0;
  border-radius: 8px;
  padding: 0.6em 1em;
  margin: 1em 0 0.8em 0;
  font-size: 1em;
}
.tool-result {
  margin-top: 1.3em;
  display: flex;
  align-items: flex-start;
  gap: 0.8em;
  font-size: 1.08em;
  word-break: break-all;
}
.tool-copied {
  color: var(--primary-color, #2563eb);
  margin-top: .8em;
  font-weight: bold;
  font-size: 1.09em;
  text-align: center;
}
a {
  text-decoration: underline;
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
  .tool-content, .tool-btn-row, .tool-result { flex-direction: column; gap: 0.7em 0; font-size: 1em;}
}
</style>
