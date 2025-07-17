<template>
  <div class="help-tip-wrapper" @mouseenter="show = true" @mouseleave="show = false">
    <slot>
      <span class="help-tip-icon">?</span>
    </slot>
    <transition name="fade">
      <div v-if="show" class="help-tip-pop">
        <slot name="content">
          <div>
            <b>Markdown 常用语法：</b><br/>
            <pre>
# 一级标题
**加粗**  *斜体*  `代码`
[链接](https://example.com)
- 列表
> 引用
---
            </pre>
            <b>快捷键：</b><br/>
            <ul>
              <li>Ctrl+B 加粗</li>
              <li>Ctrl+I 斜体</li>
              <li>Ctrl+K 插入链接</li>
            </ul>
          </div>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const show = ref(false)
</script>

<style>
.help-tip-wrapper {
  display: inline-block;
  position: relative;
  cursor: pointer;
}
.help-tip-icon {
  display: inline-block;
  width: 1.4em;
  height: 1.4em;
  background: #e9edff;
  color: #4754be;
  border-radius: 50%;
  text-align: center;
  line-height: 1.4em;
  font-weight: bold;
  font-size: 1.05em;
  box-shadow: 0 2px 6px rgba(100,108,255,0.07);
  margin-left: 0.5em;
}
.help-tip-pop {
  position: absolute;
  left: 120%;
  top: 0;
  min-width: 220px;
  max-width: 350px;
  background: #fff;
  color: #222;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(100,108,255,0.16);
  padding: 1.2em 1.1em;
  z-index: 1200;
  font-size: 0.98em;
  text-align: left;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.help-tip-pop pre {
  background: #f3f5fd;
  padding: 0.4em 0.7em;
  border-radius: 5px;
  font-size: 0.96em;
  margin: 0.7em 0 0.5em 0;
}
.help-tip-pop ul {
  margin: 0.4em 0 0 1.1em;
  padding: 0;
}
</style>
