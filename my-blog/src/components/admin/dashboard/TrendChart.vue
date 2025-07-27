<template>
  <v-chart :option="option" style="width:100%;height:280px;" />
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  LineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer
])

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

// 生成最近7天的日期数组，格式 YYYY-MM-DD
function getLast7Days() {
  const arr = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    arr.push(d.toISOString().slice(0, 10))
  }
  return arr
}

const option = computed(() => {
  const last7days = getLast7Days()
  // 转换接口数据成 map，方便查找
  const dataMap = new Map(props.data.map(item => [item.day, item.views]))

  const values = last7days.map(date => dataMap.get(date) ?? 0)

  return {
    // title removed to avoid redundancy
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [
      {
        data: values,
        type: 'line',
        smooth: true,
        showSymbol: false,
        areaStyle: {}
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  }
})
</script>
