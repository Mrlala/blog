<template>
  <div class="write-single-col">
    <n-card class="editor-pane" :bordered="false" size="large">
      <TitleInput v-model="title" />
      <CoverSelectBar v-model="coverUrl" />
      <TagInput v-model="tags" :max="6" class="mb-block" />
      <SummaryInput v-model="summary" class="mb-block" />

      <MdEditor v-model="content" :theme="theme" style="height: 420px" :show-catalog="true" @onUploadImg="onUploadImage"
        class="mb-block" />

      <n-space justify="end" class="mt-2 mb-block">
        <n-button type="primary" :loading="saving" :disabled="!canSave" @click="saveArticle" class="save-btn">
          保存
        </n-button>
      </n-space>

      <n-alert v-if="msgShow" :type="msgType" class="mt-4 mb-block" show-icon>
        {{ msg }}
      </n-alert>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NButton, NCard, NAlert, NSpace } from 'naive-ui'
import TagInput from '@/components/editor/TagInput.vue'
import TitleInput from '@/components/editor/TitleInput.vue'
import SummaryInput from '@/components/editor/SummaryInput.vue'
import CoverSelectBar from '@/components/editor/CoverSelector.vue'
import { useDraft } from '@/composables/useDraft.js'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const router = useRouter()
const route = useRoute()

const title = ref('')
const content = ref('')
const tags = ref([])
const summary = ref('')
const coverUrl = ref('')
const saving = ref(false)
const msg = ref('')
const msgType = ref('success')
const msgShow = ref(false)
const isEdit = ref(false)
const articleId = ref('')

const theme = ref(localStorage.getItem('naive-theme') || 'light')
function onThemeChange(event) {
  const newTheme = event.detail
  if (newTheme === 'light' || newTheme === 'dark') {
    theme.value = newTheme
  }
}

onMounted(async () => {
  window.addEventListener('naive-theme-change', onThemeChange)
  const id = route.query.edit
  if (id) {
    isEdit.value = true
    articleId.value = id
    const res = await fetch(`${API_BASE_URL}/api/articles/${id}`)
    const data = await res.json()
    if (data && data.id) {
      title.value = data.title
      tags.value = data.tags || []
      content.value = data.content
      summary.value = data.summary || ''
      coverUrl.value = data.cover || ''
      showDraftBar.value = false
    }
  } else {
    showDraftBar.value = load()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('naive-theme-change', onThemeChange)
})

const { draft, load, save, clear } = useDraft()
const showDraftBar = ref(false)

watch([title, content, tags], ([t, c, tg]) => {
  save(t, c, tg)
  showDraftBar.value = !!t || !!c || (tg && tg.length)
})


function clearDraft() {
  clear()
  showDraftBar.value = false
}

const canSave = computed(() =>
  title.value.trim() && content.value.trim() && title.value.length <= 60
)

async function saveArticle() {
  if (!canSave.value) {
    msg.value = '标题或内容不合法'
    msgType.value = 'error'
    msgShow.value = true
    setTimeout(() => (msgShow.value = false), 1800)
    return
  }
  saving.value = true
  try {
    const payload = {
      title: title.value,
      summary: summary.value,
      content: content.value,
      tags: tags.value,
      cover: coverUrl.value
    }
    let url = `${API_BASE_URL}/api/articles`
    let method = 'POST'
    if (isEdit.value && articleId.value) {
      url += '/' + articleId.value
      method = 'PUT'
    }
    const token = localStorage.getItem('token')
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (token || '')
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (data.id) {
      clearDraft()
      msg.value = '保存成功！'
      msgType.value = 'success'
      msgShow.value = true
      setTimeout(() => router.push('/'), 800)
    } else {
      msg.value = data.error || '保存失败'
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
async function onUploadImage(files, callback) {
  const res = await Promise.all(
    Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token')
      const resp = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + (token || '')
        }
      });

      const data = await resp.json();
      return data.url;
    })
  );
  console.log(res)
  callback(res); // 官方推荐，传图片url数组
}

</script>

<style scoped>
.write-single-col {
  min-height: 100vh;
  background: var(--write-bg-gradient, linear-gradient(135deg, #f8fafb 0%, #f5f8ff 100%));
  padding: 32px 0 64px 0;
}

.editor-pane {
  width: 96vw;
  max-width: 1320px;
  min-width: 320px;
  margin: 0 auto;
  padding: 28px 24px 22px 24px;
  border-radius: var(--card-radius, 20px) !important;
  box-shadow: var(--editor-shadow, 0 4px 24px 0 rgba(60, 110, 255, 0.09), 0 2px 6px rgba(60, 80, 120, 0.06));
  background: var(--card-color, #fff);
  display: flex;
  flex-direction: column;
  height: auto;
}

/* 编辑状态背景 */
:deep(.md-editor) {
  background: var(--article-bg, #fff) !important;
}

/* 预览状态背景 */

:deep(.md-editor-preview-wrapper),
:deep(.md-editor-preview),
:deep(.md-editor-content) {
  background: var(--input-bg, #fff) !important;
}

:deep(.md-editor-toolbar-wrapper) {
  background: var(--input-bg, #fff) !important;
  border: 1px solid var(--input-border);

}

:deep(.md-editor) {
  border: 1px solid var(--input-border);
  --md-color: #8594ac;
  --md-bk-color: var(--input-bg, #fff);
  --md-scrollbar-bg-color: #425070
}

:deep(.md-editor-footer) {
  border: 1px solid var(--input-border);
  background: var(--input-bg, #fff) !important;
}

.mb-block {
  margin-bottom: 1.18em !important;
}

.editor-pane>*:last-child {
  margin-bottom: 0 !important;
}

.save-btn {
  border-radius: var(--btn-radius, 999px);
  padding-left: 2em;
  padding-right: 2em;
  font-weight: 600;
  font-size: 1.08em;
  letter-spacing: 0.5px;
  box-shadow: var(--btn-shadow, 0 1px 4px rgba(46, 110, 255, 0.05));
  background: var(--btn-bg, linear-gradient(90deg, #75c7fa 0%, #4e8ef7 100%));
  color: var(--btn-text, #fff);
  border: none;
  transition: background 0.2s, filter 0.15s;
}

.save-btn:active {
  filter: brightness(0.97);
}
</style>
