<template>
  <div class="breadcrumb">
    <span v-for="(item, idx) in items" :key="idx">
      <a v-if="item.link" :href="item.link">{{ item.text }}</a>
      <span v-else>{{ item.text }}</span>
      <span v-if="idx<items.length-1" class="sep">/</span>
    </span>
  </div>
</template>
<script setup>
const props = defineProps({ items: Array })
</script>
<style>
.breadcrumb { font-size: 1em; color: #888; margin-bottom: 0.7em; }
.breadcrumb .sep { margin: 0 0.6em; color: #bbb; }
.breadcrumb a { color: #646cff; text-decoration: none;}
.breadcrumb a:hover { text-decoration: underline; }
</style>
