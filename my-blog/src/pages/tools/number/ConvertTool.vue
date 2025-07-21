<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🔢 进制转换工具</h2>
      <p class="tool-desc">支持二/八/十/十六进制互相转换，输入自动校验。</p>
      <div class="tool-content" style="flex-direction: column; align-items: stretch;">
        <input
          class="tool-input"
          v-model="input"
          :placeholder="'请输入' + radixLabel(fromRadix) + '数字'"
        />
        <div style="margin: .7em 0;">
          <label v-for="(v, i) in radixes" :key="v" style="margin-right:1.3em;">
            <input type="radio" v-model="fromRadix" :value="v" />
            {{radixLabel(v)}}
          </label>
        </div>
        <div class="tool-btn-row">
          <button class="tool-btn" @click="convert">转换</button>
          <button class="tool-btn" @click="clearAll">清空</button>
        </div>
      </div>
      <div v-if="error" class="tool-error">{{ error }}</div>
      <div v-if="result" class="tool-result" style="flex-direction: column;align-items: flex-start;">
        <div v-for="(v, i) in radixes" :key="v" style="margin-bottom:.3em;">
          <span>{{ radixLabel(v) }}: </span>
          <span style="font-family:monospace;">{{ result[v] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const fromRadix = ref(10)
const error = ref('')
const result = ref(null)

const radixes = [2, 8, 10, 16]
const labels = ['二进制', '八进制', '十进制', '十六进制']
const radixLabel = r => labels[radixes.indexOf(r)]

function convert() {
  error.value = ''
  result.value = null
  let val = input.value.trim()
  if (!val) {
    error.value = '请输入内容'
    return
  }
  let num = 0
  try {
    num = parseInt(val, fromRadix.value)
    if (isNaN(num)) throw new Error()
  } catch {
    error.value = `不是有效的${radixLabel(fromRadix.value)}数字`
    return
  }
  // 负数兼容
  let unsigned = val.startsWith('-') ? '-' : ''
  num = Math.abs(num)
  result.value = {
    2: unsigned + num.toString(2),
    8: unsigned + num.toString(8),
    10: unsigned + num.toString(10),
    16: unsigned + num.toString(16).toUpperCase()
  }
}

function clearAll() {
  input.value = ''
  result.value = null
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
