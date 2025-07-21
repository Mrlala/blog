<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">👤 随机昵称生成器</h2>
      <p class="tool-desc">支持多种风格昵称，快速生成用于社交、游戏、网站注册。</p>
      <div class="tool-content" style="flex-direction:column;align-items:stretch;">
        <div style="display:flex;gap:1.1em 0.8em;flex-wrap:wrap;">
          <label>
            风格
            <select v-model="style" class="tool-input" style="margin-left:.7em;width:110px;">
              <option value="cute">可爱</option>
              <option value="funny">搞怪</option>
              <option value="anime">二次元</option>
              <option value="tech">科技</option>
              <option value="normal">普通</option>
            </select>
          </label>
          <label style="margin-left:1.8em;">
            数量
            <input v-model.number="count" type="number" min="1" max="20" class="tool-input" style="width:60px;margin-left:6px;">
          </label>
          <button class="tool-btn" @click="generate">生成</button>
        </div>
        <div v-if="names.length" class="nickname-list">
          <div
            v-for="(name,i) in names"
            :key="name+i"
            class="nickname-item"
            @click="copy(name)"
            :title="'点击复制：' + name"
          >
            <span>{{ name }}</span>
            <span v-if="copiedIdx===i" class="copied-tip">已复制！</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const style = ref('cute')
const count = ref(5)
const names = ref([])
const copiedIdx = ref(-1)

const dicts = {
  cute: ['小熊', '小兔', '软糖', '糯米团', '樱桃', '团子', '毛球', '软妹', '嘟嘟', '咕咕', '甜豆', '豆豆', '团宝', '乐乐', '球球', '橘子', '花卷'],
  funny: ['皮皮虾', '火锅侠', '吃土少女', '酷哥', '马里奥', '捣蛋鬼', '柠檬精', '瓜皮', '滑稽', '柚子大王', '搞笑达人', '土豆泥', '肥宅', '皮蛋'],
  anime: ['初音', '小埋', '桐人', '雷姆', '阿库娅', '无名', '椎名', '辉夜', '白上吹雪', '亚丝娜', '伊蕾娜', '凛酱', '一方通行', '阿纲', '阿良良木'],
  tech: ['字节跳动', '码农', '量子君', 'AI小将', '芯片侠', '蓝屏侠', 'root', '云端', 'Git猫', '0x7e', '404', 'RobotX', '终端', '数据库'],
  normal: ['小明', '小红', '晓磊', '阿伟', '琪琪', '欣欣', '晨晨', '明明', '飞飞', '超超', '大壮', '阿楠', '婷婷']
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomName(type) {
  const pre = ['小', '超', '大', '阿', '', '', '', ''];
  const suf = ['酱', '仔', '君', '', '', '', ''];
  const core = getRandom(dicts[type])
  return getRandom(pre) + core + getRandom(suf)
}

function generate() {
  const type = style.value
  let arr = []
  for (let i = 0; i < count.value; i++) {
    arr.push(randomName(type))
  }
  names.value = arr
  copiedIdx.value = -1
}

function copy(name) {
  navigator.clipboard.writeText(name)
  copiedIdx.value = names.value.indexOf(name)
  setTimeout(() => (copiedIdx.value = -1), 1000)
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
  max-width: 480px;
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
.nickname-list {
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  margin-top: 1.2em;
}
.nickname-item {
  padding: .68em 1em;
  background: var(--input-bg, #f8faff);
  border-radius: 9px;
  font-size: 1.09em;
  color: var(--primary-color, #2563eb);
  cursor: pointer;
  user-select: all;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.18s, color 0.18s;
  border: 1.3px solid transparent;
}
.nickname-item:hover {
  background: #e7f2ff;
  border: 1.3px solid var(--primary-color, #2563eb);
  color: var(--primary-color, #2563eb);
}
.copied-tip {
  margin-left: 1.2em;
  color: #26a67c;
  font-size: .97em;
  font-weight: 600;
  letter-spacing: 0.05em;
  user-select: none;
  transition: color 0.16s;
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
}
</style>
