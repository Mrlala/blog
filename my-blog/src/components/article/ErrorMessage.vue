<template>
  <div class="error-message">{{ message }}</div>
</template>

<script setup>
defineProps({ message: String })
</script>

<style scoped>
.error-message {
  color: var(--error-color, #ef4444);
  background: #fff2f2;
  border-radius: 1em;
  padding: 1.2em 1em;
  font-size: 1.05em;
  margin: 2em 0 1.6em;
  letter-spacing: 0.02em;
}

</style>
