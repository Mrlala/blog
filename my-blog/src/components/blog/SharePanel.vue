<template>
  <div class="share-panel">
    <span @click="copy" title="复制链接">🔗</span>
    <span @click="open('wechat')" title="微信">💬</span>
    <span @click="open('weibo')" title="微博">🐦</span>
    <span @click="open('twitter')" title="Twitter">🐤</span>
  </div>
</template>
<script setup>
function copy() {
  navigator.clipboard.writeText(window.location.href)
}
function open(type) {
  // 可自定义跳转分享逻辑
  alert('模拟跳转分享 ' + type)
}
</script>
<style>
.share-panel { display: flex; gap: 1em; font-size: 1.35em; margin: 0.5em 0;}
.share-panel span { cursor: pointer; }
.share-panel span:hover { color: #4754be; }
</style>
