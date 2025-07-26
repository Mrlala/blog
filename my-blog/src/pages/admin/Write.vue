<template>
  <div class="write-single-col">
    <n-card class="editor-pane" :bordered="false" size="large">
      <!-- 标题输入 -->
      <TitleInput v-model="title" class="mb-block" />
      <!-- 分类选择（你也可以单独抽 CategorySelector 组件） -->
      <n-form-item label="分类" class="mb-block">
        <n-select v-model:value="categoryId" :options="categoryOptions" :loading="categoryLoading" placeholder="请选择分类"
          filterable clearable size="large" style="width:320px" />
      </n-form-item>
      <!-- 标签选择器 -->
      <n-form-item label="标签" class="mb-block">
        <TagSelector v-model="tags" />
      </n-form-item>

      <!-- 摘要 -->
      <SummaryInput v-model="summary" class="mb-block" />
      <!-- 封面选择 -->
      <CoverSelector v-model="coverUrl" class="mb-block" />
      <!-- Markdown编辑器 -->
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
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TitleInput from '@/components/editor/TitleInput.vue'
import SummaryInput from '@/components/editor/SummaryInput.vue'
import CoverSelector from '@/components/editor/CoverSelector.vue'
import TagSelector from '@/components/editor/TagSelector.vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

// 接口
import { addArticle, updateArticle, fetchArticle } from '@/api/article'
import { getCategoryTree } from '@/api/category'
import { uploadImage } from '@/api/upload'

const router = useRouter()
const route = useRoute()

const title = ref('')
const content = ref('')
const tags = ref([])
const summary = ref('')
const coverUrl = ref('')
const categoryId = ref(null)
const saving = ref(false)
const msg = ref('')
const msgType = ref('success')
const msgShow = ref(false)
const isEdit = ref(false)
const articleId = ref('')

const theme = ref(localStorage.getItem('naive-theme') || 'light')

// 分类下拉
const categoryOptions = ref([])
const categoryLoading = ref(false)
async function fetchCategories() {
  categoryLoading.value = true
  try {
    const tree = await getCategoryTree()
    function flatten(nodes, prefix = '') {
      let arr = []
      for (const n of nodes) {
        const label = prefix ? prefix + ' / ' + n.name : n.name
        arr.push({ label, value: n.id })
        if (n.children?.length) arr = arr.concat(flatten(n.children, label))
      }
      return arr
    }
    categoryOptions.value = flatten(tree)
  } finally {
    categoryLoading.value = false
  }
}

// 切换主题（兼容 md-editor-v3）
function onThemeChange(event) {
  const newTheme = event.detail
  if (newTheme === 'light' || newTheme === 'dark') {
    theme.value = newTheme
  }
}

onMounted(async () => {
  window.addEventListener('naive-theme-change', onThemeChange)
  await fetchCategories()
  // 如果是编辑，回填内容
  const id = route.query.edit || route.query.id
  if (id) {
    isEdit.value = true
    articleId.value = id
    const data = await fetchArticle(id)
    if (data && data.id) {
      title.value = data.title
      tags.value = (data.tags || []).map(t => t.name)
      content.value = data.content
      summary.value = data.summary || ''
      coverUrl.value = data.cover || ''
      categoryId.value = data.category?.id ? Number(data.category.id) : null
    }
  }
})

const canSave = computed(() =>
  title.value.trim() && content.value.trim() && title.value.length <= 60 && !!categoryId.value
)

async function saveArticle() {
  if (!canSave.value) {
    msg.value = '请填写标题、内容、分类'
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
      tags: tags.value,     // 直接传名字数组
      cover: coverUrl.value,
      category_id: categoryId.value ? Number(categoryId.value) : null
    }
    let data
    if (isEdit.value && articleId.value) {
      data = await updateArticle(articleId.value, payload)
    } else {
      data = await addArticle(payload)
    }
    if (data.id) {
      msg.value = '保存成功！'
      msgType.value = 'success'
      msgShow.value = true
      setTimeout(() => router.push('/admin/article'), 800)
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

// 图片上传
async function onUploadImage(files, callback) {
  try {
    const urls = await Promise.all(
      Array.from(files).map(file => uploadImage(file))
    )
    callback(urls)
  } catch (e) {
    callback([])
  }
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

:deep(.md-editor) {
  background: var(--article-bg, #fff) !important;
}

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
  --md-scrollbar-bg-color: #425070;
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
