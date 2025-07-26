<template>
  <div class="category-manager-page">
    <n-card title="分类管理">
      <n-space justify="end" class="mb-4">
        <n-button type="primary" @click="openAddDialog">新建分类</n-button>
        <n-button @click="goAdminHome">返回后台首页</n-button>
      </n-space>

      <n-tree block-line :data="tree" :default-expand-all="true" key-field="id" label-field="name" :selectable="true"
        :selected-keys="[selected]" @update:selected-keys="keys => selected = keys[0]" :node-props="nodeProps" :render-label="renderLabel" />

      <n-dropdown trigger="manual" placement="bottom-start" :show="dropdownVisible" :x="dropdownX" :y="dropdownY"
        :options="dropdownOptions" @select="handleDropdownSelect" @clickoutside="dropdownVisible = false" />

      <n-modal v-model:show="dialogVisible" title="分类编辑" :show-mask="true" :mask-closable="false" @close="closeDialog">
        <n-card :title="editMode ? '编辑分类' : '新建分类'" style="width: 320px;">
          <n-form :model="form" label-width="80px">
            <n-form-item label="名称" path="name" :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]">
              <n-input v-model:value="form.name" />
            </n-form-item>
            <n-form-item label="父级">
              <n-select v-model:value="form.parent_id" :options="parentOptions" filterable clearable
                placeholder="请选择父级分类" />
            </n-form-item>
            <n-form-item label="图标" path="icon">
              <n-input v-model:value="form.icon" placeholder="请输入 emoji 或 SVG 代码" clearable />
            </n-form-item>

          </n-form>
          <template #footer>
            <n-space justify="end">
              <n-button @click="closeDialog">取消</n-button>
              <n-button type="primary" @click="saveCategory" :loading="saving">保存</n-button>
            </n-space>
          </template>
        </n-card>
      </n-modal>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue'
import {
  NCard, NSpace, NButton, NTree, NModal, NForm, NFormItem, NInput, NSelect, NDropdown, useMessage,
} from 'naive-ui'
import { useRouter } from 'vue-router'

// 分类API
import { getCategoryTree, addCategory, updateCategory, deleteCategory } from '@/api/category'

const tree = ref([])
const selected = ref(null)
const dialogVisible = ref(false)
const editMode = ref(false)
const saving = ref(false)
const form = ref({ id: null, name: '', parent_id: null, icon: '' })

const message = useMessage()
const router = useRouter()

// 右键菜单相关状态
const dropdownVisible = ref(false)
const dropdownX = ref(0)
const dropdownY = ref(0)
const dropdownOptions = [
  { label: '编辑', key: 'edit' },
  { label: '删除', key: 'delete' }
]
const rightClickedNode = ref(null)

// 扁平化
function flatten(list, arr = []) {
  for (const c of list) {
    arr.push(c)
    if (c.children) flatten(c.children, arr)
  }
  return arr
}

// 父级选项过滤掉自身和自身所有下级
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
  return [{ label: '无', value: null }].concat(
    all.filter(c => !invalidIds.has(c.id)).map(c => ({ label: c.name, value: c.id }))
  )
})

function nodeProps({ option }) {
  return {
    onClick() {
      selected.value = option.id
    },
    onContextmenu(e) {
      e.preventDefault()
      rightClickedNode.value = option
      dropdownX.value = e.clientX
      dropdownY.value = e.clientY
      dropdownVisible.value = true
    }
  }
}
function renderLabel({ option }) {
  return h(
    'span',
    { class: 'tree-node-content' },
    [
      option.icon ? h('span', { class: 'tree-node-icon', innerHTML: option.icon }) : null,
      h('span', {}, option.name)
    ]
  )
}

async function loadTree() {
  try {
    tree.value = await getCategoryTree()
  } catch (e) {
    message.error(`分类加载失败：${e.message}`)
  }
}

onMounted(loadTree)

function openAddDialog() {
  editMode.value = false
  form.value = { id: null, name: '', parent_id: null, icon: '' }
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
  form.value = { id: null, name: '', parent_id: null, icon: '' }
  saving.value = false
}

function edit(option) {
  editMode.value = true
  form.value = {
    ...option,
    parent_id: option.parent_id == null ? null : Number(option.parent_id),
    icon: option.icon || ''
  }
  dialogVisible.value = true
  dropdownVisible.value = false
}

async function saveCategory() {
  if (!form.value.name || !form.value.name.trim()) {
    message.warning('分类名称不能为空')
    return
  }
  saving.value = true
  try {
    const saveBody = { ...form.value }
    if (saveBody.parent_id === '') saveBody.parent_id = null
    if (saveBody.parent_id !== null) saveBody.parent_id = Number(saveBody.parent_id)
    let data
    if (editMode.value) {
      data = await updateCategory(form.value.id, saveBody)
    } else {
      data = await addCategory(saveBody)
    }
    if (!data || data.error) throw new Error(data?.error || (editMode.value ? '保存失败' : '新增失败'))
    dialogVisible.value = false
    await loadTree()
    selected.value = data.id || form.value.id || null
    message.success(editMode.value ? '分类修改成功' : '分类新增成功')
  } catch (e) {
    message.error(e.message)
  }
  saving.value = false
}

async function del(option) {
  try {
    const data = await deleteCategory(option.id)
    if (!data || data.error) throw new Error(data?.error || '删除失败')
    const parentId = option.parent_id || null
    await loadTree()
    selected.value = parentId
    message.success('分类删除成功')
  } catch (e) {
    message.error(e.message)
  }
  dropdownVisible.value = false
}

function handleDropdownSelect(key) {
  if (!rightClickedNode.value) return
  if (key === 'edit') {
    edit(rightClickedNode.value)
  } else if (key === 'delete') {
    del(rightClickedNode.value)
  }
  dropdownVisible.value = false
}

function goAdminHome() {
  router.push('/admin')
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1.2em;
}

.category-manager-page {
  padding: 2em 1.2em;
}
.tree-node-icon {
  display: inline-flex;
  margin-right: 6px;
  font-size: 1.2em;
  line-height: 1;
  vertical-align: middle;
}

</style>
