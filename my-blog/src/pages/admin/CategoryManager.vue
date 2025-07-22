<template>
  <div class="category-manager-page">
    <n-card title="分类管理">
      <n-space justify="end" class="mb-4">
        <n-button type="primary" @click="openAddDialog">新建分类</n-button>
      </n-space>
      <n-tree
        block-line
        :data="tree"
        :default-expand-all="true"
        key-field="id"
        label-field="name"
        :selectable="true"
        :selected-keys="[selected]"
        @update:selected-keys="keys => selected = keys[0]"
      >
        <template #action="{ option }">
          <n-button text @click.stop="edit(option)">编辑</n-button>
          <n-popconfirm @positive-click="del(option)">
            <template #trigger>
              <n-button text type="error" @click.stop>删除</n-button>
            </template>
            确认删除该分类及其子分类？
          </n-popconfirm>
        </template>
      </n-tree>
      <n-modal v-model:show="dialogVisible" title="分类编辑" :show-mask="true" :mask-closable="false">
        <n-card :title="editMode ? '编辑分类' : '新建分类'" style="width: 320px;">
          <n-form :model="form" label-width="80px">
            <n-form-item label="名称" path="name" :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]">
              <n-input v-model:value="form.name" />
            </n-form-item>
            <n-form-item label="父级">
              <n-select
                v-model:value="form.parent_id"
                :options="parentOptions"
                filterable
                clearable
                placeholder="请选择父级分类"
              />
            </n-form-item>
          </n-form>
          <template #footer>
            <n-space justify="end">
              <n-button @click="dialogVisible = false">取消</n-button>
              <n-button type="primary" @click="saveCategory">保存</n-button>
            </n-space>
          </template>
        </n-card>
      </n-modal>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  NCard,
  NSpace,
  NButton,
  NTree,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NPopconfirm,
  useMessage,
} from 'naive-ui'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

const tree = ref([])
const selected = ref(null)
const dialogVisible = ref(false)
const editMode = ref(false)
const form = ref({ id: null, name: '', parent_id: null })

const message = useMessage()

// 递归扁平化树，用于父级选择
function flatten(list, arr = []) {
  for (const c of list) {
    arr.push(c)
    if (c.children) flatten(c.children, arr)
  }
  return arr
}

// 过滤当前编辑项及其子孙，避免选为父分类
const parentOptions = computed(() => {
  const all = flatten(tree.value)
  const invalidIds = new Set()
  if (editMode.value && form.value.id != null) {
    function collectInvalid(id) {
      invalidIds.add(id)
      all.forEach(c => {
        if (c.parent_id === id) collectInvalid(c.id)
      })
    }
    collectInvalid(form.value.id)
  }
  return [{ label: '无', value: null }]
    .concat(all.filter(c => !invalidIds.has(c.id)).map(c => ({ label: c.name, value: c.id })))
})

// 加载分类树
async function loadTree() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`)
    if (!res.ok) throw new Error(`加载失败：${res.status}`)
    tree.value = await res.json()
  } catch (e) {
    message.error(`分类加载失败：${e.message}`)
  }
}

onMounted(loadTree)

// 打开新建分类弹窗
function openAddDialog() {
  editMode.value = false
  form.value = { id: null, name: '', parent_id: null }
  dialogVisible.value = true
}

// 编辑分类
function edit(option) {
  editMode.value = true
  form.value = { ...option }
  dialogVisible.value = true
}

// 保存分类
async function saveCategory() {
  if (!form.value.name || !form.value.name.trim()) {
    message.warning('分类名称不能为空')
    return
  }
  try {
    if (editMode.value) {
      const res = await fetch(`${API_BASE_URL}/api/categories/${form.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      if (!res.ok) throw new Error('保存失败')
    } else {
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      if (!res.ok) throw new Error('新增失败')
    }
    dialogVisible.value = false
    await loadTree()
    message.success(editMode.value ? '分类修改成功' : '分类新增成功')
  } catch (e) {
    message.error(e.message)
  }
}

// 删除分类
async function del(option) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories/${option.id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('删除失败')
    await loadTree()
    message.success('分类删除成功')
  } catch (e) {
    message.error(e.message)
  }
}

function treeNodeProps() {
  return { class: 'tree-node' }
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1.2em;
}
.category-manager-page {
  padding: 2em 1.2em;
}
:deep(.tree-node) {
  font-size: 1.06em;
}
</style>
