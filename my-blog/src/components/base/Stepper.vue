<template>
  <div class="stepper">
    <div
      v-for="(step, idx) in steps"
      :key="idx"
      :class="['step', {active: idx<=current}]"
    >
      <span class="circle">{{ idx+1 }}</span>
      <span class="label">{{ step }}</span>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ steps: Array, current: Number })
</script>
<style>
.stepper { display: flex; align-items: center; gap: 2.1em; margin-bottom: 1.1em; }
.step { display: flex; align-items: center; gap: 0.5em; color: #bbb;}
.step.active { color: #646cff; }
.circle { width: 2em; height: 2em; border-radius: 50%; background: #eee; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.step.active .circle { background: #646cff; color: #fff; }
</style>
