<template>
  <div class="tag-manager-page">
    <n-card title="标签管理">
      <n-space justify="end" class="mb-4">
        <n-button type="primary" @click="openAddDialog">新建标签</n-button>
      </n-space>
      <n-data-table
        :columns="columns"
        :data="tags"
        :row-key="row => row.id"
        size="medium"
        :pagination="false"
      />
      <n-modal v-model:show="dialogVisible">
        <n-card :title="editMode ? '编辑标签' : '新建标签'" style="width:340px;">
          <n-form :model="form" label-width="80">
            <n-form-item label="标签名">
              <n-input v-model:value="form.name"/>
            </n-form-item>
            <n-form-item label="颜色">
              <n-input v-model:value="form.color" placeholder="#61dafb"/>
            </n-form-item>
            <n-form-item label="描述">
              <n-input v-model:value="form.description"/>
            </n-form-item>
          </n-form>
          <template #footer>
            <n-space justify="end">
              <n-button @click="dialogVisible=false">取消</n-button>
              <n-button type="primary" @click="saveTag">保存</n-button>
            </n-space>
          </template>
        </n-card>
      </n-modal>
    </n-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { NCard, NSpace, NButton, NDataTable, NModal, NForm, NFormItem, NInput } from 'naive-ui'

const tags = ref([])
const dialogVisible = ref(false)
const editMode = ref(false)
const form = ref({ id: null, name: '', color: '', description: '' })

const columns = [
  { title: '标签名', key: 'name', render(row) {
      return row.color
        ? h('span', { style: `display:inline-block;margin-right:8px;width:16px;height:16px;background:${row.color};border-radius:50%;vertical-align:-2px;` }) + row.name
        : row.name
    }
  },
  { title: '颜色', key: 'color', render(row) {
      return row.color
        ? h('span', { style: `display:inline-block;width:24px;height:16px;background:${row.color};border-radius:4px;` })
        : '-'
    }
  },
  { title: '描述', key: 'description' },
  { title: '操作', key: 'actions', render(row) {
      return [
        h(NButton, { size: 'tiny', type: 'primary', text: true, onClick: () => edit(row) }, '编辑'),
        h(NButton, { size: 'tiny', type: 'error', text: true, onClick: () => del(row) }, '删除')
      ]
    }
  }
]

onMounted(loadTags)
async function loadTags() {
  const res = await fetch('/api/tags')
  tags.value = await res.json()
}
function openAddDialog() {
  editMode.value = false
  form.value = { id: null, name: '', color: '', description: '' }
  dialogVisible.value = true
}
function edit(row) {
  editMode.value = true
  form.value = { ...row }
  dialogVisible.value = true
}
async function saveTag() {
  if (!form.value.name) return
  if (editMode.value) {
    await fetch(`/api/tags/${form.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
  } else {
    await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
  }
  dialogVisible.value = false
  await loadTags()
}
async function del(row) {
  await fetch(`/api/tags/${row.id}`, { method: 'DELETE' })
  await loadTags()
}
</script>
<style scoped>
.mb-4 { margin-bottom: 1.2em; }
.tag-manager-page { padding: 2em 1.2em; }
</style>
