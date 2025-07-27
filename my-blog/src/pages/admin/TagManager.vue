<template>
  <div class="tag-manager-page">
    <n-card title="标签管理">
      <n-space justify="space-between" class="mb-4">
        <n-input v-model:value="search" placeholder="搜索标签名" clearable style="width:200px" @keyup.enter="handleSearch"/>
        <n-space>
          <n-button type="primary" @click="openAddDialog">新建标签</n-button>
          <n-button @click="goAdminHome">返回后台首页</n-button>
        </n-space>
      </n-space>
      <n-data-table
        :columns="columns"
        :data="tags"
        :row-key="row => row.id"
        size="medium"
        :pagination="pagination"
        :page="page"
        :page-size="pageSize"
        :page-count="pageCount"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
      <n-modal v-model:show="dialogVisible">
        <n-card :title="editMode ? '编辑标签' : '新建标签'" style="width:340px;">
          <n-form :model="form" label-width="80">
            <n-form-item label="标签名" path="name" :rules="[{ required: true, message: '请输入标签名', trigger: 'blur' }]">
              <n-input v-model:value="form.name" />
            </n-form-item>
            <n-form-item label="颜色">
              <n-color-picker
                v-model:value="form.color"
                show-alpha
                :default-value="'#61dafb'"
                format="hex"
              />
            </n-form-item>
            <n-form-item label="描述">
              <n-input v-model:value="form.description" />
            </n-form-item>
          </n-form>
          <template #footer>
            <n-space justify="end">
              <n-button @click="dialogVisible=false">取消</n-button>
              <n-button type="primary" @click="saveTag" :loading="saving">保存</n-button>
            </n-space>
          </template>
        </n-card>
      </n-modal>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, h, computed } from 'vue'
import {
  NCard, NSpace, NButton, NDataTable, NModal, NForm, NFormItem, NInput, NColorPicker, useMessage,
} from 'naive-ui'
import { useRouter } from 'vue-router'

// 你的 tag API
import { getTags, addTag, updateTag, deleteTag } from '@/api/tag'

const tags = ref([])
const dialogVisible = ref(false)
const editMode = ref(false)
const saving = ref(false)
const form = ref({ id: null, name: '', color: '#61dafb', description: '' })

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const search = ref('')

const message = useMessage()
const router = useRouter()
const pageCount = computed(() => Math.ceil(total.value / pageSize.value) || 1)
const pagination = computed(() => ({
  page: page.value,
  pageSize: pageSize.value,
  pageCount: pageCount.value,
  showSizePicker: true,
  pageSizes: [10, 20, 50]
}))

const columns = [
  {
    title: '标签名',
    key: 'name',
    render(row) {
      return row.color
        ? [
            h('span', {
              style: `display:inline-block;margin-right:8px;width:16px;height:16px;background:${row.color};border-radius:50%;vertical-align:-2px;`
            }),
            row.name
          ]
        : row.name
    }
  },
  {
    title: '颜色',
    key: 'color',
    render(row) {
      return row.color
        ? h('span', {
            style: `display:inline-block;width:24px;height:16px;background:${row.color};border-radius:4px;`
          })
        : '-'
    }
  },
  { title: '描述', key: 'description' },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(NSpace, { size: 4 }, () => [
        h(NButton, {
          size: 'small',
          type: 'primary',
          ghost: true,
          onClick: () => edit(row)
        }, { default: () => '编辑' }),
        h(NButton, {
          size: 'small',
          type: 'error',
          ghost: true,
          onClick: () => del(row)
        }, { default: () => '删除' })
      ])
    }
  }
]

async function loadTags() {
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value
    }
    if (search.value && search.value.trim()) params.keyword = search.value.trim()
    const data = await getTags(params)
    tags.value = data.list || []
    total.value = data.total || 0
  } catch (e) {
    message.error(`标签加载失败：${e.message}`)
  }
}

onMounted(loadTags)

function handleSearch() {
  page.value = 1
  loadTags()
}

function openAddDialog() {
  editMode.value = false
  form.value = {
    id: null,
    name: '',
    color: getRandomColor(),
    description: ''
  }
  dialogVisible.value = true
}
function getRandomColor() {
  // 生成一个亮色调（避免过暗）
  const r = Math.floor(150 + Math.random() * 100)
  const g = Math.floor(150 + Math.random() * 100)
  const b = Math.floor(150 + Math.random() * 100)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function edit(row) {
  editMode.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

async function saveTag() {
  if (!form.value.name) {
    message.warning('标签名不能为空')
    return
  }
  saving.value = true
  try {
    let data
    if (editMode.value) {
      data = await updateTag(form.value.id, form.value)
    } else {
      data = await addTag(form.value)
    }
    if (!data || data.error) throw new Error(data?.error || (editMode.value ? '保存失败' : '新增失败'))
    dialogVisible.value = false
    await loadTags()
    message.success(editMode.value ? '标签修改成功' : '标签新增成功')
  } catch (e) {
    message.error(e.message)
  }
  saving.value = false
}

async function del(row) {
  try {
    const data = await deleteTag(row.id)
    if (!data || data.error) throw new Error(data?.error || '删除失败')
    await loadTags()
    message.success('标签删除成功')
  } catch (e) {
    message.error(e.message)
  }
}

function handlePageChange(newPage) {
  page.value = newPage
  loadTags()
}

function handlePageSizeChange(newSize) {
  pageSize.value = newSize
  page.value = 1
  loadTags()
}

function goAdminHome() {
  router.push('/admin')
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1.2em;
}
.tag-manager-page {
  padding: 2em 1.2em;
}
</style>
