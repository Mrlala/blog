<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">⏱️ 倒计时/闹钟</h2>
      <p class="tool-desc">可输入具体时间点或倒计时秒数，到点可提醒。</p>
      <div class="tool-content" style="flex-direction:column;align-items:stretch;">
        <div style="display:flex;gap:1em 0.9em;flex-wrap:wrap;align-items:center;">
          <label>
            到某时
            <input v-model="targetTime" type="datetime-local" class="tool-input" style="width:190px;margin-left:0.6em;">
          </label>
          <span style="color:#94a3b8">或</span>
          <label>
            秒数
            <input v-model.number="seconds" type="number" min="1" class="tool-input" style="width:90px;margin-left:0.5em;">
          </label>
          <button class="tool-btn" @click="start" :disabled="counting">开始</button>
          <button class="tool-btn" @click="reset" :disabled="!counting && !isOver">重置</button>
        </div>
      </div>
      <div v-if="counting || isOver" class="tool-result" style="margin-top:1.7em;">
        <span v-if="!isOver" style="font-size:2em;font-family:JetBrains Mono,Menlo,monospace;color:var(--primary-color,#2563eb)">
          {{ display }}
        </span>
        <span v-else style="font-size:1.4em;color:#f87171;font-weight:bold;">⏰ 时间到啦！</span>
      </div>
      <audio ref="bellRef" src="https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa2e56.mp3" preload="auto"></audio>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const targetTime = ref('')
const seconds = ref('')
const counting = ref(false)
const isOver = ref(false)
const display = ref('--:--:--')
const timer = ref(null)
const left = ref(0)
const bellRef = ref(null)

function start() {
  isOver.value = false
  // 优先targetTime，其次秒数
  let end = 0
  if (targetTime.value) {
    end = new Date(targetTime.value).getTime()
    left.value = Math.floor((end - Date.now()) / 1000)
  } else if (seconds.value && seconds.value > 0) {
    left.value = seconds.value
    end = Date.now() + left.value * 1000
  } else {
    return
  }
  if (left.value <= 0) {
    display.value = '00:00:00'
    return
  }
  counting.value = true
  timer.value = setInterval(() => {
    left.value--
    if (left.value <= 0) {
      clearInterval(timer.value)
      timer.value = null
      display.value = '00:00:00'
      counting.value = false
      isOver.value = true
      bellRef.value?.play()
    } else {
      display.value = format(left.value)
    }
  }, 1000)
  display.value = format(left.value)
}
function reset() {
  clearInterval(timer.value)
  timer.value = null
  counting.value = false
  isOver.value = false
  display.value = '--:--:--'
  targetTime.value = ''
  seconds.value = ''
}
function format(sec) {
  if (sec < 0) sec = 0
  const d = Math.floor(sec / 86400)
  sec = sec % 86400
  const h = Math.floor(sec / 3600)
  sec = sec % 3600
  const m = Math.floor(sec / 60)
  const s = sec % 60
  let str = [h + d * 24, m, s].map(n => String(n).padStart(2, '0')).join(':')
  if (d > 0) str = d + '天 ' + str
  return str
}
onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
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
  max-width: 440px;
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
  margin-bottom: .2em;
  transition: border 0.18s, background 0.18s, color 0.18s;
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
  align-items: center;
  gap: 0.8em;
  font-size: 1.3em;
  word-break: break-all;
  justify-content: center;
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
}
</style>
