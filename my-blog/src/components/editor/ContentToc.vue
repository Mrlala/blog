<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-2">
    <!-- 自动保存提示条 -->
    <AutoDraftBar
      v-if="showDraftBar"
      :status="draftStatus"
      @restore="handleRestore"
      @clear="handleClear"
      class="mb-4"
    />

    <div class="max-w-2xl mx-auto bg-white/90 shadow-2xl rounded-3xl p-8 relative backdrop-blur-md border border-blue-100">
      <h2 class="text-3xl font-extrabold mb-8 text-blue-800 flex items-center gap-3 tracking-tight drop-shadow-sm">
        <svg width="1.6em" height="1.6em" fill="none" viewBox="0 0 24 24"><path d="M8 20h8M8 20v-5a4 4 0 1 1 8 0v5M16 20v-5a4 4 0 0 0-8 0v5M9 7h6m-3 0V4m0 3V4" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        {{ isEdit ? '编辑文章' : '写新文章' }}
      </h2>

      <!-- 标题输入 -->
      <div class="mb-5">
        <input
          v-model="title"
          placeholder="请输入标题，最好能一眼吸引人！"
          maxlength="60"
          class="w-full px-5 py-4 rounded-2xl border-2 border-blue-100 focus:border-blue-400 bg-blue-50/60 text-2xl font-bold text-gray-900 placeholder-gray-400 shadow-inner transition"
        />
        <InputLimitTip :value="title" :limit="60" field="标题" class="float-right mt-1" />
      </div>

      <!-- 标签输入 -->
      <div class="mb-6">
        <TagInput v-model="tags" />
      </div>

      <!-- 编辑器工具栏 -->
      <EditorToolbar
        class="mb-3 bg-white rounded-xl shadow border border-blue-100"
        @emoji="insertEmoji"
        @image="insertImage"
        @font-size="v => fontSize = v"
        @command="onToolbarCommand"
      />

      <!-- 图片上传 -->
      <ImageUploader class="mb-4" @upload="handleImageUpload" />

      <!-- 内容输入框 -->
      <div class="relative mb-2">
        <textarea
          ref="textareaRef"
          v-model="content"
          :style="{fontSize: fontSize+'px'}"
          class="w-full h-80 px-5 py-4 rounded-2xl border-2 border-blue-100 focus:border-blue-400 bg-blue-50/60 text-base font-mono shadow-inner resize-vertical placeholder-gray-400 transition"
          placeholder="请输入正文内容，支持 Markdown 语法（配合上方工具栏体验更佳）"
          maxlength="20000"
        />
        <CharCount :value="content" :limit="20000" class="absolute bottom-2 right-4" />
      </div>

      <!-- 预览/目录（可选显示） -->
      <div class="my-8 grid gap-8 md:grid-cols-2">
        <div>
          <MarkdownPreview :content="content" class="rounded-xl border border-blue-100 bg-white/70 shadow p-4" />
        </div>
        <div>
          <ContentToc :content="content" class="rounded-xl border border-blue-100 bg-white/70 shadow p-4" />
        </div>
      </div>

      <!-- 保存/发布按钮 -->
      <SaveButton
        class="w-full py-4 mt-8 text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white rounded-2xl shadow-xl tracking-wide transition disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
        :loading="submitting"
        :disabled="submitting"
        @click="handleSubmit"
      >
        {{ submitting ? '发布中...' : '发布' }}
      </SaveButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import AutoDraftBar from '@/components/editor/AutoDraftBar.vue'
import TagInput from '@/components/editor/TagInput.vue'
import EditorToolbar from '@/components/editor/EditorToolbar.vue'
import ImageUploader from '@/components/editor/ImageUploader.vue'
import CharCount from '@/components/editor/CharCount.vue'
import InputLimitTip from '@/components/message/InputLimitTip.vue'
import MarkdownPreview from '@/components/editor/MarkdownPreview.vue'
import ContentToc from '@/components/editor/ContentToc.vue'
import SaveButton from '@/components/base/SaveButton.vue'

const props = defineProps({
  isEdit: Boolean,
  submitting: Boolean,
  initialTitle: String,
  initialContent: String,
  initialTags: Array,
})
const emit = defineEmits(['submit'])

const title = ref(props.initialTitle || '')
const content = ref(props.initialContent || '')
const tags = ref(props.initialTags ? [...props.initialTags] : [])
const fontSize = ref(16)
const textareaRef = ref(null)

// 草稿条示例逻辑
const showDraftBar = ref(true)
const draftStatus = ref('saved') // 'saving'|'saved'|'error'

