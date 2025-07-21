<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">⏰ 时间戳转换工具</h2>
      <p class="tool-desc">支持 Unix 时间戳与日期互转，自动识别秒/毫秒，支持一键复制。</p>
      <div class="tool-content" style="flex-direction: column; align-items: stretch;">
        <input
          v-model="timestamp"
          class="tool-input"
          placeholder="输入时间戳（秒或毫秒），支持负数"
        />
        <div class="tool-btn-row">
          <button class="tool-btn" @click="toDate">转为日期</button>
          <button class="tool-btn" @click="now">当前时间戳</button>
          <button class="tool-btn" @click="clearAll">清空</button>
        </div>
        <div v-if="dateStr" class="tool-result">
          <span class="tool-label">日期：</span>
          <span style="font-family:monospace;">{{ dateStr }}</span>
          <button class="tool-btn" @click="copy(dateStr)">复制</button>
        </div>
      </div>
      <div class="tool-content" style="flex-direction: column; align-items: stretch; margin-top:2em;">
        <input
          v-model="dateInput"
          class="tool-input"
          placeholder="输入日期，如 2024-01-02 15:04:05"
        />
        <div class="tool-btn-row">
          <button class="tool-btn" @click="toTimestamp">转为时间戳</button>
          <button class="tool-btn" @click="clearAll">清空</button>
        </div>
        <div v-if="tsResult" class="tool-result">
          <span class="tool-label">时间戳：</span>
          <span style="font-family:monospace;">{{ tsResult }}</span>
          <button class="tool-btn" @click="copy(tsResult)">复制</button>
        </div>
      </div>
      <div v-if="error" class="tool-error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const timestamp = ref('')
const dateStr = ref('')
const dateInput = ref('')
const tsResult = ref('')
const error = ref('')

function toDate() {
  error.value = ''
  dateStr.value = ''
  let ts = timestamp.value.trim()
  if (!ts) {
    error.value = '请输入时间戳'
    return
  }
  if (!/^[-]?\d{1,}$/.test(ts)) {
    error.value = '时间戳格式不正确'
    return
  }
  let t = Number(ts)
  if (Math.abs(t) < 1e11) t *= 1000 // 10位为秒，13位为毫秒
  try {
    const d = new Date(t)
    if (isNaN(d.getTime())) throw new Error()
    dateStr.value = formatDate(d)
  } catch {
    error.value = '无法识别该时间戳'
  }
}

function toTimestamp() {
  error.value = ''
  tsResult.value = ''
  if (!dateInput.value.trim()) {
    error.value = '请输入日期'
    return
  }
  // 兼容多种日期格式
  let d = new Date(dateInput.value.replace(/-/g, '/').replace('T', ' '))
  if (isNaN(d.getTime())) {
    error.value = '日期格式无法识别'
    return
  }
  tsResult.value = Math.floor(d.getTime() / 1000).toString()
}

function now() {
  const t = Date.now()
  timestamp.value = t.toString()
  toDate()
}

function clearAll() {
  timestamp.value = ''
  dateStr.value = ''
  dateInput.value = ''
  tsResult.value = ''
  error.value = ''
}

function copy(val) {
  navigator.clipboard.writeText(val || '')
}
function pad(n) {
  return n < 10 ? '0' + n : n
}
function formatDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
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
.tool-label {
  color: #2563eb;
  font-size: 1em;
  margin-bottom: .4em;
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
