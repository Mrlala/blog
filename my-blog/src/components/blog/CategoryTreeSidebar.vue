<template>
  <div class="tree-sidebar" :class="{ collapsed }">
    <div class="sidebar-toggle" @click="collapsed = !collapsed" :title="collapsed ? '展开分类' : '收起分类'">
   <el-icon><Menu /></el-icon>  分类 
    </div>
    <transition name="sidebar-fade">
      <el-tree
        v-if="!collapsed"
        :data="tree"
        node-key="id"
        highlight-current
        :expand-on-click-node="false"
        :props="treeProps"
        :current-node-key="modelValue"
        @current-change="onNodeSelect"
        class="category-tree"
      >
        <!-- 节点内容插槽美化（图标+文本+数量等） -->
        <template #default="{ node, data }">
          <span class="tree-node-content">
            <el-icon v-if="data.icon" class="tree-node-icon">
              <component :is="data.icon" />
            </el-icon>
            <span class="tree-node-label">{{ data.label }}</span>
            <span v-if="data.count" class="tree-node-count">{{ data.count }}</span>
          </span>
        </template>
      </el-tree>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Menu } from '@element-plus/icons-vue'

const props = defineProps({
  tree: { type: Array, required: true },
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])
const collapsed = ref(false)
const treeProps = { label: 'label', children: 'children' }

function onNodeSelect(node) {
  emit('update:modelValue', node ? node.id : '')
}
</script>

<style scoped>
.tree-sidebar {
  width: 210px;
  min-width: 52px;
  background: var(--sidebar-bg, #f4f6fa);
  border-radius: 1.3em;
  box-shadow: 0 4px 32px #2563eb11;
  border: 1.5px solid var(--sidebar-border, #e6e9f0);
  padding: 1.1em 0.4em 1.2em 0.4em;
  position: sticky;
  top: 80px;
  left: 0;
  z-index: 10;
  transition: width 0.22s cubic-bezier(.4,0,.2,1);
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100vh - 100px);
}
.tree-sidebar.collapsed {
  width: 52px;
  min-width: 52px;
  padding: 1em 0 1em 0;
}
.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  cursor: pointer;
  margin-bottom: 7px;
  font-size: 1.35em;
  color: var(--sidebar-active-text, #2563eb);
  transition: color 0.18s;
  user-select: none;
}
.category-tree {
  background: none;
  border-radius: 1.1em;
  font-size: 1.08em;
  --el-tree-node-hover-bg-color: var(--sidebar-hover-bg, #f3f8ff);
  --el-tree-node-content-height: 34px;
  /* 动画平滑 */
  transition: background 0.22s, color 0.22s;
  padding-right: 0.2em;
}
:deep(.el-tree-node__content) {
  border-radius: 0.72em;
  margin-bottom: 0.13em;
  padding-left: 0.9em;
  color: var(--sidebar-text, #1e293b);
  transition: background 0.17s, color 0.17s;
}
:deep(.el-tree-node.is-current .el-tree-node__content) {
  background: var(--sidebar-active-bg, #e5efff) !important;
  color: var(--sidebar-active-text, #2563eb) !important;
  font-weight: 700;
}
:deep(.el-tree-node__content:hover) {
  background: var(--sidebar-hover-bg, #f3f8ff) !important;
  color: var(--sidebar-active-text, #2563eb) !important;
}
:deep(.el-tree-node__expand-icon) {
  margin-right: 8px;
  font-size: 1.15em;
  color: var(--sidebar-text, #1e293b);
  transition: color 0.16s;
}
:deep(.el-tree-node.is-current .el-tree-node__expand-icon),
:deep(.el-tree-node__content:hover .el-tree-node__expand-icon) {
  color: var(--sidebar-active-text, #2563eb) !important;
}
.tree-node-content {
  display: flex;
  align-items: center;
  gap: 7px;
}
.tree-node-label {
  font-size: 1.07em;
  font-weight: 500;
}
.tree-node-count {
  margin-left: 0.45em;
  font-size: 0.98em;
  background: var(--sidebar-active-bg, #e5efff);
  color: var(--sidebar-active-text, #2563eb);
  border-radius: 1em;
  padding: 0.08em 0.7em;
}
@media (max-width: 600px) {
  .tree-sidebar {
    display: none;
  }
}
/* 暗色主题下 el-tree 文字变亮、无边框，交互色主色高对比 */
body.dark .category-tree,
body.dark .el-tree,
body.dark .el-tree * {
  color: var(--sidebar-text, #e7efff) !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
}

body.dark :deep(.el-tree-node__content) {
  color: var(--sidebar-text, #e7efff) !important;
  background: transparent !important;
  border: none !important;
}

body.dark :deep(.el-tree-node.is-current .el-tree-node__content) {
  background: var(--sidebar-active-bg, #243c6c) !important;
  color: var(--sidebar-active-text, #5c9dff) !important;
  font-weight: 700;
  border: none !important;
}
body.dark :deep(.el-tree-node__content:hover) {
  background: var(--sidebar-hover-bg, #1d2639) !important;
  color: var(--sidebar-active-text, #5c9dff) !important;
  border: none !important;
}

/* 亮色主题也去掉 el-tree 边框 */
.category-tree,
.el-tree {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
}
:deep(.el-tree-node__content) {
  border: none !important;
}

</style>
