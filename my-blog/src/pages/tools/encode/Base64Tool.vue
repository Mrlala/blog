<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🅱️ Base64 编解码</h2>
      <p class="tool-desc">
        支持文本、代码、中文等内容，轻松进行 Base64 编码与解码。
      </p>

      <div class="tool-content" style="flex-direction: column; align-items: stretch;">
        <textarea
          v-model="input"
          class="tool-input tool-textarea"
          rows="4"
          placeholder="请输入要编码或解码的内容"
        ></textarea>
        <div class="tool-btn-row">
          <button class="tool-btn" @click="encode">编码</button>
          <button class="tool-btn" @click="decode">解码</button>
          <button class="tool-btn" @click="copy" :disabled="!output">{{ copied ? '已复制!' : '复制结果' }}</button>
          <button class="tool-btn" @click="clearAll">清空</button>
        </div>
      </div>

      <div v-if="error" class="tool-error">{{ error }}</div>

      <div v-if="output" class="tool-result" style="flex-direction: column;align-items: stretch;">
        <label class="tool-label">结果：</label>
        <textarea
          class="tool-input tool-textarea"
          :value="output"
          readonly
          rows="4"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const output = ref('')
const error = ref('')
const copied = ref(false)

function encode() {
  error.value = ''
  output.value = ''
  try {
    if (!input.value.trim()) {
      error.value = '请输入内容'
      return
    }
    output.value = btoa(unescape(encodeURIComponent(input.value)))
  } catch (e) {
    error.value = '编码失败，内容可能不合法'
  }
  copied.value = false
}

function decode() {
  error.value = ''
  output.value = ''
  try {
    if (!input.value.trim()) {
      error.value = '请输入内容'
      return
    }
    output.value = decodeURIComponent(escape(atob(input.value)))
  } catch (e) {
    error.value = '解码失败，内容可能不是有效的 Base64 字符串'
  }
  copied.value = false
}

function copy() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1200)
}

function clearAll() {
  input.value = ''
  output.value = ''
  error.value = ''
  copied.value = false
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
.tool-textarea {
  resize: vertical;
  font-family: 'JetBrains Mono', 'Menlo', 'monospace';
  min-height: 80px;
  max-height: 400px;
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
