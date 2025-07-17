<template>
  <img
    :src="src || defaultAvatar"
    :alt="alt || '用户头像'"
    class="user-avatar"
    :style="{ width: size+'px', height: size+'px' }"
  />
</template>
<script setup>
const props = defineProps({
  src: String,
  alt: String,
  size: { type: Number, default: 48 }
})
const defaultAvatar = 'https://avatars.githubusercontent.com/u/1?v=4' // 可替换默认头像
</script>
<style>
.user-avatar {
  border-radius: 50%;
  border: 2px solid #e9edff;
  background: #f2f5fa;
  object-fit: cover;
}
</style>
