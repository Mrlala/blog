<template>
  <div class="spin-bg">
    <div class="spin-card">
      <h2 class="spin-title">🎡 大转盘抽奖</h2>
      <p class="spin-desc">添加、编辑、选择预设，一键随机抽取！</p>

      <div class="preset-bar">
        <label>预设选项组：</label>
        <select v-model="presetKey" class="spin-select">
          <option disabled value="">-- 请选择 --</option>
          <option v-for="(pset, key) in presets" :key="key" :value="key">{{ pset.name }}</option>
        </select>
        <button class="spin-btn" style="margin-left: .8em;" @click="loadPreset" :disabled="!presetKey">导入</button>
      </div>

      <div class="awards-edit">
        <div v-for="(item, idx) in awards" :key="idx" class="awards-item">
          <input v-model="awards[idx]" class="spin-input" placeholder="奖项名称" maxlength="18" />
          <button class="spin-btn spin-btn-del" @click="removeAward(idx)" v-if="awards.length > 2">🗑️</button>
        </div>
        <button class="spin-btn" style="margin-top:0.8em;" @click="addAward" :disabled="awards.length>=maxAwards">➕ 添加奖项</button>
      </div>

      <div class="wheel-wrap">
        <canvas ref="canvas" :width="canvasSize" :height="canvasSize"></canvas>
        <div class="wheel-pointer">▼</div>
      </div>

      <div class="spin-btn-row">
        <button class="spin-btn spin-btn-main" @click="spin" :disabled="spinning || awards.length<2">开始抽奖</button>
      </div>

      <div v-if="result !== null" class="spin-result">
        🎉 恭喜抽中 <span class="spin-item">{{ result }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

// --- 数据与常量 ---
const maxAwards = 12
const dpr = window.devicePixelRatio || 1
const baseSize = 340
const canvasSize = baseSize * dpr
const canvas = ref(null)

const presets = {
  cities: {
    name: "随机旅游城市",
    items: ["成都", "北京", "西安", "上海", "三亚", "南京", "桂林", "厦门", "拉萨", "青岛", "香港", "乌鲁木齐"]
  },
  food: {
    name: "外卖午餐决策",
    items: ["麻辣烫", "盖饭", "烤肉拌饭", "牛肉拉面", "麻辣香锅", "汉堡", "黄焖鸡", "炸鸡", "面条", "自助餐", "饺子", "寿司"]
  },
  weekday: {
    name: "值班/今日之神",
    items: ["王者之神", "打扫之神", "健身之神", "摸鱼之神", "学习之神", "点名之神"]
  },
  classic: {
    name: "经典示例",
    items: ["一等奖", "二等奖", "三等奖", "再来一次", "谢谢参与"]
  }
}

const awards = ref([...presets.classic.items])
const presetKey = ref('')
const result = ref(null)
const spinning = ref(false)
const angle = ref(0)

// --- 奖项增删 ---
function addAward() {
  if (awards.value.length < maxAwards) awards.value.push('')
}
function removeAward(idx) {
  if (awards.value.length > 2) awards.value.splice(idx, 1)
}
function loadPreset() {
  if (presetKey.value && presets[presetKey.value]) {
    awards.value = [...presets[presetKey.value].items]
    result.value = null
    angle.value = 0
    nextTick(drawWheel)
  }
}

// --- 转盘绘制 ---
function drawWheel() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvasSize, canvasSize)
  ctx.save()
  ctx.scale(dpr, dpr)
  const n = awards.value.length
  if (!n) return
  const radius = baseSize / 2
  const segmentAngle = 2 * Math.PI / n
  const colors = [
    "#60a5fa", "#fbbf24", "#aee3fa", "#b7c8fd", "#f87171", "#a5b4fc",
    "#5eead4", "#f9a8d4", "#fde68a", "#818cf8", "#34d399", "#d946ef"
  ]
  for (let i = 0; i < n; i++) {
    const start = angle.value + segmentAngle * i
    const end = start + segmentAngle

    // 扇形块
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(radius, radius)
    ctx.arc(radius, radius, radius - 2, start, end)
    ctx.closePath()
    ctx.fillStyle = colors[i % colors.length]
    ctx.shadowColor = '#6662'
    ctx.shadowBlur = 3
    ctx.fill()
    ctx.restore()

    // 文字（关键修正！）
    ctx.save()
    ctx.translate(radius, radius)
    ctx.rotate(start + segmentAngle / 2)
    let txt = awards.value[i] || '——'
    // 长度自适应字体
    let fontSize = 19
    if (txt.length > 8) fontSize = 15
    if (txt.length > 12) { txt = txt.slice(0,12) + "…"; fontSize = 13 }
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#222'
    // 外环位置
    ctx.fillText(txt, 0, -radius * 0.74)
    ctx.restore()
  }
  ctx.restore()

  // 中心白圆
  ctx.save()
  ctx.beginPath()
  ctx.arc(canvasSize/2, canvasSize/2, 52*dpr, 0, 2*Math.PI)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.restore()
  // 外边框
  ctx.beginPath()
  ctx.arc(canvasSize/2, canvasSize/2, canvasSize/2-2*dpr, 0, 2*Math.PI)
  ctx.lineWidth = 3*dpr
  ctx.strokeStyle = '#2563eb'
  ctx.stroke()
}

