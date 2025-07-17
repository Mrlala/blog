<template>
  <div class="input-limit-tip" :class="{ over: isOver }">
    {{ msg }}
  </div>
</template>
<script setup>
const props = defineProps({
  value: String,      // 当前内容
  limit: Number,      // 最大长度
  field: String       // 字段名（如“标题”）
})
const isOver = computed(() => props.value.length > props.limit)
const msg = computed(() =>
  isOver.value
    ? `${props.field || ''}已超出最大限制！`
    : `${props.field || ''}最大${props.limit}字，当前${props.value.length}字`
)
</script>
<style>
.input-limit-tip {
  font-size: 0.97em;
  color: #888;
  margin-top: 0.3em;
}
.input-limit-tip.over {
  color: #e93f3f;
  font-weight: bold;
}
</style>
