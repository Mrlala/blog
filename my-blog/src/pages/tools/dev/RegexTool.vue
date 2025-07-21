<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🧬 正则表达式测试</h2>
      <p class="tool-desc">实时测试、匹配与高亮文本，支持全局/多行/区分大小写。</p>
      <div class="tool-content" style="flex-direction:column;align-items:stretch;">
        <label>
          <span style="margin-right:.5em;">正则表达式</span>
          <input
            v-model="pattern"
            class="tool-input"
            placeholder="请输入正则表达式，如 ^[a-z]+$"
            style="width:100%;"
          />
        </label>
        <div style="display:flex;gap:1.2em 0.9em;flex-wrap:wrap;margin-bottom:.5em;">
          <label><input type="checkbox" v-model="flags.g" /> 全局 g</label>
          <label><input type="checkbox" v-model="flags.i" /> 忽略大小写 i</label>
          <label><input type="checkbox" v-model="flags.m" /> 多行 m</label>
        </div>
        <label>
          <span style="margin-right:.5em;">待测试文本</span>
          <textarea
            v-model="testText"
            class="tool-input"
            style="min-height:100px;resize:vertical;width:100%;font-family:inherit;"
            placeholder="在这里输入要匹配的内容"
          ></textarea>
        </label>
        <div class="tool-btn-row">
          <button class="tool-btn" @click="test">测试</button>
          <button class="tool-btn" @click="clearAll">清空</button>
        </div>
      </div>
      <div v-if="error" class="tool-error">{{ error }}</div>
      <div v-if="matches.length" class="tool-result" style="flex-direction:column;align-items:stretch;">
        <div style="color:#64748b;margin-bottom:.8em;">
          匹配 {{ matches.length }} 处：
        </div>
        <pre class="regex-highlight" v-html="highlightedText"></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const pattern = ref('')
const testText = ref('')
const flags = ref({ g: true, i: false, m: false })
const matches = ref([])
const highlightedText = ref('')
const error = ref('')

function test() {
  error.value = ''
  matches.value = []
  highlightedText.value = ''
  if (!pattern.value) return
  let flagStr = Object.entries(flags.value).filter(([k,v])=>v).map(([k])=>k).join('')
  let reg
  try {
    reg = new RegExp(pattern.value, flagStr)
  } catch (e) {
    error.value = '正则表达式有误：' + e.message
    return
  }
  let arr = []
  let idx = 0
  let t = testText.value
  if (flagStr.includes('g')) {
    arr = [...t.matchAll(reg)]
  } else {
    let m = t.match(reg)
    if (m) arr.push(m)
  }
  matches.value = arr
  // 高亮所有匹配
  if (!arr.length) {
    highlightedText.value = escapeHtml(t)
    return
  }
  let pieces = []
  let last = 0
  for (const m of arr) {
    let start = m.index
    let end = m.index + (m[0]?.length || 0)
    pieces.push(escapeHtml(t.slice(last, start)))
    pieces.push(`<span class="match-highlight">${escapeHtml(m[0])}</span>`)
    last = end
  }
  pieces.push(escapeHtml(t.slice(last)))
  highlightedText.value = pieces.join('')
}
function clearAll() {
  pattern.value = ''
  testText.value = ''
  matches.value = []
  highlightedText.value = ''
  error.value = ''
}
function escapeHtml(s) {
  return s.replace(/[<>&"]/g, c => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;'
  }[c]))
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
  max-width: 540px;
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
  flex-direction: column;
  gap: 1.1em 0.8em;
  align-items: stretch;
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
.regex-highlight {
  background: var(--input-bg, #f8faff);
  color: var(--input-text, #1e293b);
  border-radius: 8px;
  font-family: inherit;
  font-size: 1.05em;
  padding: 0.7em 1em;
  margin-top: .6em;
  white-space: pre-wrap;
  line-height: 1.75;
}
.match-highlight {
  background: #ffe699;
  color: #ad2d00;
  border-radius: 4px;
  padding: 0 3px;
  margin: 0 1.5px;
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
}
</style>
