<template>
  <div class="pagination">
    <button :disabled="page<=1" @click="$emit('update:page', page-1)">«</button>
    <span v-for="p in pages" :key="p"
      :class="{active: p===page}" @click="$emit('update:page', p)">
      {{p}}
    </span>
    <button :disabled="page>=totalPages" @click="$emit('update:page', page+1)">»</button>
  </div>
</template>
<script setup>
const props = defineProps({ page: Number, total: Number, pageSize: Number })
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))
const pages = computed(() => {
  let arr = []
  for (let i = 1; i <= totalPages.value; ++i) arr.push(i)
  return arr
})
</script>
<style>
.pagination {
  display: flex; gap: 0.4em; align-items: center; margin: 1.2em 0; justify-content: center;
}
.pagination button, .pagination span {
  border: none; border-radius: 5px; background: #f4f6fa;
  color: #4754be; padding: 0.32em 1em; font-size: 1em; cursor: pointer;
  transition: background 0.2s;
}
.pagination .active {
  background: #646cff; color: #fff; font-weight: bold;
}
.pagination button:disabled { color: #aaa; cursor: not-allowed; }
</style>
