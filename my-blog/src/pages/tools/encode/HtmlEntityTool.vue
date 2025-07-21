<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🔗 HTML 实体转码工具</h2>
      <p class="tool-desc">支持 HTML 标签转实体、实体转 HTML，可批量处理特殊符号。</p>
      <div class="tool-content" style="flex-direction: column; align-items: stretch;">
        <textarea
          class="tool-input tool-input-area"
          v-model="input"
          placeholder="请输入要处理的内容，支持 HTML 标签或实体"
          rows="6"
        />
        <div class="tool-btn-row">
          <button class="tool-btn" @click="encode">转实体</button>
          <button class="tool-btn" @click="decode">实体转回HTML</button>
          <button class="tool-btn" @click="clearAll" style="margin-left:.6em;">清空</button>
        </div>
      </div>
      <div v-if="output !== null" class="tool-result" style="flex-direction: column;">
        <label style="margin-bottom:.45em; color:var(--primary-color,#2563eb);font-weight:600;">
          转换结果（可复制）：
        </label>
        <textarea
          class="tool-input tool-input-area"
          :value="output"
          readonly
          rows="6"
          style="margin-bottom:0"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const output = ref(null)

function encode() {
  // 只对特殊字符转实体
  output.value = (input.value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
function decode() {
  output.value = (input.value || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}
function clearAll() {
  input.value = ''
  output.value = null
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
  min-height: 100px;
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
@media (max-width: 900px) {
  .tool-card { max-width: 100vw; }
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
  .tool-content, .tool-btn-row, .tool-result { flex-direction: column; gap: 0.7em 0; font-size: 1em;}
}
</style>
