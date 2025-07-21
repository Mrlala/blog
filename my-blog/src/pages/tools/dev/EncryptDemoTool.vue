<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🔒 加密演示工具</h2>
      <p class="tool-desc">快速体验常用前端字符串加密算法，支持 MD5、SHA1、SHA256、Base64、AES 等。</p>
      <div class="tool-content" style="flex-direction:column;align-items:stretch;">
        <textarea
          class="tool-input"
          v-model="input"
          rows="3"
          placeholder="请输入需要加密/解密的内容"
        />
        <div class="enc-row">
          <label>
            算法
            <select class="tool-select" v-model="algo">
              <option value="md5">MD5</option>
              <option value="sha1">SHA1</option>
              <option value="sha256">SHA256</option>
              <option value="base64-encode">Base64 编码</option>
              <option value="base64-decode">Base64 解码</option>
              <option value="aes-encrypt">AES 加密</option>
              <option value="aes-decrypt">AES 解密</option>
            </select>
          </label>
          <label v-if="algo.startsWith('aes-')" style="margin-left:1.8em;">
            密钥
            <input class="tool-input" v-model="aesKey" placeholder="AES 密钥(16/24/32位)" />
          </label>
          <button class="tool-btn" @click="doEncrypt" style="margin-left:2em;">执行</button>
        </div>
      </div>
      <div v-if="error" class="tool-error">{{ error }}</div>
      <div v-if="output !== ''" class="tool-result" style="margin-top:1.3em;">
        <span style="font-weight:bold;">结果：</span>
        <span class="enc-output">{{ output }}</span>
        <button class="tool-btn" @click="copy" style="margin-left:1.2em;">{{ copied ? "已复制" : "复制" }}</button>
      </div>
      <div style="margin-top:2.3em;opacity:.7;font-size:.96em;">
        <ul style="margin-left:1.7em;">
          <li>MD5/SHA 系列结果为摘要不可逆。</li>
          <li>AES 加密/解密为可逆对称加密，密钥必须一致。</li>
          <li>Base64 仅适用于短文本和二进制。</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
// 需安装: npm i crypto-js
import { ref } from 'vue'
import CryptoJS from 'crypto-js'

const input = ref('')
const output = ref('')
const algo = ref('md5')
const error = ref('')
const copied = ref(false)
const aesKey = ref('')

function doEncrypt() {
  error.value = ''
  output.value = ''
  if (!input.value) {
    error.value = '请输入需要加密/解密的内容'
    return
  }
  try {
    switch (algo.value) {
      case 'md5':
        output.value = CryptoJS.MD5(input.value).toString()
        break
      case 'sha1':
        output.value = CryptoJS.SHA1(input.value).toString()
        break
      case 'sha256':
        output.value = CryptoJS.SHA256(input.value).toString()
        break
      case 'base64-encode':
        output.value = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(input.value))
        break
      case 'base64-decode':
        output.value = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(input.value))
        break
      case 'aes-encrypt':
        if (!aesKey.value) throw new Error('请输入 AES 密钥')
        output.value = CryptoJS.AES.encrypt(input.value, aesKey.value).toString()
        break
      case 'aes-decrypt':
        if (!aesKey.value) throw new Error('请输入 AES 密钥')
        output.value = CryptoJS.AES.decrypt(input.value, aesKey.value).toString(CryptoJS.enc.Utf8)
        break
      default:
        error.value = '暂不支持该算法'
    }
  } catch (e) {
    error.value = '加密/解密失败，请检查输入或密钥'
  }
}
function copy() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => copied.value = false, 1200)
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
  max-width: 900px;
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
.enc-row {
  display: flex;
  align-items: center;
  gap: 1.2em;
  margin-top: 1em;
  flex-wrap: wrap;
}
.tool-select {
  font-size: 1em;
  padding: 0.36em 0.9em;
  border-radius: var(--input-radius, 10px);
  border: 1.3px solid var(--input-border, #e3e8f7);
  background: var(--input-bg, #f8faff);
  color: var(--input-text, #1e293b);
  margin-left: 0.8em;
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
  margin-bottom: .1em;
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
  display: flex;
  align-items: center;
  gap: 0.8em;
  font-size: 1.08em;
  word-break: break-all;
}
.enc-output {
  font-family: 'JetBrains Mono', 'Menlo', monospace;
  background: var(--input-bg, #f8faff);
  padding: 0.14em 0.9em;
  border-radius: 7px;
  margin-left: .3em;
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
  .tool-content, .enc-row, .tool-result { flex-direction: column; gap: 0.7em 0; font-size: 1em;}
}
</style>
