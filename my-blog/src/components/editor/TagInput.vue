<template>
  <div class="tag-input-plus">
    <div v-for="(tag, idx) in modelValue || []" :key="idx" class="tag-item">
      <span class="tag-label">{{ tag }}</span>
      <span class="tag-remove" @click="remove(idx)">
        <svg width="1em" height="1em" viewBox="0 0 24 24">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="#fff"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </span>
    </div>
    <input
      v-model="newTag"
      class="tag-plus-input"
      :placeholder="(modelValue?.length >= max) ? `最多${max}个标签` : '添加标签，回车或Tab确认'"
      :disabled="modelValue?.length >= max"
      @keydown.enter.prevent="add"
      @keydown.tab.prevent="add"
      @blur="add"
      maxlength="12"
    />
    <transition name="fade-tag-tip">
      <span v-if="tip" class="tag-tip">{{ tip }}</span>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  max: {
    type: Number,
    default: 10
  }
})
const emit = defineEmits(['update:modelValue'])

const newTag = ref('')
const tip = ref('')

function add() {
  const val = newTag.value.trim()
  if (!val) return
  if ((props.modelValue || []).length >= props.max) {
    showTip(`最多只能${props.max}个标签`)
    newTag.value = ''
    return
  }
  if ((props.modelValue || []).includes(val)) {
    showTip('标签已存在')
    newTag.value = ''
    return
  }
  emit('update:modelValue', [...(props.modelValue || []), val])
  newTag.value = ''
}

function remove(i) {
  const tags = (props.modelValue || []).slice()
  tags.splice(i, 1)
  emit('update:modelValue', tags)
}

function showTip(message) {
  tip.value = message
  nextTick(() => setTimeout(() => (tip.value = ''), 1200))
}
</script>

<style scoped>
.tag-input-plus {
  font-family: inherit;
  font-size: 1.13em;
  font-weight: 700;
  color: var(--input-text, #1e293b);

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 10px;
  background: var(--input-bg, #f8fafd);
  border-radius: 16px;
  border: 1px solid var(--input-border, #e3e7ee);
  min-height: 48px;
  transition: border 0.2s;
  position: relative;
}
.tag-input-plus:focus-within {
  border: 1.5px solid var(--input-focus-border, #6da2f7);
}


.tag-item {
  display: flex;
  align-items: center;
  background: var(--tagitem-bg, linear-gradient(90deg, #aee3fa 0%, #b7c8fd 100%));
  color: var(--tagitem-text, #2b4ea5);
  padding: 2px 12px 2px 14px;
  border-radius: 100px;
  font-size: 1em;
  font-weight: 600;
  margin: 0 2px 0 0;
  box-shadow: var(--tagitem-shadow, 0 2px 10px 0 rgba(50,100,255,0.07));
  position: relative;
  transition: background 0.2s;
  max-width: 180px;
  overflow: hidden;
}

.tag-item:hover {
  background: var(--tagitem-hover-bg, linear-gradient(90deg,#7fd3fa 0%,#99b5f6 100%));
}

.tag-label {
  padding-right: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 135px;
  display: inline-block;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
}

.tag-remove {
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 50%;
  margin-left: 3px;
  transition: background 0.18s;
  width: 20px;
  height: 20px;
  background: var(--tagitem-remove-bg, #a5bdfa);
  justify-content: center;
}

.tag-remove:hover {
  background: var(--tagitem-remove-hover-bg, #f56c6c);
  color: #fff;
}

.tag-remove svg {
  display: block;
  width: 0.9em;
  height: 0.9em;
}

.tag-plus-input {
  border: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  min-width: 84px;
  background: transparent;
  margin-left: 8px;
  padding: 4px 0;
}

.tag-plus-input:disabled {
  background: transparent;
  color: #b0b0b0;
  cursor: not-allowed;
}
.tag-plus-input::placeholder {
  color: var(--input-placeholder, #b1b7c7);
  opacity: 1;
}
.tag-tip {
  position: absolute;
  left: 14px;
  bottom: -1.8em;
  color: var(--tag-tip-text, #f56c6c);
  font-size: 0.98em;
  background: var(--tag-tip-bg, #fff8f7);
  padding: 1px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px #f56c6c11;
  z-index: 22;
  animation: fadeIn 0.25s;
}

.fade-tag-tip-enter-active,
.fade-tag-tip-leave-active {
  transition: opacity 0.28s;
}

.fade-tag-tip-enter-from,
.fade-tag-tip-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
