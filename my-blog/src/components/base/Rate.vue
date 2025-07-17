<template>
  <div class="rate">
    <span v-for="i in max" :key="i" @click="rate(i)">
      <span :class="{active: value>=i}">★</span>
    </span>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({ value: Number, max: {type: Number, default: 5}})
const emit = defineEmits(['update:value'])
function rate(v) { emit('update:value', v) }
</script>
<style>
.rate { font-size: 1.48em; color: #ddd; }
.rate .active { color: #ffd600; cursor: pointer;}
.rate span { cursor: pointer; }
</style>
