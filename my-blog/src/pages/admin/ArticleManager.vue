<template>
  <div class="article-manager-page">
    <n-card title="文章管理">
      <n-space justify="space-between" class="mb-4">
        <n-space>
          <n-input v-model:value="keyword" placeholder="搜索标题" clearable style="width: 200px" @keyup.enter="fetchList" />
          <n-select v-model:value="category_id" :options="categoryOptions" clearable placeholder="分类筛选"
            style="width: 150px" @update:value="fetchList" />
        </n-space>
        <n-space justify="end" class="mb-4">
          <n-button type="primary" @click="handleAdd">新建文章</n-button>
          <n-button @click="goAdminHome">返回后台首页</n-button>
        </n-space>
      </n-space>

      <n-data-table :columns="columns" :data="articles" :loading="loading" :pagination="false" :bordered="false"
        :single-line="false" />

      <n-pagination class="mt-4" v-model:page="page" :page-size="pageSize" :item-count="total"
        :page-sizes="[10, 20, 50]" show-size-picker @update:page="fetchList" @update:page-size="handlePageSize" />
    </n-card>
    <!-- 删除确认弹窗 -->
    <n-modal v-model:show="delDialogVisible" preset="dialog" title="删除确认" :show-icon="false">
      <div>确定要删除该文章？</div>
      <template #action>
        <n-space justify="end">
          <n-button @click="delDialogVisible = false">取消</n-button>
          <n-button type="error" :loading="deleting" @click="confirmDelete">删除</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, h } from 'vue'
import {
  NCard, NSpace, NButton, NInput, NSelect,
  NDataTable, NPagination, NModal, NTag, useMessage
} from 'naive-ui'
import { useRouter } from 'vue-router'

// 用你自己的 API 模块
import { fetchArticleList, deleteArticle } from '@/api/article'
import { getCategoryTree } from '@/api/category'

const articles = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const keyword = ref('')
const category_id = ref(null)
const categoryOptions = ref([])

const delDialogVisible = ref(false)
const deleting = ref(false)
const deleteId = ref(null)

const message = useMessage()
const router = useRouter()

const columns = [
  { title: 'ID', key: 'id', width: 70 },
  {
    title: '标题',
    key: 'title',
    width: 240,
    render(row) {
      return row.title || '—'
    }
  },
  {
    title: '封面',
    key: 'cover',
    width: 100,
    render(row) {
      return row.cover
        ? h('img', {
          src: row.cover,
          style: 'width:54px;height:38px;object-fit:cover;border-radius:5px;border:1px solid #e5e7eb;background:#f3f4f6;'
        })
        : h('span', { style: 'color:#bbb' }, '无')
    }
  },
  {
    title: '标签',
    key: 'tags',
    width: 150,
    render(row) {
      if (!Array.isArray(row.tags) || row.tags.length === 0)
        return h('span', { style: 'color:#bbb' }, '无')
      return row.tags.map(tag =>
        h(
          NTag,
          { type: 'info', size: 'small', style: 'margin-right:6px' },
          { default: () => tag.name }
        )
      )
    }
  },
  { title: '创建时间', key: 'created_at', width: 140 },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    render(row) {
      return h(NSpace, { size: 4 }, () => [
        h(NButton, {
          size: 'small',
          type: 'primary',
          ghost: true,
          onClick: () => handleEdit(row)
        }, { default: () => '编辑' }),
        h(NButton, {
          size: 'small',
          type: 'error',
          ghost: true,
          onClick: () => handleDelete(row)
        }, { default: () => '删除' })
      ])
    }
  }
]

async function fetchList() {
  loading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value
    }
    if (keyword.value.trim()) params.keyword = keyword.value.trim()
    if (category_id.value) params.category_id = category_id.value
    const data = await fetchArticleList(params)
    articles.value = Array.isArray(data.list) ? data.list.filter(a => a.id !== undefined && a.id !== null) : []
    total.value = data.total || 0
  } catch (e) {
    message.error('加载失败：' + (e.message || e))
  }
  loading.value = false
}

async function loadCategories() {
  try {
    const data = await getCategoryTree()
    const flat = []
    function walk(list, prefix = '') {
      for (const c of list) {
        flat.push({ label: prefix + c.name, value: c.id })
        if (c.children && c.children.length) {
          walk(c.children, prefix + '｜')
        }
      }
    }
    walk(data)
    categoryOptions.value = [{ label: '全部', value: null }, ...flat]
  } catch (e) {
    categoryOptions.value = [{ label: '全部', value: null }]
  }
}

onMounted(() => {
  loadCategories()
  fetchList()
})
watch([page, pageSize], fetchList)

function handlePageSize(size) {
  pageSize.value = size
  page.value = 1
  fetchList()
}

function handleAdd() {
  router.push('/admin/write')
}
function handleEdit(row) {
  router.push({ path: '/admin/write', query: { id: row.id } })
}
function handleDelete(row) {
  deleteId.value = row.id
  delDialogVisible.value = true
}
async function confirmDelete() {
  if (!deleteId.value) return
  deleting.value = true
  try {
    const res = await deleteArticle(deleteId.value)
    if (res && (res.success || res.id !== undefined)) {
      delDialogVisible.value = false
      message.success('删除成功')
      fetchList()
    } else {
      throw new Error(res?.error || '删除失败')
    }
  } catch (e) {
    message.error(e.message || '删除失败')
  }
  deleting.value = false
}
function goAdminHome() {
  router.push('/admin')
}
</script>


<style scoped>
.article-manager-page {
  padding: 2em 1.2em;
}

.mb-4 {
  margin-bottom: 1.2em;
}

.mt-4 {
  margin-top: 1.2em;
}

.ml-2 {
  margin-left: 0.5em;
}
</style>
