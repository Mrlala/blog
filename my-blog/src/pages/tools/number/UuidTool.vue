<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🆔 UUID 生成工具</h2>
      <p class="tool-desc">支持批量生成 UUID v4/v1，一键复制全部。</p>
      <div class="tool-content" style="flex-direction: column; align-items: stretch;">
        <label style="margin-bottom:1em;">
          <span style="margin-right:1.2em;">生成数量：</span>
          <input
            type="number"
            v-model.number="count"
            min="1"
            max="100"
            class="tool-input"
            style="width:80px;display:inline-block"
          />
        </label>
        <div style="margin-bottom:1em;">
          <label style="margin-right:1.3em;">
            <input type="radio" v-model="version" value="v4" /> v4（随机）
          </label>
          <label>
            <input type="radio" v-model="version" value="v1" /> v1（基于时间）
          </label>
        </div>
        <div class="tool-btn-row">
          <button class="tool-btn" @click="generate">生成</button>
          <button class="tool-btn" @click="clearAll">清空</button>
        </div>
      </div>
      <div v-if="output.length" class="tool-result" style="flex-direction: column;align-items: stretch;">
        <label class="tool-label">生成结果：</label>
        <textarea
          class="tool-input tool-textarea"
          :value="output.join('\n')"
          readonly
          rows="6"
        ></textarea>
        <div class="tool-btn-row">
          <button class="tool-btn" @click="copy" :disabled="!output.length">{{ copied ? '已复制!' : '复制全部' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 需要 uuid 库
import { v4 as uuidv4, v1 as uuidv1 } from 'uuid'

const count = ref(5)
const version = ref('v4')
const output = ref([])
const copied = ref(false)

function generate() {
  output.value = []
  let num = Number(count.value)
  if (isNaN(num) || num < 1) num = 1
  if (num > 100) num = 100
  output.value = Array.from({ length: num }, () =>
    version.value === 'v1' ? uuidv1() : uuidv4()
  )
  copied.value = false
}

function copy() {
  if (!output.value.length) return
  navigator.clipboard.writeText(output.value.join('\n'))
  copied.value = true
  setTimeout(() => (copied.value = false), 1200)
}

function clearAll() {
  output.value = []
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
  min-height: 90px;
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
@media (max-width: 900px) {
  .tool-card { max-width: 100vw; }
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
  .tool-content, .tool-btn-row, .tool-result { flex-direction: column; gap: 0.7em 0; font-size: 1em;}
}
</style>
