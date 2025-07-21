<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">😀 Emoji 复制工具</h2>
      <p class="tool-desc">点击 Emoji 即可复制，支持搜索，常用表情一键获取！</p>
      <div class="tool-content" style="flex-direction: column;">
        <input
          class="tool-input"
          v-model="search"
          type="text"
          placeholder="🔍 搜索 emoji 或含义…"
        />
        <div v-if="filteredEmoji.length === 0" class="tools-empty" style="margin-top:2em;">
          没有找到相关 emoji
        </div>
        <div class="emoji-list">
          <div
            v-for="(emoji, i) in filteredEmoji"
            :key="emoji.char + i"
            class="emoji-item"
            @click="copy(emoji.char)"
            :title="emoji.label"
          >
            <span class="emoji-char">{{ emoji.char }}</span>
            <span class="emoji-label">{{ emoji.label }}</span>
          </div>
        </div>
        <div v-if="copied" class="emoji-copied">已复制！</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emojiList = [
  { char: "😀", label: "笑脸" }, { char: "😂", label: "大笑" },
  { char: "😊", label: "微笑" }, { char: "😍", label: "喜欢" },
  { char: "😭", label: "哭泣" }, { char: "😎", label: "酷" },
  { char: "🥰", label: "心动" }, { char: "😏", label: "得意" },
  { char: "😉", label: "眨眼" }, { char: "😜", label: "调皮" },
  { char: "😇", label: "天使" }, { char: "🥳", label: "庆祝" },
  { char: "😡", label: "生气" }, { char: "🤔", label: "思考" },
  { char: "😴", label: "睡觉" }, { char: "🤩", label: "星星眼" },
  { char: "😱", label: "惊讶" }, { char: "😓", label: "尴尬" },
  { char: "😅", label: "憨笑" }, { char: "😘", label: "亲吻" },
  { char: "👀", label: "看" },   { char: "👍", label: "赞" },
  { char: "👎", label: "踩" },   { char: "🙏", label: "祈祷" },
  { char: "👏", label: "鼓掌" }, { char: "💪", label: "加油" },
  { char: "❤️", label: "爱心" },{ char: "🔥", label: "火" },
  { char: "💡", label: "灵感" },{ char: "🎉", label: "庆祝" }
  // 可继续扩充
]

const search = ref('')
const copied = ref(false)

const filteredEmoji = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return emojiList
  return emojiList.filter(e =>
    e.char.includes(q) || e.label.toLowerCase().includes(q)
  )
})

function copy(char) {
  navigator.clipboard.writeText(char)
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
  margin-bottom: .4em;
  transition: border 0.18s, background 0.18s, color 0.18s;
}
.emoji-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
  gap: 1em 1.2em;
  margin: 1.3em 0 0.5em 0;
}
.emoji-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35em;
  cursor: pointer;
  background: var(--input-bg, #f8faff);
  border-radius: 14px;
  padding: 0.62em 0.2em;
  border: 1.2px solid transparent;
  transition: background 0.18s, border 0.18s;
  user-select: none;
  font-size: 1.15em;
}
.emoji-item:hover {
  background: var(--cover-thumb-active-bg, #eef7ff);
  border-color: var(--primary-color, #2563eb);
}
.emoji-char {
  font-size: 2.1em;
  margin-bottom: 0.04em;
}
.emoji-label {
  color: #64748b;
  font-size: .98em;
  margin-top: -0.25em;
  letter-spacing: .02em;
}
.emoji-copied {
  margin-top: 1.5em;
  color: var(--primary-color, #2563eb);
  font-weight: bold;
  text-align: center;
  font-size: 1.13em;
  letter-spacing: 0.05em;
  transition: opacity 0.28s;
}
.tools-empty {
  text-align: center;
  color: #8993b4;
  font-size: 1.12em;
  letter-spacing: .08em;
}
@media (max-width: 700px) {
  .tool-card { max-width: 99vw; }
  .emoji-list { grid-template-columns: repeat(auto-fit, minmax(65px, 1fr)); }
}
@media (max-width: 600px) {
  .tool-card { padding: 1.2em 0.6em; }
}
</style>
