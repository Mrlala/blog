<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🔀 JSON Diff 对比工具</h2>
      <p class="tool-desc">对比两个 JSON 的差异，高亮展示不同，支持格式化、粘贴。</p>
      <div class="tool-content" style="flex-direction: column; align-items: stretch;">
        <div class="jsondiff-input-row">
          <textarea
            class="tool-input tool-input-area"
            v-model="jsonA"
            placeholder="左侧 JSON"
            rows="7"
          />
          <textarea
            class="tool-input tool-input-area"
            v-model="jsonB"
            placeholder="右侧 JSON"
            rows="7"
          />
        </div>
        <div class="tool-btn-row">
          <button class="tool-btn" @click="compare" :disabled="!jsonA || !jsonB">对比</button>
          <button class="tool-btn" @click="clearAll">清空</button>
        </div>
      </div>
      <div v-if="error" class="tool-error">{{ error }}</div>
      <div v-if="diffResult" class="tool-result" style="flex-direction: column;align-items: stretch;">
        <label style="margin-bottom:.5em;font-weight:600;">差异结果（仅显示不同项）：</label>
        <pre class="diff-pre" v-html="diffResult"></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 简单diff实现，若需更强大可用 jsondiffpatch、deep-diff 等包
function jsonDiff(objA, objB, path = '') {
  let result = ''
  for (const k in objA) {
    const curPath = path ? path + '.' + k : k
    if (!(k in objB)) {
      result += `<div><span class="diff-key">${curPath}</span>: <span class="diff-del">${JSON.stringify(objA[k])}</span> <b>- 左侧独有</b></div>`
    } else if (typeof objA[k] === 'object' && objA[k] && typeof objB[k] === 'object' && objB[k]) {
      result += jsonDiff(objA[k], objB[k], curPath)
    } else if (objA[k] !== objB[k]) {
      result += `<div><span class="diff-key">${curPath}</span>: <span class="diff-del">${JSON.stringify(objA[k])}</span> <span class="diff-add">${JSON.stringify(objB[k])}</span> <b>- 不同</b></div>`
    }
  }
  for (const k in objB) {
    const curPath = path ? path + '.' + k : k
    if (!(k in objA)) {
      result += `<div><span class="diff-key">${curPath}</span>: <span class="diff-add">${JSON.stringify(objB[k])}</span> <b>- 右侧独有</b></div>`
    }
  }
  return result
}

const jsonA = ref('')
const jsonB = ref('')
const diffResult = ref('')
const error = ref('')

function compare() {
  error.value = ''
  diffResult.value = ''
  let a, b
  try {
    a = JSON.parse(jsonA.value)
    b = JSON.parse(jsonB.value)
  } catch {
    error.value = '两个输入必须都是合法的 JSON'
    return
  }
  const html = jsonDiff(a, b)
  diffResult.value = html || '<span style="color:var(--primary-color,#2563eb);">完全一致</span>'
}

function clearAll() {
  jsonA.value = ''
  jsonB.value = ''
  diffResult.value = ''
  error.value = ''
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
.jsondiff-input-row {
  display: flex;
  gap: 1.2em;
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
  min-height: 120px;
  resize: vertical;
  margin-bottom: 1em;
  font-family: 'JetBrains Mono', 'Menlo', 'Consolas', monospace;
  font-size: 1.04em;
  line-height: 1.5;
}
.tool-btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9em;
  margin-top: 1em;
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
.diff-pre {
  background: var(--input-bg, #f8faff);
  border-radius: 10px;
  border: 1.5px solid var(--input-border, #e3e8f7);
  color: var(--input-text, #1e293b);
  font-size: 1.03em;
  font-family: 'JetBrains Mono', 'Menlo', 'Consolas', monospace;
  padding: 1em;
  margin-bottom: 0;
  margin-top: 0;
  overflow-x: auto;
  line-height: 1.6;
  white-space: pre-wrap;
}
.diff-key {
  color: var(--primary-color, #2563eb);
  font-weight: bold;
}
.diff-add {
  color: #389e3c;
  font-weight: bold;
}
.diff-del {
  color: #e25840;
  font-weight: bold;
}
@media (max-width: 900px) {
  .tool-card { max-width: 100vw; }
  .jsondiff-input-row { flex-direction: column; gap: 0.5em;}
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
  .tool-content, .tool-btn-row, .tool-result { flex-direction: column; gap: 0.7em 0; font-size: 1em;}
}
</style>
