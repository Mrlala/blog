<template>
  <div style="padding: 20px;">
    <h1 style="font-size: 24px;">我的博客文章</h1>
    <ul style="margin-top: 16px;">
      <li
        v-for="item in files"
        :key="item.file"
        style="margin-bottom: 16px;"
      >
        <router-link :to="'/article/' + item.file" style="font-size: 18px; color: #42b983;">
          {{ item.title }}
        </router-link>
        <div style="font-size: 12px; color: gray;">
          {{ item.date }} · {{ item.summary }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const files = ref([])

onMounted(async () => {
  const res = await fetch('/articles/index.json')
  files.value = await res.json()
})
</script>
