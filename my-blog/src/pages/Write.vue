<template>
  <div class="write-container">
    <div class="write-pane">
      <h2>{{ isEdit ? '编辑文章' : '写新文章' }}</h2>

      <!-- 草稿提示栏（只有有草稿才出现） -->
      <AutoDraftBar
        :visible="showDraftBar"
        :time="draft.time"
        @restore="restoreDraft"
        @clear="clearDraft"
      />

      <input v-model="title" placeholder="请输入标题" class="input-title" />
      <TagInput v-model="tags" />
      <InputLimitTip :value="title" :limit="60" field="标题" />

      <EditorToolbar
        @command="onToolbarCommand"
        @emoji="insertEmoji"
        @image="insertImage"
        @font-size="v => fontSize = v"
      />

      <textarea
        ref="textareaRef"
        v-model="content"
        :style="{fontSize: fontSize+'px'}"
        class="input-content"
        rows="15"
        placeholder="请输入内容 (支持Markdown)"
      />

      <CharCount :content="content" :limit="5000" />
      <SaveButton :loading="saving" :disabled="!canSave" text="保存" @click="saveArticle" />
    </div>
    <div class="preview-pane">
      <div class="preview-header">
        Markdown 预览
      </div>
      <MarkdownPreview :content="content" :title="title" :font-size="fontSize" />
    </div>
    <MessageTip :show="msgShow" :message="msg" :type="msgType" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TagInput from '@/components/editor/TagInput.vue'
import EditorToolbar from '@/components/editor/EditorToolbar.vue'
import CharCount from '@/components/editor/CharCount.vue'
import SaveButton from '@/components/base/SaveButton.vue'
import InputLimitTip from '@/components/message/InputLimitTip.vue'
import MarkdownPreview from '@/components/editor/MarkdownPreview.vue'
import MessageTip from '@/components/message/MessageTip.vue'
import AutoDraftBar from '@/components/editor/AutoDraftBar.vue'
import { useDraft } from '@/composables/useDraft.js'

// 插入光标辅助函数
function insertAtCursor(el, text) {
  if (!el) return
  const [start, end] = [el.selectionStart, el.selectionEnd]
  const value = el.value
  el.value = value.slice(0, start) + text + value.slice(end)
  el.selectionStart = el.selectionEnd = start + text.length
  el.dispatchEvent(new Event('input'))
}

const router = useRouter()
const route = useRoute()
const title = ref('')
const content = ref('')
const tags = ref([])
const fontSize = ref(16)
const saving = ref(false)
const msg = ref('')
const msgType = ref('success')
const msgShow = ref(false)
const isEdit = ref(false)
const editFile = ref('')
const textareaRef = ref(null)

// 草稿逻辑
const { draft, load, save, clear } = useDraft()
const showDraftBar = ref(false)

onMounted(async () => {
  // 加载编辑模式 or 草稿
  const file = route.query.edit
  if (file) {
    isEdit.value = true
    editFile.value = file
    const raw = await fetch(`/articles/${file}`).then(res => res.text())
    const match = raw.match(/^---\n([\s\S]*?)\n---/)
    let t = '', ts = []
    if (match) {
      const front = match[1]
      const titleMatch = front.match(/title:\s*(.+)/)
      t = titleMatch ? titleMatch[1].trim() : ''
      const tagLines = front.split('\n').filter(line => line.trim().startsWith('- '))
      ts = tagLines.map(line => line.replace('- ', '').trim()).filter(Boolean)
    }
    title.value = t
    tags.value = ts
    content.value = raw.replace(/^---[\s\S]*?---/, '').replace(/^# .*\n?/, '').trim()
    showDraftBar.value = false
  } else {
    showDraftBar.value = load()
    if (showDraftBar.value) {
      // 可选：自动恢复
      // title.value = draft.value.title
      // content.value = draft.value.content
      // tags.value = draft.value.tags
    }
  }
})

// 草稿自动保存
watch([title, content, tags], ([t, c, tg]) => {
  save(t, c, tg)
  showDraftBar.value = !!t || !!c || (tg && tg.length)
})

// 草稿操作
function restoreDraft() {
  title.value = draft.value.title
  content.value = draft.value.content
  tags.value = draft.value.tags
  showDraftBar.value = false
}
function clearDraft() {
  clear()
  showDraftBar.value = false
}

// 工具栏命令
function onToolbarCommand(cmd) {
  if (!textareaRef.value) return
  if (cmd === 'bold') insertAtCursor(textareaRef.value, '**粗体**')
  if (cmd === 'italic') insertAtCursor(textareaRef.value, '*斜体*')
  if (cmd === 'h1') insertAtCursor(textareaRef.value, '# 标题\n')
  if (cmd === 'hr') insertAtCursor(textareaRef.value, '\n---\n')
  if (cmd === 'clear') {
    title.value = ''
    content.value = ''
    tags.value = []
    clearDraft()
  }
}
function insertEmoji(emoji) {
  if (!textareaRef.value) return
  insertAtCursor(textareaRef.value, emoji)
}
function insertImage(url) {
  if (!textareaRef.value) return
  insertAtCursor(textareaRef.value, `![](${url})`)
}

const canSave = computed(() =>
  title.value.trim() && content.value.trim() && title.value.length <= 60
)

// 保存
async function saveArticle() {
  if (!canSave.value) {
    msg.value = '标题或内容不合法'
    msgType.value = 'error'
    msgShow.value = true
    setTimeout(() => (msgShow.value = false), 1800)
    return
  }
  saving.value = true
  let front = `---\ntitle: ${title.value}\n`
  if (tags.value.length) {
    front += `tags:\n${tags.value.map(t => '  - ' + t).join('\n')}\n`
  }
  front += '---\n'
  let mdContent = front + '\n' + content.value

  let filename = ''
  if (isEdit.value && editFile.value) {
    filename = editFile.value
  } else {
    filename = `${new Date().toISOString().slice(0, 10)}-${title.value.trim().replace(/\s+/g, '-')}.md`
  }
  try {
    const res = await fetch('http://localhost:3001/api/article/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, content: mdContent })
    })
    const data = await res.json()
    if (data.success) {
      clearDraft()
      msg.value = '保存成功！'
      msgType.value = 'success'
      msgShow.value = true
      setTimeout(() => router.push('/'), 800)
    } else {
      msg.value = '保存失败'
      msgType.value = 'error'
      msgShow.value = true
    }
  } catch (e) {
    msg.value = '请求异常'
    msgType.value = 'error'
    msgShow.value = true
  }
  saving.value = false
}
</script>

<style>
.write-container { display: flex; gap: 2em; align-items: flex-start; max-width: 1200px; margin: 0 auto; padding: 2em 0; }
.write-pane, .preview-pane { width: 50%; min-width: 320px; }
.preview-pane { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(60,60,60,0.06); padding: 2em 1.5em; min-height: 400px; max-height: 80vh; overflow-y: auto; }
.preview-header { font-size: 1.1em; color: #646cff; margin-bottom: 1em; font-weight: bold; display: flex; align-items: center; gap: 1em;}
.fontsize-select { margin-left: 1em; border-radius: 6px; border: 1px solid #ddd; }
.input-title { width: 100%; font-size: 1.3em; margin-bottom: 1em; padding: 0.7em; border-radius: 8px; border: 1px solid #ccc; }
.input-content { width: 100%; font-size: 1em; padding: 1em; border-radius: 8px; border: 1px solid #ccc; margin-bottom: 1em; resize: vertical; min-height: 260px; }
</style>