function handleRestore() {
  // 恢复草稿逻辑
}
function handleClear() {
  // 清除草稿逻辑
}

function insertEmoji(emoji) {
  if (!textareaRef.value) return
  const el = textareaRef.value
  const [start, end] = [el.selectionStart, el.selectionEnd]
  content.value = content.value.slice(0, start) + emoji + content.value.slice(end)
  nextTick(() => {
    el.setSelectionRange(start + emoji.length, start + emoji.length)
    el.focus()
  })
}

function insertImage(url) {
  if (!textareaRef.value) return
  const el = textareaRef.value
  const [start, end] = [el.selectionStart, el.selectionEnd]
  const imgMd = `![图片描述](${url})`
  content.value = content.value.slice(0, start) + imgMd + content.value.slice(end)
  nextTick(() => {
    el.setSelectionRange(start + imgMd.length, start + imgMd.length)
    el.focus()
  })
}

function onToolbarCommand(cmd) {
  // 可扩展 markdown 快捷插入
}

function handleImageUpload(url) {
  insertImage(url)
}

function handleSubmit() {
  if (title.value.length < 2) return alert('标题过短！')
  if (content.value.length < 20) return alert('正文内容太少！')
  emit('submit', {
    title: title.value,
    content: content.value,
    tags: tags.value,
  })
}
</script>
<style scoped>
/* 1. 自定义滚动条 */
textarea::-webkit-scrollbar,
.markdown-preview::-webkit-scrollbar {
  width: 8px;
  background: transparent;
}
textarea::-webkit-scrollbar-thumb,
.markdown-preview::-webkit-scrollbar-thumb {
  background: #d1e4f6;
  border-radius: 8px;
}

/* 2. placeholder 颜色微调 */
textarea::placeholder, input::placeholder {
  color: #a0aec0;
  opacity: 1;
}

/* 3. 美化 textarea 聚焦、阴影 */
textarea:focus {
  box-shadow: 0 0 0 2px #3b82f6, 0 1px 6px rgba(59,130,246,0.1);
  transition: box-shadow 0.2s;
}

/* 4. 工具栏分隔与按钮悬浮 */
.editor-toolbar {
  background: rgba(255,255,255,0.96);
  border-radius: 1rem;
  border: 1px solid #c7d2fe;
  box-shadow: 0 1px 8px 0 rgba(59,130,246,.04);
  overflow-x: auto;
}
.editor-toolbar .toolbar-btn {
  border: none;
  background: none;
  padding: 0.4em 1em;
  border-radius: 0.75rem;
  font-size: 1.15em;
  color: #3b82f6;
  transition: background .15s, color .15s;
  cursor: pointer;
}
.editor-toolbar .toolbar-btn:hover, .editor-toolbar .toolbar-btn.active {
  background: #e0edfa;
  color: #2563eb;
  box-shadow: 0 1px 4px 0 #bae6fd33;
}

/* 5. 预览区美化 */
.markdown-preview {
  min-height: 120px;
  background: rgba(255,255,255,0.92);
  border-radius: 1rem;
  border: 1.5px solid #c7d2fe;
  box-shadow: 0 2px 10px 0 rgba(59,130,246,.05);
  padding: 1.5rem;
  font-size: 1.06em;
  line-height: 1.85;
  overflow-x: auto;
}
.markdown-preview pre, .markdown-preview code {
  background: #f1f5fa;
  color: #2563eb;
  border-radius: 0.5em;
  padding: 0.25em 0.5em;
}

/* 6. 大按钮渐变小动画 */
.save-button {
  background: linear-gradient(90deg,#3b82f6,#60a5fa 60%);
  box-shadow: 0 6px 20px -3px #93c5fd66;
  border: none;
  border-radius: 1.2em;
  font-weight: 700;
  letter-spacing: .06em;
  transition: background .18s, box-shadow .14s;
}
.save-button:hover:not([disabled]) {
  background: linear-gradient(92deg,#2563eb,#3b82f6 80%);
  box-shadow: 0 8px 32px -4px #60a5fa66;
}

.save-button[disabled] {
  background: #cbd5e1 !important;
  color: #a0aec0 !important;
  box-shadow: none !important;
  cursor: not-allowed;
}

/* 7. 小屏适配 */
@media (max-width: 640px) {
  .max-w-2xl {
    padding: 0.75rem !important;
    border-radius: 1.2rem !important;
  }
  .markdown-preview, .content-toc {
    padding: 0.7rem !important;
    font-size: 0.98em !important;
  }
}
</style>
