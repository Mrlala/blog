<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">⏳ Cron 表达式解析</h2>
      <p class="tool-desc">解析常见的 Linux/Unix Cron 表达式，显示含义与下次执行时间。</p>
      <div class="tool-content" style="flex-direction: column; align-items: stretch;">
        <input
          class="tool-input"
          v-model="cron"
          placeholder="请输入标准 Cron 表达式，如：*/5 * * * *"
        />
        <div class="tool-btn-row">
          <button class="tool-btn" @click="parse" :disabled="!cron">解析</button>
          <button class="tool-btn" @click="clearAll" style="margin-left:.6em;">清空</button>
        </div>
      </div>
      <div v-if="error" class="tool-error">{{ error }}</div>
      <div v-if="result" class="tool-result" style="flex-direction: column;align-items: flex-start;">
        <div style="margin-bottom:.8em;"><b>含义：</b>{{ result.description }}</div>
        <div><b>下次执行时间：</b>{{ result.nextTime }}</div>
      </div>
      <div style="margin-top:2.1em;opacity:.65;font-size:.95em;">
        <b>常见例子：</b>
        <ul style="margin:.4em 0 .3em 1.7em;">
          <li>每分钟：<code>* * * * *</code></li>
          <li>每小时第0分：<code>0 * * * *</code></li>
          <li>每天0点：<code>0 0 * * *</code></li>
          <li>每月1号0点：<code>0 0 1 * *</code></li>
          <li>每周一0点：<code>0 0 * * 1</code></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 推荐 npm i cron-parser --save
import parser from 'cron-parser'

const cron = ref('')
const result = ref(null)
const error = ref('')

function parse() {
  error.value = ''
  result.value = null
  try {
    const interval = parser.parseExpression(cron.value)
    // 简易描述
    result.value = {
      description: cronDesc(cron.value),
      nextTime: interval.next().toString(),
    }
  } catch (e) {
    error.value = '无效的 Cron 表达式'
  }
}
function clearAll() {
  cron.value = ''
  result.value = null
  error.value = ''
}

// 简单自然语言描述（可扩展完善）
function cronDesc(cronStr) {
  // 这里只做部分常用模式的直观翻译
  if (/^\* \* \* \* \*$/.test(cronStr)) return '每分钟执行一次'
  if (/^0 \* \* \* \*$/.test(cronStr)) return '每小时整点执行'
  if (/^0 0 \* \* \*$/.test(cronStr)) return '每天0点执行'
  if (/^0 0 1 \* \*$/.test(cronStr)) return '每月1日0点执行'
  if (/^0 0 \* \* 1$/.test(cronStr)) return '每周一0点执行'
  return '标准 Cron 表达式（详情见下次执行时间）'
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
@media (max-width: 900px) {
  .tool-card { max-width: 100vw; }
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
  .tool-content, .tool-btn-row, .tool-result { flex-direction: column; gap: 0.7em 0; font-size: 1em;}
}
</style>
