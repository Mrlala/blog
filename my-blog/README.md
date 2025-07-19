明白！
下面是一个**适合放在 GitHub 仓库的“博客项目组件说明文档”**，
包含目录结构说明、主要依赖、每类组件用途说明、典型页面用法场景等，让新成员或未来的你一看就懂。

---

````markdown
# 📝 博客前端组件库文档

> 本项目为个人/团队博客系统，采用 Vue3 + Vite + 组件化架构，所有功能区块均组件化，易于维护和拓展。  
> 下面是本项目核心组件的目录结构、用途说明、典型用法及推荐扩展方向。

---

## 📁 目录结构（推荐分组）

```text
src/
  components/
    editor/      # 编辑器和写作页相关
    base/        # 通用UI组件
    message/     # 提示、弹窗、气泡、提示条等
    blog/        # 博客业务区块（列表卡片、分享、Meta等）
    user/        # 用户相关
  composables/   # 可复用逻辑 hooks
  api/           # 与后端交互的API
  pages/         # 页面级组件
````

---

## 🔧 主要依赖

* Vue 3
* Vite
* marked（Markdown 渲染）
* highlight.js（代码高亮）
* 其它依赖按需引入

---

## 📦 组件清单与用途说明

### 1. `editor/` 编辑器区块

* `TagInput.vue`         标签输入，支持回车/逗号分隔、删除
* `EditorToolbar.vue`    编辑器工具栏（加粗、斜体、图片、表情、字号、清空等一行收纳，弹窗式浮层）
* `EmojiPicker.vue`      选择表情，插入到光标
* `ImageUploader.vue`    上传/粘贴/拖拽图片并自动插入 markdown
* `CharCount.vue`        实时字数统计（内容区下方）
* `AutoDraftBar.vue`     草稿保存提示条（自动保存、显示时间、恢复/清除）
* `MarkdownPreview.vue`  实时 markdown 渲染，代码高亮
* `CustomFontSize.vue`   字号调节（编辑区/预览区）
* `TableInsert.vue`      可视化生成 markdown 表格插入正文
* `PreviewToggle.vue`    编辑/预览/分栏切换
* `ResizableTextarea.vue`输入区高度可调
* `MentionUser.vue`      支持@用户插入
* `HelpTip.vue`          写作语法/快捷键帮助悬浮提示
* `ContentToc.vue`       侧边大纲/目录跳转
* `WordDiff.vue`         正文对比（内容变更查看）

### 2. `base/` 基础通用UI

* `SaveButton.vue`       保存按钮（支持 loading）
* `Pagination.vue`       列表分页
* `Dialog.vue`           通用弹窗
* `Collapse.vue`         折叠面板（FAQ/设置区等）
* `Tabs.vue`             标签页
* `Tooltip.vue`          悬浮提示
* `LoadingSpinner.vue`   全局/局部加载动画
* `Badge.vue`            红点/数字角标
* `BreadCrumb.vue`       面包屑
* `ThemeSwitcher.vue`    夜间/浅色主题切换
* `Switch.vue`           通用开关
* `Rate.vue`             评分
* `Skeleton.vue`         骨架屏/加载占位
* `Stepper.vue`          步骤条

### 3. `message/` 消息和提示

* `MessageTip.vue`       操作结果通知
* `InputLimitTip.vue`    字数/内容限制提示
* `ConfirmModal.vue`     删除/危险操作确认弹窗
* `Alert.vue`            区块/顶部提示条
* `KeyboardHint.vue`     快捷键列表条

### 4. `blog/` 博客区块

* `ArticleCard.vue`      文章卡片（首页/列表页）
* `ArticleMeta.vue`      文章作者/时间/标签区块
* `SharePanel.vue`       文章社交分享
* `FileAttachment.vue`   非图片附件上传

### 5. `user/` 用户相关

* `UserAvatar.vue`       头像圆形组件
* `MentionUser.vue`      @某人选择

---

## 🖼️ 典型页面与组件组合方案

### 写作页（Write.vue）

* 主要用：TagInput、EditorToolbar、EmojiPicker、ImageUploader、CharCount、SaveButton、AutoDraftBar、MessageTip、MarkdownPreview、InputLimitTip、CustomFontSize、HelpTip
* 自动草稿保存/恢复，所有编辑功能一栏收纳，内容输入与预览分栏
* 所有插入（表情/图片/快捷命令）通过工具栏事件与 textarea 联动

### 文章列表页（ArticleList.vue）

* 主要用：ArticleCard、Pagination、InputLimitTip、ConfirmModal、SharePanel、ThemeSwitcher、MessageTip

### 文章详情页（ArticlePage.vue）

* 主要用：MarkdownPreview、ArticleMeta、ContentToc、SharePanel、UserAvatar、Rate、MessageTip、ThemeSwitcher

---

## 🔁 推荐协作与开发约定

* 所有 UI/业务区块先拆分组件再组装页面
* 逻辑类（草稿、API、解析等）封装在 composables/、api/、utils/ 目录
* 组件/页面命名采用大驼峰风格
* 样式以单文件组件 style 内 scoped 为主，支持 Tailwind、CSS Modules 或其它方案
* Markdown 渲染可直接插入 MarkdownPreview，所有内容高亮、样式统一

---

## 🧩 未来推荐扩展

* 多草稿历史
* 撤销/重做
* AI 智能校对/内容建议
* 侧边协作编辑/评论
* 首页支持内容过滤/全文检索
* 组件 Storybook 文档化

---

## 📎 主要依赖

* [vue](https://vuejs.org/) / [vite](https://vitejs.dev/)
* [marked](https://github.com/markedjs/marked)
* [highlight.js](https://highlightjs.org/)
* 其余按需引入

---
