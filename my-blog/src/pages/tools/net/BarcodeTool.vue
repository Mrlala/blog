<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🏷️ 条形码生成工具</h2>
      <p class="tool-desc">支持输入数字、英文、常见格式的条形码，实时生成、下载、复制。</p>
      <div class="tool-content" style="flex-direction:column;align-items:stretch;">
        <input
          class="tool-input"
          v-model="text"
          placeholder="请输入要生成条形码的内容"
          @input="updateBarcode"
        />
        <div style="margin: 1em 0;">
          <label>
            格式
            <select v-model="format" class="tool-input" style="width:120px;margin-left:.5em;">
              <option value="CODE128">CODE128</option>
              <option value="EAN13">EAN13</option>
              <option value="EAN8">EAN8</option>
              <option value="UPC">UPC</option>
              <option value="CODE39">CODE39</option>
              <option value="ITF">ITF</option>
              <option value="MSI">MSI</option>
              <option value="Pharmacode">Pharmacode</option>
            </select>
          </label>
        </div>
        <div v-if="error" class="tool-error">{{ error }}</div>
        <div class="barcode-preview">
          <svg ref="barcodeRef"></svg>
        </div>
        <div class="tool-btn-row">
          <button class="tool-btn" @click="copySvg" :disabled="!text || error">复制SVG</button>
          <button class="tool-btn" @click="downloadPng" :disabled="!text || error">下载PNG</button>
        </div>
        <div v-if="copied" class="barcode-copied">已复制SVG！</div>
        <div v-if="downloaded" class="barcode-copied">已下载PNG！</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
// 需要安装 jsbarcode: npm i jsbarcode
import JsBarcode from 'jsbarcode'

const text = ref('')
const format = ref('CODE128')
const barcodeRef = ref(null)
const error = ref('')
const copied = ref(false)
const downloaded = ref(false)

function updateBarcode() {
  error.value = ''
  copied.value = false
  downloaded.value = false
  if (!text.value) {
    clearSvg()
    return
  }
  try {
    JsBarcode(barcodeRef.value, text.value, {
      format: format.value,
      lineColor: "#2563eb",
      width: 2,
      height: 84,
      displayValue: true,
      background: "transparent",
      font: "inherit"
    })
  } catch (e) {
    error.value = '不支持的内容或格式'
    clearSvg()
  }
}
function clearSvg() {
  if (barcodeRef.value) barcodeRef.value.innerHTML = ''
}
watch([text, format], updateBarcode)

function copySvg() {
  if (!barcodeRef.value) return
  const serializer = new XMLSerializer()
  const str = serializer.serializeToString(barcodeRef.value)
  const blob = new Blob([str], { type: 'image/svg+xml' })
  const data = [new ClipboardItem({ 'image/svg+xml': blob })]
  navigator.clipboard.write(data)
  copied.value = true
  setTimeout(() => copied.value = false, 1200)
}
function downloadPng() {
  if (!barcodeRef.value) return
  const svg = barcodeRef.value
  const xml = new XMLSerializer().serializeToString(svg)
  const img = new window.Image()
  const svg64 = btoa(unescape(encodeURIComponent(xml)))
  img.src = "data:image/svg+xml;base64," + svg64
  img.onload = function() {
    const canvas = document.createElement('canvas')
    canvas.width = svg.width.baseVal.value || 320
    canvas.height = svg.height.baseVal.value || 100
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `barcode.png`
    a.click()
    downloaded.value = true
    setTimeout(() => downloaded.value = false, 1200)
  }
}
onMounted(updateBarcode)
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
  margin-bottom: .4em;
}
.barcode-preview {
  margin: 1.1em 0 1.5em 0;
  padding: 1em 0.5em;
  min-height: 100px;
  background: var(--input-bg, #f8faff);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
svg {
  display: block;
  width: 320px;
  height: 100px;
  max-width: 100%;
}
.tool-btn-row {
  display: flex;
  gap: 1em;
  margin-bottom: .5em;
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
  filter: grayscale(0.3);
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
.barcode-copied {
  color: var(--primary-color, #2563eb);
  margin-top: .6em;
  font-weight: bold;
  font-size: 1.09em;
  text-align: center;
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
  .barcode-preview svg { width: 98vw !important; height: 80px !important; }
}
</style>
