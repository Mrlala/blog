<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">⏲️ 计时器</h2>
      <p class="tool-desc">一键开始/暂停/重置，支持毫秒显示，适合健身、专注、烹饪等。</p>
      <div class="tool-content" style="flex-direction:column;align-items:center;">
        <div class="timer-value">{{ display }}</div>
        <div class="tool-btn-row">
          <button class="tool-btn" @click="toggle" :style="{minWidth:'92px'}">
            {{ running ? '暂停' : (elapsed ? '继续' : '开始') }}
          </button>
          <button class="tool-btn" @click="reset" :disabled="!elapsed">重置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const running = ref(false)
const elapsed = ref(0) // ms
const timer = ref(null)
const startAt = ref(0)
const display = ref('00:00:00.000')

function format(ms) {
  const sec = Math.floor(ms / 1000)
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const ms3 = ms % 1000
  return [
    h.toString().padStart(2, '0'),
    m.toString().padStart(2, '0'),
    s.toString().padStart(2, '0')
  ].join(':') + '.' + ms3.toString().padStart(3, '0')
}

function update() {
  display.value = format(elapsed.value + (running.value ? (Date.now() - startAt.value) : 0))
}

function toggle() {
  if (running.value) {
    // 暂停
    elapsed.value += Date.now() - startAt.value
    running.value = false
    clearInterval(timer.value)
    update()
  } else {
    // 开始/继续
    startAt.value = Date.now()
    running.value = true
    timer.value = setInterval(update, 29)
  }
}

function reset() {
  running.value = false
  clearInterval(timer.value)
  elapsed.value = 0
  display.value = '00:00:00.000'
}

onUnmounted(() => {
  clearInterval(timer.value)
})

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
  max-width: 400px;
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
  gap: 1.2em;
  align-items: center;
  margin-bottom: 1.45em;
}
.timer-value {
  font-family: 'JetBrains Mono', 'Menlo', monospace;
  font-size: 2.3em;
  font-weight: bold;
  color: var(--primary-color, #2563eb);
  margin-bottom: .8em;
  background: var(--input-bg, #f8faff);
  padding: 0.18em 0.7em 0.21em;
  border-radius: 0.5em;
  min-width: 340px;
  text-align: center;
  letter-spacing: 0.04em;
  box-shadow: 0 1px 7px #60a5fa11;
  transition: background 0.3s, color 0.3s;
}
.tool-btn-row {
  display: flex;
  gap: 0.9em;
  flex-wrap: wrap;
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
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
  .timer-value { font-size: 1.2em; min-width: 80vw; }
}
</style>