watch([awards, angle], () => nextTick(drawWheel))
onMounted(() => {
  nextTick(() => {
    if (canvas.value) {
      canvas.value.width = baseSize * dpr
      canvas.value.height = baseSize * dpr
      canvas.value.style.width = baseSize + 'px'
      canvas.value.style.height = baseSize + 'px'
    }
    drawWheel()
  })
})

// --- 抽奖动画 ---
function spin() {
  // 过滤无效奖项
  const filteredAwards = awards.value.map(s=>s.trim()).filter(Boolean)
  if (spinning.value || filteredAwards.length < 2) return
  spinning.value = true
  result.value = null
  // 随机中奖
  const n = filteredAwards.length
  const winner = Math.floor(Math.random() * n)
  const segmentAngle = 2 * Math.PI / n
  // 中奖块中线旋转到-90°
  const stopAt = 8 * 2 * Math.PI + (-Math.PI / 2) - (winner * segmentAngle + segmentAngle / 2)
  let start = angle.value
  let t = 0
  const duration = 2500 + Math.random() * 400
  function animate() {
    t += 16
    const progress = Math.min(t / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    angle.value = start + (stopAt - start) * ease
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      spinning.value = false
      angle.value = angle.value % (2 * Math.PI)
      result.value = filteredAwards[winner]
    }
  }
  animate()
}
</script>

<style scoped>
.spin-bg {
  min-height: 100vh;
  background: var(--body-color, #181f2b);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 2.4em;
}
.spin-card {
  width: 100%;
  max-width: 490px;
  background: var(--card-color, #232b3a);
  border-radius: 1.4em;
  box-shadow: 0 4px 24px #3a4e7a22;
  padding: 2em 1.4em 2.4em;
  color: #e7eefd;
  margin-bottom: 3.5em;
  transition: background 0.3s, color 0.3s;
}
.spin-title {
  font-size: 1.36em;
  font-weight: bold;
  margin-bottom: 0.16em;
  color: #60a5fa;
}
.spin-desc {
  font-size: 1em;
  color: #a4b1cb;
  margin-bottom: 1.25em;
}
.preset-bar {
  display: flex;
  align-items: center;
  gap: 0.7em;
  margin-bottom: 1.2em;
}
.spin-select {
  padding: 0.25em 0.6em;
  font-size: 1em;
  border-radius: 8px;
  border: 1.5px solid #33415f;
  background: #222a36;
  color: #b4d5ff;
  outline: none;
}
.awards-edit {
  margin-bottom: 1.5em;
}
.awards-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;
  gap: 0.5em;
}
.spin-input {
  flex: 1;
  font-size: 1em;
  padding: 0.32em 0.7em;
  border-radius: 10px;
  border: 1.5px solid #33415f;
  background: #1b2231;
  color: #e0e7ef;
  outline: none;
  margin-right: 0.2em;
  transition: border 0.2s;
}
.spin-btn {
  padding: 0.24em 1em;
  border-radius: 999px;
  border: none;
  background: linear-gradient(90deg,#75c7fa,#4e8ef7);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.16s, filter 0.13s;
  margin: 0 0.1em;
}
.spin-btn-del {
  background: #f87171;
  color: #fff;
  padding: 0.24em 0.8em;
}
.spin-btn:disabled {
  filter: grayscale(0.25);
  opacity: 0.68;
  cursor: not-allowed;
}
.spin-btn-row {
  display: flex;
  justify-content: center;
  margin-top: 1.2em;
  margin-bottom: 0.6em;
}
.spin-btn-main {
  background: linear-gradient(90deg,#2f80ed,#1cb5e0);
  font-size: 1.08em;
  padding: 0.52em 1.5em;
  font-weight: 700;
}
.wheel-wrap {
  position: relative;
  margin: 0 auto;
  width: 340px;
  height: 340px;
  user-select: none;
  margin-top: 1.2em;
  margin-bottom: 0.2em;
}
canvas {
  background: #192338;
  border-radius: 50%;
  box-shadow: 0 2px 14px #60a5fa17;
  display: block;
  width: 340px;
  height: 340px;
}
.wheel-pointer {
  position: absolute;
  left: 50%;
  top: 8px;
  transform: translateX(-50%);
  color: #60a5fa;
  font-size: 2.9em;
  pointer-events: none;
  text-shadow: 0 1px 12px #60a5fa22;
  z-index: 2;
  line-height: 1;
}
.spin-result {
  margin: 1.2em 0 0.5em 0;
  font-size: 1.15em;
  text-align: center;
  color: #60a5fa;
  letter-spacing: 0.05em;
}
.spin-item {
  font-weight: bold;
  font-size: 1.2em;
  color: #fbbf24;
  margin: 0 0.1em;
}
@media (max-width: 600px) {
  .spin-card { padding: 1.1em 0.1em; }
  .wheel-wrap, canvas { width: 90vw !important; height: 90vw !important; }
}
</style>
