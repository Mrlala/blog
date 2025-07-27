<template>
  <div class="article-manager-page">
    <n-card title="文章管理">


      <!-- 查询区 -->
      <n-space class="mb-4">
        <n-space>
          <n-input v-model:value="keyword" placeholder="搜索标题" clearable style="width: 200px" @keyup.enter="fetchList" />
          <n-select v-model:value="sortBy" :options="sortOptions" style="width: 160px" @update:value="fetchList" />
          <n-select v-model:value="tagId" :options="tagOptions" filterable clearable placeholder="标签筛选"
            style="width: 120px" @update:value="fetchList" />
        </n-space>

        <n-select v-model:value="category_id" :options="categoryOptions" clearable placeholder="分类筛选"
          style="width: 150px" @update:value="fetchList" />
        <n-button type="primary" @click="handleAdd">新建文章</n-button>
        <n-button @click="goAdminHome">返回后台首页</n-button>
      </n-space>

      <!-- 表格 -->
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
  NDataTable, NPagination, NModal, NTag, useMessage, NSwitch
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { fetchArticleList, deleteArticle, updateArticleStatus } from '@/api/article'
import { getCategoryTree } from '@/api/category'



const articles = ref([])
const total = ref(0)
const todayCount = ref(0)
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const keyword = ref('')
const category_id = ref(null)
const tagId = ref(null)
const sortBy = ref('created_at_desc')
const sortOptions = [
  { label: '按创建时间降序', value: 'created_at_desc' },
  { label: '按创建时间升序', value: 'created_at_asc' },
  { label: '按更新时间降序', value: 'updated_at_desc' },
  { label: '按更新时间升序', value: 'updated_at_asc' },
  { label: '按浏览数降序', value: 'views_desc' },
  { label: '按浏览数升序', value: 'views_asc' }
]

const categoryOptions = ref([])
const tagOptions = ref([])

const delDialogVisible = ref(false)
const deleting = ref(false)
const deleteId = ref(null)

const message = useMessage()
const router = useRouter()

function formatDateTime(val) {
  if (!val) return ''
  const date = new Date(val)
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0') + ' ' +
    String(date.getHours()).padStart(2, '0') + ':' +
    String(date.getMinutes()).padStart(2, '0')
}

// 列定义
const columns = [
  { title: 'ID', key: 'id', width: 20 },
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
    width: 40,
    render(row) {
      return row.cover
        ? h('img', {
          src: row.cover,
          style: 'width:40px;height:30px;object-fit:cover;border-radius:5px;border:1px solid #e5e7eb;background:#f3f4f6;'
        })
        : h('span', { style: 'color:#bbb' }, '无')
    }
  },
  {
    title: '标签',
    key: 'tags',
    width: 100,
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
  {
    title: '浏览数',
    key: 'views',
    width: 35,
    render(row) {
      return h('span', {
        style: 'color:#7a869a;display:inline-flex;align-items:center;font-size:0.98em;'
      }, [
        h('svg', {
          width: 16, height: 16, viewBox: '0 0 16 16', fill: 'currentColor', style: 'margin-right:3px;'
        }, [
          h('path', {
            d: 'M8 3C3.58 3 1 8 1 8s2.58 5 7 5 7-5 7-5-2.58-5-7-5Zm0 8.3A3.3 3.3 0 1 1 8 4.7a3.3 3.3 0 0 1 0 6.6Zm0-5.3a2 2 0 1 0 0 4.001A2 2 0 0 0 8 6Z'
          })
        ]),
        String(row.views ?? 0)
      ])
    }
  },


  {
    title: '创建时间',
    key: 'created_at',
    width: 80,
    render(row) {
      return formatDateTime(row.created_at)
    }
  },
  {
    title: '更新时间',
    key: 'updated_at',
    width: 80,
    render(row) {
      return formatDateTime(row.updated_at)
    }
  },
  {
    title: '状态',
    key: 'status',
    width: 40,
    render(row) {
      return h(NSwitch, {
        value: row.status === 'published',
        'checked-value': true,
        'unchecked-value': false,
        onUpdateValue: async (v) => {
          try {
            const newStatus = v ? 'published' : 'draft'
            await updateArticleStatus(row.id, newStatus)
            row.status = newStatus
            message.success(`已${v ? '发布' : '下架'}`)
          } catch (err) {
            message.error('操作失败')
          }
        }
      }, { checked: () => '已发布', unchecked: () => '下架' })
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 185,
    render(row) {
      return h(NSpace, { size: 4 }, () => [
        h(NButton, {
          size: 'small',
          ghost: true,
          onClick: () => window.open(`/article/${row.id}`, '_blank')
        }, { default: () => '预览' }),
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

/** 拉文章列表 **/
async function fetchList() {
  loading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      sort: sortBy.value
      // 不带 status，后台默认返回全部状态
    }
    if (keyword.value.trim()) params.keyword = keyword.value.trim()
    if (category_id.value) params.category_id = category_id.value
    if (tagId.value) params.tag = tagId.value

    const data = await fetchArticleList(params)
    articles.value = Array.isArray(data.list) ? data.list.filter(a => a.id !== undefined && a.id !== null) : []
    total.value = data.total || 0
    todayCount.value = data.todayCount || 0

    // 标签筛选
    const tagMap = new Map()
    articles.value.forEach(a => (a.tags || []).forEach(t => {
      if (!tagMap.has(t.id)) tagMap.set(t.id, t)
    }))
    tagOptions.value = Array.from(tagMap.values()).map(t => ({
      label: t.name,
      value: t.id
    }))
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

.mb-2 {
  margin-bottom: 0.8em;
}

.mt-4 {
  margin-top: 1.2em;
}

.ml-2 {
  margin-left: 0.5em;
}
</style>
