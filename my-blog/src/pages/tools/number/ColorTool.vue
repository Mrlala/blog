<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🎨 颜色值转换工具</h2>
      <p class="tool-desc">支持 RGB、HEX、HSL 相互转换，实时预览与复制色值。</p>
      <div class="tool-content" style="flex-direction:column;align-items:stretch;">
        <input
          class="tool-input"
          v-model="input"
          placeholder="请输入 HEX(#abc123)、RGB(255,87,51) 或 HSL(11,100%,60%)"
          @input="onInput"
        />
        <div class="color-preview-row">
          <div class="color-preview-box" :style="{ background: previewColor }"></div>
          <span v-if="valid" class="color-preview-label">预览</span>
          <span v-else class="color-error">无法识别色值</span>
        </div>
        <div v-if="valid" class="color-result">
          <div class="color-result-row">
            <span>HEX：</span>
            <span class="color-value">{{ hex }}</span>
            <button class="tool-btn" @click="copy(hex)">复制</button>
          </div>
          <div class="color-result-row">
            <span>RGB：</span>
            <span class="color-value">{{ rgb }}</span>
            <button class="tool-btn" @click="copy(rgb)">复制</button>
          </div>
          <div class="color-result-row">
            <span>HSL：</span>
            <span class="color-value">{{ hsl }}</span>
            <button class="tool-btn" @click="copy(hsl)">复制</button>
          </div>
        </div>
        <div v-if="copiedText" class="color-copied">已复制 {{ copiedText }}！</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 状态
const input = ref('')
const valid = ref(false)
const hex = ref('')
const rgb = ref('')
const hsl = ref('')
const previewColor = ref('#ffffff')
const copiedText = ref('')

// 工具函数
function parseColor(val) {
  // HEX
  let match = val.match(/^#?([\da-f]{3}|[\da-f]{6})$/i)
  if (match) {
    let hexStr = match[1].length === 3
      ? '#' + match[1].split('').map(x => x + x).join('')
      : '#' + match[1]
    let rgbArr = hex2rgbArr(hexStr)
    return { hex: hexStr, rgb: rgbArr, hsl: rgb2hsl(rgbArr) }
  }
  // RGB
  match = val.match(/rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i)
  if (match) {
    let arr = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
    let hexStr = rgbArr2hex(arr)
    return { hex: hexStr, rgb: arr, hsl: rgb2hsl(arr) }
  }
  // HSL
  match = val.match(/hsl\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)/i)
  if (match) {
    let arr = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
    let rgbArr = hsl2rgb(arr)
    let hexStr = rgbArr2hex(rgbArr)
    return { hex: hexStr, rgb: rgbArr, hsl: arr }
  }
  return null
}
function hex2rgbArr(hex) {
  hex = hex.replace(/^#/, '')
  let num = parseInt(hex, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}
function rgbArr2hex(arr) {
  return '#' + arr.map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
}
function rgb2hsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255
  let max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) h = s = 0
  else {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h = Math.round(h * 60)
  }
  s = Math.round(s * 100)
  l = Math.round(l * 100)
  return [h, s, l]
}
function hsl2rgb([h, s, l]) {
  s /= 100; l /= 100
  let c = (1 - Math.abs(2 * l - 1)) * s
  let x = c * (1 - Math.abs((h / 60) % 2 - 1))
  let m = l - c / 2
  let [r, g, b] = [0, 0, 0]
  if (h < 60)      [r, g, b] = [c, x, 0]
  else if (h < 120)[r, g, b] = [x, c, 0]
  else if (h < 180)[r, g, b] = [0, c, x]
  else if (h < 240)[r, g, b] = [0, x, c]
  else if (h < 300)[r, g, b] = [x, 0, c]
  else             [r, g, b] = [c, 0, x]
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
}

function onInput() {
  copiedText.value = ''
  const val = input.value.trim()
  if (!val) {
    valid.value = false
    previewColor.value = '#ffffff'
    return
  }
  const parsed = parseColor(val)
  if (parsed) {
    valid.value = true
    hex.value = parsed.hex
    rgb.value = `rgb(${parsed.rgb.join(', ')})`
    hsl.value = `hsl(${parsed.hsl.join(', ')}%)`
    previewColor.value = parsed.hex
  } else {
    valid.value = false
    previewColor.value = '#ffffff'
  }
}
function copy(text) {
  navigator.clipboard.writeText(text)
  copiedText.value = text
  setTimeout(() => (copiedText.value = ''), 1300)
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
  max-width: 650px;
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
  margin-bottom: .4em;
  transition: border 0.18s, background 0.18s, color 0.18s;
}
.color-preview-row {
  display: flex;
  align-items: center;
  gap: 1.1em;
  margin-bottom: 0.6em;
}
.color-preview-box {
  width: 3.2em;
  height: 3.2em;
  border-radius: 10px;
  border: 1.2px solid #cdd6e1;
  box-shadow: 0 2px 8px #aac6ff18;
}
.color-preview-label {
  font-size: 1.05em;
  color: #3888ff;
}
.color-error {
  color: #f33;
  font-size: 1.01em;
}
.color-result {
  margin-top: 1.1em;
}
.color-result-row {
  display: flex;
  align-items: center;
  gap: 0.8em;
  font-size: 1.1em;
  margin-bottom: 0.4em;
}
.color-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.08em;
  background: var(--input-bg, #f8faff);
  padding: 0.18em 0.65em;
  border-radius: 8px;
}
.tool-btn {
  border-radius: var(--btn-radius, 999px);
  padding: 0.38em 1.19em;
  background: var(--btn-bg, linear-gradient(90deg,#75c7fa,#4e8ef7));
  color: var(--btn-text,#fff);
  font-weight: 600;
  font-size: 1.02em;
  border: none;
  cursor: pointer;
  min-width: 90px;
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
.color-copied {
  color: var(--primary-color, #2563eb);
  margin-top: 1em;
  font-weight: bold;
  font-size: 1.07em;
  text-align: center;
}
@media (max-width: 700px) {
  .tool-card { max-width: 99vw; }
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
}
</style>
