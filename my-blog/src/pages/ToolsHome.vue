<script setup>
import { ref, computed } from 'vue'

// 工具分组（每组一个 Tab）
const toolGroups = [
  {
    name: '文本工具',
    key: 'text',
    tools: [
      { name: '文本去重', path: '/tools/text-dedup', icon: '🗑️', desc: '批量去除重复行' },
      { name: '查找替换', path: '/tools/text-replace', icon: '🔍', desc: '批量查找并替换' },
      { name: '大小写转换', path: '/tools/text-case', icon: '🔡', desc: '一键切换大小写' },
      { name: '字数统计', path: '/tools/text-count', icon: '✏️', desc: '实时统计字符/行数' },
      { name: '行排序/反转', path: '/tools/text-sort', icon: '↕️', desc: '批量排序/反转行' },
    ]
  },
  {
    name: '编码/解码工具',
    key: 'encode',
    tools: [
      { name: 'URL 编码解码', path: '/tools/urlencode', icon: '🌐', desc: '网址内容编码/解码' },
      { name: 'Base64 编解码', path: '/tools/base64', icon: '🅱️', desc: '文本或图片Base64编码/解码' },
      { name: 'HTML 实体转码', path: '/tools/html-entity', icon: '🔗', desc: 'HTML 实体编码/解码' },
      { name: 'Unicode 转换', path: '/tools/unicode', icon: '🔣', desc: '字符串与Unicode互转' },
      { name: '图片转Base64', path: '/tools/img2base64', icon: '🖼️', desc: '图片转Base64字符串' },
      { name: 'Base64转图片', path: '/tools/base64img', icon: '📷', desc: 'Base64字符串转图片' },
      { name: 'Markdown转HTML', path: '/tools/md2html', icon: '📝', desc: 'Markdown格式化与预览' }
    ]
  },
  {
    name: '开发/格式化',
    key: 'dev',
    tools: [
      { name: 'JSON 格式化', path: '/tools/json', icon: '🧩', desc: '格式化、压缩、校验JSON' },
      { name: 'JSON Diff', path: '/tools/json-diff', icon: '🔀', desc: '对比两个JSON差异' },
      { name: '正则表达式测试', path: '/tools/regex', icon: '🔗', desc: '实时匹配高亮' },
      { name: 'Cron 解析', path: '/tools/cron', icon: '⏳', desc: 'Cron表达式解析' },
      { name: 'HTTP Header生成', path: '/tools/http-header', icon: '🧾', desc: '常用HTTP Header工具' },
      { name: 'Emoji 复制', path: '/tools/emoji', icon: '😀', desc: 'Emoji拾取与复制' },
      { name: '加密演示', path: '/tools/encrypt', icon: '🔒', desc: '多种前端加密算法' }
    ]
  },
  {
    name: '转换/数值工具',
    key: 'number',
    tools: [
      { name: '进制转换', path: '/tools/convert', icon: '🔢', desc: '二/八/十/十六进制互转' },
      { name: '时间戳转换', path: '/tools/timestamp', icon: '⏰', desc: 'Unix时间戳/日期互转' },
      { name: '颜色值转换', path: '/tools/color', icon: '🎨', desc: 'RGB/HEX/HSL互转' },
      { name: 'UUID 生成', path: '/tools/uuid', icon: '🆔', desc: '多种UUID版本' },
      { name: '随机密码', path: '/tools/password', icon: '🔑', desc: '高强度密码生成' },
      { name: '随机数生成', path: '/tools/random', icon: '🎲', desc: '指定范围随机数' }
    ]
  },
  {
    name: '网络与其它',
    key: 'net',
    tools: [
      { name: '二维码生成', path: '/tools/qrcode', icon: '📱', desc: '文本、网址二维码生成' },
      { name: '条形码生成', path: '/tools/barcode', icon: '🏷️', desc: '条形码快速生成' },
      { name: '短链生成', path: '/tools/shorturl', icon: '🔗', desc: '短网址生成与还原' },
      { name: '随机昵称', path: '/tools/nickname', icon: '👤', desc: '有趣昵称随机生成' },
      { name: '倒计时', path: '/tools/countdown', icon: '⏱️', desc: '简易倒计时/闹钟' },
      { name: '计时器', path: '/tools/timer', icon: '⏲️', desc: '简易计时器功能' }, 
      // { name: '大转盘抽奖', path: '/tools/luck-tool', icon: '🎡', desc: '幸运大转盘抽奖工具' },
 ]
  }
]

const activeTab = ref(toolGroups[0].key)
const search = ref('')

