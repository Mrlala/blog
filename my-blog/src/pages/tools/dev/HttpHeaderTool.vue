<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🧾 HTTP Header生成工具</h2>
      <p class="tool-desc">常见 HTTP 请求头参数，一键复制，适合接口测试、API 调试等场景。</p>
      <div class="tool-content" style="flex-direction: column; align-items: stretch;">
        <div v-for="(header, idx) in headers" :key="header.name" class="header-row">
          <div class="header-label">
            <span class="header-name">{{ header.name }}</span>
            <span class="header-desc">{{ header.desc }}</span>
          </div>
          <div class="header-value-row">
            <input
              class="tool-input"
              v-model="header.value"
              :readonly="header.readonly"
              :placeholder="'请输入' + header.name + '值'"
            />
            <button class="tool-btn copy-btn" @click="copy(idx)">
              {{ copiedIdx === idx ? '已复制' : '复制' }}
            </button>
          </div>
        </div>
        <div style="margin: 1.2em 0 0.5em; opacity:.6; font-size:.96em;">
          常用场景：接口请求、API 测试、模拟浏览器等。可自由编辑值再复制。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const headers = ref([
  { name: 'Content-Type', value: 'application/json', desc: '请求体格式', readonly: false },
  { name: 'Authorization', value: 'Bearer ', desc: '身份令牌/JWT', readonly: false },
  { name: 'Accept', value: 'application/json', desc: '期望返回类型', readonly: false },
  { name: 'User-Agent', value: 'Mozilla/5.0', desc: '客户端类型', readonly: false },
  { name: 'Referer', value: '', desc: '请求来源页面', readonly: false },
  { name: 'Origin', value: '', desc: '请求发起域', readonly: false },
  { name: 'Cookie', value: '', desc: '附带Cookie', readonly: false },
  { name: 'X-Requested-With', value: 'XMLHttpRequest', desc: '标识异步请求', readonly: false },
])

const copiedIdx = ref(-1)

function copy(idx) {
  const header = headers.value[idx]
  if (!header.value) return
  navigator.clipboard.writeText(header.name + ': ' + header.value)
  copiedIdx.value = idx
  setTimeout(() => { copiedIdx.value = -1 }, 1300)
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
  flex-direction: column;
  gap: 1.15em 0;
  align-items: stretch;
  margin-bottom: 1.45em;
}
.header-row {
  margin-bottom: .4em;
}
.header-label {
  display: flex;
  align-items: center;
  gap: 1.3em;
  margin-bottom: 0.3em;
  font-size: 1.01em;
}
.header-name {
  font-weight: bold;
  color: var(--primary-color, #2563eb);
}
.header-desc {
  color: var(--card-abstract-color, #8ca0ba);
  font-size: .97em;
}
.header-value-row {
  display: flex;
  gap: 0.7em;
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
}
.tool-btn {
  border-radius: var(--btn-radius, 999px);
  padding: 0.39em 1.35em;
  background: var(--btn-bg, linear-gradient(90deg,#75c7fa,#4e8ef7));
  color: var(--btn-text,#fff);
  font-weight: 600;
  font-size: 1.02em;
  border: none;
  cursor: pointer;
  min-width: 86px;
  transition: background 0.18s, filter 0.13s;
}
.tool-btn:hover:enabled, .copy-btn:hover:enabled {
  background: var(--btn-hover-bg, linear-gradient(90deg,#1e40af,#3b82f6));
}
@media (max-width: 900px) {
  .tool-card { max-width: 100vw; }
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
  .header-value-row { flex-direction: column; gap: 0.4em; }
}
</style>
