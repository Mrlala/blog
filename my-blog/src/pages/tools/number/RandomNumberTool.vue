<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🎲 随机数生成器</h2>
      <p class="tool-desc">支持设置范围和数量，快速生成随机整数或小数。</p>
      <div class="tool-content" style="flex-direction:column;align-items:stretch;">
        <div class="rand-row">
          <label>
            最小值
            <input class="tool-input" v-model.number="min" type="number" placeholder="最小值" />
          </label>
          <label>
            最大值
            <input class="tool-input" v-model.number="max" type="number" placeholder="最大值" />
          </label>
          <label>
            数量
            <input class="tool-input" v-model.number="count" type="number" min="1" max="100" style="width:70px" />
          </label>
        </div>
        <div class="rand-row">
          <label>
            <input type="checkbox" v-model="isFloat" />
            生成小数
          </label>
          <label v-if="isFloat" style="margin-left:1.1em;">
            小数位数
            <input class="tool-input" v-model.number="fixed" type="number" min="1" max="12" style="width:60px" />
          </label>
        </div>
        <div class="rand-btn-row">
          <button class="tool-btn" @click="generate">生成</button>
          <button class="tool-btn" @click="clearAll" style="margin-left:.8em;">清空</button>
        </div>
      </div>
      <div v-if="error" class="tool-error">{{ error }}</div>
      <div v-if="result.length" class="tool-result" style="flex-direction:column;align-items:stretch;">
        <div style="display:flex;align-items:center;gap:1.1em;">
          <span style="font-weight:bold;">结果：</span>
          <button class="tool-btn" @click="copyAll">全部复制</button>
        </div>
        <div class="rand-result-list">
          <span
            class="rand-number"
            v-for="(num, idx) in result"
            :key="idx"
            @click="copy(num)"
            :title="'点击复制'"
          >{{ num }}</span>
        </div>
        <div v-if="copiedText" class="rand-copied">已复制 {{ copiedText }}！</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const min = ref(1)
const max = ref(100)
const count = ref(1)
const isFloat = ref(false)
const fixed = ref(2)
const error = ref('')
const result = ref([])
const copiedText = ref('')

function generate() {
  error.value = ''
  result.value = []
  if (isNaN(min.value) || isNaN(max.value) || isNaN(count.value)) {
    error.value = '请填写正确的数值'
    return
  }
  if (max.value < min.value) {
    error.value = '最大值不能小于最小值'
    return
  }
  if (count.value < 1 || count.value > 100) {
    error.value = '数量建议 1 ~ 100'
    return
  }
  const nums = []
  for (let i = 0; i < count.value; i++) {
    if (isFloat.value) {
      const n = Math.random() * (max.value - min.value) + min.value
      nums.push(Number(n.toFixed(fixed.value)))
    } else {
      nums.push(Math.floor(Math.random() * (max.value - min.value + 1)) + min.value)
    }
  }
  result.value = nums
  copiedText.value = ''
}
function clearAll() {
  min.value = 1
  max.value = 100
  count.value = 1
  result.value = []
  error.value = ''
  copiedText.value = ''
}
function copy(num) {
  navigator.clipboard.writeText(String(num))
  copiedText.value = num
  setTimeout(() => (copiedText.value = ''), 1200)
}
function copyAll() {
  if (!result.value.length) return
  navigator.clipboard.writeText(result.value.join(', '))
  copiedText.value = '全部'
  setTimeout(() => (copiedText.value = ''), 1200)
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
.rand-row {
  display: flex;
  align-items: center;
  gap: 1.3em;
  margin-bottom: .8em;
  flex-wrap: wrap;
}
.rand-btn-row {
  display: flex;
  gap: 0.9em;
  margin-top: .5em;
  flex-wrap: wrap;
}
.tool-input {
  font-size: 1em;
  padding: 0.38em 0.5em;
  border-radius: var(--input-radius, 10px);
  border: 1.5px solid var(--input-border, #e3e8f7);
  background: var(--input-bg, #f8faff);
  color: var(--input-text, #1e293b);
  width: 100px;
  box-sizing: border-box;
  font-family: inherit;
  margin-left: .4em;
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
.rand-result-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6em;
  margin: 0.6em 0 0.1em 0;
}
.rand-number {
  background: var(--input-bg, #f8faff);
  border-radius: 6px;
  padding: 0.18em 0.8em;
  font-family: 'JetBrains Mono', monospace;
  cursor: pointer;
  transition: background 0.18s, color 0.13s;
  border: 1px solid #e3e8f7;
}
.rand-number:hover {
  background: var(--primary-color, #2563eb);
  color: #fff;
}
.rand-copied {
  color: var(--primary-color, #2563eb);
  margin-top: .8em;
  font-weight: bold;
  font-size: 1.09em;
  text-align: center;
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
  .rand-row, .rand-btn-row, .tool-result, .rand-result-list { flex-direction: column; gap: 0.7em 0; font-size: 1em;}
  .tool-input { width: 100%; }
}
</style>
