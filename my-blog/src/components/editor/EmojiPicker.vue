<template>
  <div class="emoji-picker">
    <span v-for="emoji in emojis" :key="emoji" class="emoji"
      @click="$emit('pick', emoji)"
    >{{ emoji }}</span>
  </div>
</template>

<script setup>
const emojis = [
  '😀','😅','😂','😊','😍','🤔','👍','👏','🔥','🎉','❤️','🚀','😎','🥳','🙌','😭','💡'
]
</script>

<style>
.emoji-picker {
  background: #fff;
  border: 1.5px solid #eee;
  border-radius: 7px;
  padding: 0.4em 0.5em;
  margin-bottom: 0.6em;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35em;
  max-width: 320px;
}
.emoji {
  font-size: 1.36em;
  cursor: pointer;
  user-select: none;
  transition: transform 0.12s;
}
.emoji:hover {
  transform: scale(1.25);
  background: #f6f6fa;
  border-radius: 5px;
}
</style>
