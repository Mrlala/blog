<template>
  <div class="mention-user">
    <input v-model="kw" @input="search" placeholder="@用户名" class="mention-input" />
    <ul v-if="show">
      <li v-for="u in users" :key="u" @click="$emit('mention', u)">{{ u }}</li>
    </ul>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const kw = ref('')
const users = ref(['张三','李四','Alice','Bob'])
const show = ref(false)
function search() {
  show.value = !!kw.value
  // 实际项目这里可从服务端获取 @ 名单
}
</script>
<style>
.mention-user { position: relative; display: inline-block; }
.mention-input { border-radius: 6px; border: 1px solid #ccc; padding: 0.25em 0.8em; }
.mention-user ul {
  position: absolute; left:0; top:110%;
  background: #fff; border: 1.5px solid #e9edff; border-radius: 7px;
  box-shadow: 0 2px 10px rgba(60,60,60,0.08);
  margin: 0; padding: 0.2em 0;
  min-width: 100px; z-index: 120;
}
.mention-user li {
  list-style: none;
  padding: 0.3em 1.1em;
  cursor: pointer;
}
.mention-user li:hover { background: #f3f5fd; color: #4754be; }
</style>