const currentTools = computed(() => {
  const currentGroup = toolGroups.find(g => g.key === activeTab.value)
  if (!currentGroup) return []
  const q = search.value.trim().toLowerCase()
  if (!q) return currentGroup.tools
  return currentGroup.tools.filter(tool =>
    tool.name.toLowerCase().includes(q) || tool.desc.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div class="tool-bg">
    <div class="tool-card">
      <h2 class="tool-title">🔧 实用小工具中心</h2>
      <!-- Tab 切换 -->
      <div class="tool-tabs">
        <div
          v-for="group in toolGroups"
          :key="group.key"
          class="tool-tab"
          :class="{active: activeTab === group.key}"
          @click="activeTab = group.key"
        >{{ group.name }}</div>
        <input
          v-model="search"
          type="search"
          class="tool-search-input"
          placeholder="🔍 搜索本类工具…"
        />
      </div>
      <div v-if="currentTools.length === 0" class="tools-empty">
        <span>未找到相关工具</span>
      </div>
      <div class="tools-list">
        <router-link
          v-for="tool in currentTools"
          :key="tool.path"
          :to="tool.path"
          class="tool-item"
        >
          <div class="tool-icon">{{ tool.icon }}</div>
          <div>
            <div class="tool-name">{{ tool.name }}</div>
            <div class="tool-desc">{{ tool.desc }}</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-bg {
  min-height: 100vh;
  background: var(--body-color, #f8fafb);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 2.8em;
  transition: background 0.3s;
}
.tool-card {
  width: 100%;
  max-width: 1200px;
  background: var(--card-color, #fff);
  border-radius: var(--card-radius, 1.5em);
  box-shadow: var(--card-shadow, 0 6px 28px 0 rgba(80,90,120,0.09));
  padding: 2.2em 1.5em 2.4em;
  color: var(--text-color-base, #1e293b);
  margin-bottom: 3.5em;
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;
}
.tool-title {
  font-size: 2em;
  font-weight: 900;
  margin-bottom: 1.7em;
  color: var(--primary-color, #2563eb);
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 0.5em;
}

/* Tab栏 */
.tool-tabs {
  display: flex;
  align-items: center;
  gap: 1.2em;
  margin-bottom: 2.1em;
  flex-wrap: wrap;
}
.tool-tab {
  background: var(--tag-bg, #f1f5fa);
  color: var(--tag-text, #5b7fa7);
  border-radius: var(--tag-radius, 2em);
  font-weight: 600;
  font-size: 1.12em;
  padding: 0.64em 1.8em;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
  border: none;
  box-shadow: none;
  outline: none;
}
.tool-tab.active {
  background: var(--tag-active-bg, #2563eb);
  color: var(--tag-active-text, #fff);
  border: 2px solid var(--tag-active-border, #2563eb);
  box-shadow: none; /* 去除蓝色发光 */
}
.tool-tab:not(.active):hover {
  background: var(--tagitem-hover-bg, #e8f1ff);
  color: var(--primary-color, #2563eb);
}

.tool-search-input {
  flex: 1 1 300px;
  min-width: 200px;
  max-width: 380px;
  margin-left: auto;
  padding: 0.55em 1.3em;
  border-radius: 999px;
  border: 1.3px solid var(--input-border, #e3e8f7);
  background: var(--input-bg, #f8faff);
  color: var(--input-text, #1e293b);
  font-size: 1.08em;
  box-shadow: 0 2px 10px 0 rgba(180,200,255,0.09) inset;
  outline: none;
  transition: border 0.2s, background 0.22s, color 0.22s;
}
.tool-search-input::placeholder {
  color: var(--input-placeholder, #b1b7c7);
}
.tool-search-input:focus {
  border-color: var(--input-focus-border, #60a5fa);
  background: var(--input-focus-bg, #fff);
}

.tools-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(288px, 1fr));
  gap: 1.4em 1.7em;
  margin-top: 0.5em;
}
.tool-item {
  display: flex;
  align-items: flex-start;
  gap: 1.1em;
  background: var(--card-color, #fff);
  border-radius: var(--card-radius, 1.5em);
  border: 2.5px solid var(--card-border, #ecedf3);
  padding: 1.3em 1.3em;
  font-size: 1.14em;
  color: var(--text-color-base, #1e293b);
  text-decoration: none;
  box-shadow: 0 1px 10px #282c3455;
  cursor: pointer;
  transition: background 0.21s, border 0.19s, color 0.21s, box-shadow 0.19s;
  position: relative;
}
.tool-item:hover,
.tool-item:focus,
.tool-item.active {
  background: var(--cover-thumb-active-bg, #eef7ff);
  border-color: var(--card-hover-border, #7cb3ff);
  color: var(--primary-color, #2563eb);
  /* 柔和投影，无发光 */
  box-shadow: 0 4px 16px 0 rgba(80,90,120,0.11);
}
.tool-item .tool-icon {
  font-size: 2.14em;
  flex-shrink: 0;
  line-height: 1;
  margin-top: 0.03em;
  filter: none; /* 移除图标发光 */
}
.tool-item .tool-name {
  font-weight: bold;
  font-size: 1.09em;
  margin-bottom: 0.16em;
  color: var(--card-title-color, #234087);
  letter-spacing: 0.01em;
}
.tool-item .tool-desc {
  font-size: 0.99em;
  color: var(--card-abstract-color, #5a6d8c);
  margin-top: 0.12em;
}

.tools-empty {
  text-align: center;
  color: var(--no-article-color, #8993b4);
  margin: 2.5em 0 3em 0;
  font-size: 1.18em;
  letter-spacing: .08em;
}
@media (max-width: 900px) {
  .tool-card { max-width: 99vw; }
  .tools-list { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .tool-card { padding: 1.3em 0.5em; }
  .tool-title { font-size: 1.13em; }
  .tool-tabs { gap: 0.5em; }
}
</style>


