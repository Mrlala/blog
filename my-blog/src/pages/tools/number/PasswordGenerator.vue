<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🔑 随机密码生成器</h2>
      <p class="tool-desc">可定制长度、强度，一键生成高安全性的密码，支持复制。</p>

      <div class="tool-content">
        <label>
          长度
          <input
            v-model.number="length"
            type="number"
            min="6"
            max="64"
            class="tool-input"
            style="width:70px"
          />
        </label>
        <label>
          <input type="checkbox" v-model="useUpper" />
          大写字母
        </label>
        <label>
          <input type="checkbox" v-model="useLower" />
          小写字母
        </label>
        <label>
          <input type="checkbox" v-model="useNumber" />
          数字
        </label>
        <label>
          <input type="checkbox" v-model="useSymbol" />
          特殊符号
        </label>
        <button class="tool-btn" @click="generate">生成密码</button>
      </div>

      <div v-if="password" class="tool-result">
        <span class="password-text">{{ password }}</span>
        <button class="tool-btn copy-btn" @click="copy">{{ copied ? '已复制!' : '复制' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const length = ref(16)
const useUpper = ref(true)
const useLower = ref(true)
const useNumber = ref(true)
const useSymbol = ref(false)
const password = ref('')
const copied = ref(false)

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUMBER = '0123456789'
const SYMBOL = '~!@#$%^&*()_+-=|,.?/<>'

function generate() {
  let chars = ''
  if (useUpper.value) chars += UPPER
  if (useLower.value) chars += LOWER
  if (useNumber.value) chars += NUMBER
  if (useSymbol.value) chars += SYMBOL
  if (!chars) {
    password.value = ''
    return
  }
  let result = ''
  for (let i = 0; i < length.value; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  password.value = result
  copied.value = false
}

function copy() {
  if (!password.value) return
  navigator.clipboard.writeText(password.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1200)
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
.tool-content label {
  font-size: 1.01em;
  color: var(--text-color-base, #1e293b);
  user-select: none;
}
.tool-input[type="number"] {
  width: 60px;
  margin-left: 6px;
  margin-right: 3px;
  font-size: 1em;
  padding: 0.38em 0.5em;
  border-radius: var(--input-radius, 10px);
  border: 1.5px solid var(--input-border, #e3e8f7);
  background: var(--input-bg, #f8faff);
  color: var(--input-text, #1e293b);
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
  margin-left: 0.8em;
  transition: background 0.18s, filter 0.13s;
}
.tool-btn:hover {
  background: var(--btn-hover-bg, linear-gradient(90deg,#1e40af,#3b82f6));
}
.tool-result {
  margin-top: 1.3em;
  display: flex;
  align-items: center;
  gap: 1.2em;
  font-size: 1.18em;
  word-break: break-all;
}
.password-text {
  font-family: 'JetBrains Mono', 'Menlo', monospace;
  font-size: 1.09em;
  color: var(--primary-color, #2563eb);
  background: var(--input-bg, #f8faff);
  padding: 0.23em 0.8em;
  border-radius: 7px;
  letter-spacing: 0.1em;
  margin-right: 0.5em;
}
.copy-btn {
  font-size: 0.98em;
  padding: 0.35em 1.18em;
  margin-left: 0;
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
  .tool-content { flex-direction: column; align-items: stretch; gap: 1em 0; }
  .tool-result { flex-direction: column; gap: 0.7em 0; font-size: 1em;}
}
</style>
