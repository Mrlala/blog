<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 引入所有小工具页面组件（假设都在 /pages/tools 目录）
// 文本工具
import TextDedup from './tools/text/TextDedup.vue'
import TextReplace from './tools/text/TextReplace.vue'
import TextCase from './tools/text/TextCase.vue'
import TextCount from './tools/text/TextCount.vue'
import TextSort from './tools/text/TextSort.vue'

// 编码/解码工具
import UrlEncodeTool from './tools/encode/UrlEncodeTool.vue'
import Base64Tool from './tools/encode/Base64Tool.vue'
import HtmlEntityTool from './tools/encode/HtmlEntityTool.vue'
import UnicodeTool from './tools/encode/UnicodeTool.vue'
import Img2Base64Tool from './tools/encode/Img2Base64Tool.vue'
import Base64ImgTool from './tools/encode/Base64ImgTool.vue'
import Md2HtmlTool from './tools/encode/Md2HtmlTool.vue'

// 开发/格式化
import JsonFormatter from './tools/dev/JsonFormatter.vue'
import JsonDiffTool from './tools/dev/JsonDiffTool.vue'
import RegexTool from './tools/dev/RegexTool.vue'
import CronTool from './tools/dev/CronTool.vue'
import HttpHeaderTool from './tools/dev/HttpHeaderTool.vue'
import EmojiTool from './tools/dev/EmojiTool.vue'
import EncryptDemoTool from './tools/dev/EncryptDemoTool.vue'

// 转换/数值工具
import ConvertTool from './tools/number/ConvertTool.vue'
import TimestampTool from './tools/number/TimestampTool.vue'
import ColorTool from './tools/number/ColorTool.vue'
import UuidTool from './tools/number/UuidTool.vue'
import PasswordGenerator from './tools/number/PasswordGenerator.vue'
import RandomNumberTool from './tools/number/RandomNumberTool.vue'

// 网络与其它
import QrCodeTool from './tools/net/QrCodeTool.vue'
import BarcodeTool from './tools/net/BarcodeTool.vue'
import ShortUrlTool from './tools/net/ShortUrlTool.vue'
import NicknameTool from './tools/net/NicknameTool.vue'
import CountdownTool from './tools/net/CountdownTool.vue'
import TimeTool from './tools/net/TimeTool.vue'
import LuckyWheelTool from './tools/net/LuckyWheelTool.vue'

// ... 有新工具继续补

const route = useRoute()
const tool = computed(() => route.params.tool)

const toolMap = {
  // 文本工具
  'text-dedup': TextDedup,
  'text-replace': TextReplace,
  'text-case': TextCase,
  'text-count': TextCount,
  'text-sort': TextSort,

  // 编码/解码工具
  'urlencode': UrlEncodeTool,
  'base64': Base64Tool,
  'html-entity': HtmlEntityTool,
  'unicode': UnicodeTool,
  'img2base64': Img2Base64Tool,
  'base64img': Base64ImgTool,
  'md2html': Md2HtmlTool,

  // 开发/格式化
  'json': JsonFormatter,
  'json-diff': JsonDiffTool,
  'regex': RegexTool,
  'cron': CronTool,
  'http-header': HttpHeaderTool,
  'emoji': EmojiTool,
  'encrypt': EncryptDemoTool,

  // 转换/数值工具
  'convert': ConvertTool,
  'timestamp': TimestampTool,
  'color': ColorTool,
  'uuid': UuidTool,
  'password': PasswordGenerator,
  'random': RandomNumberTool,

  // 网络与其它
  'qrcode': QrCodeTool,
  'barcode': BarcodeTool,
  'shorturl': ShortUrlTool,
  'nickname': NicknameTool,
  'countdown': CountdownTool,
  'timer': TimeTool,
  'luck-tool': LuckyWheelTool,
}

const current = computed(() => toolMap[tool.value])
</script>

<template>
  <component :is="current" v-if="current" />
  <div v-else style="padding:4em;text-align:center;color:#bbb;">未找到该工具</div>
</template>
