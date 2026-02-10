<template>
  <el-card shadow="false" class="chart-display-card">
    <div v-if="!chartConfig || !chartData" class="no-chart-state">
      <el-empty description="Please configure and generate a chart" />
    </div>
    
    <div v-else class="chart-container">
      <canvas ref="chartCanvas" class="chart-canvas"></canvas>
    </div>
  </el-card>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'

// 接收属性
const props = defineProps({
  chartConfig: {
    type: Object,
    default: null
  },
  chartData: {
    type: Object,
    default: null
  }
})

// 图表实例
const chartCanvas = ref(null)
let chartInstance = null

// 监听图表数据变化
watch(
  () => [props.chartConfig, props.chartData],
  () => {
    renderChart()
  },
  { deep: true }
)

// 挂载时初始化图表
onMounted(() => {
  renderChart()
})

// 卸载时销毁图表
onUnmounted(() => {
  destroyChart()
})

// 渲染图表
const renderChart = () => {
  if (!props.chartConfig || !props.chartData || !chartCanvas.value) {
    return
  }
  
  // 销毁现有图表
  destroyChart()
  
  // 创建新图表
  const ctx = chartCanvas.value.getContext('2d')
  
  // 图表配置
  const config = {
    type: props.chartConfig.chartType,
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: !!props.chartConfig.title,
          text: props.chartConfig.title
        }
      },
      scales: props.chartConfig.chartType !== 'pie' && props.chartConfig.chartType !== 'doughnut' ? {
        y: {
          beginAtZero: true
        }
      } : {}
    }
  }
  
  // 尝试创建图表
  try {
    // 使用导入的Chart对象创建图表
    chartInstance = new Chart(ctx, config)
  } catch (error) {
    console.error('Error rendering chart:', error)
    // 使用模拟图表
    renderMockChart(ctx)
  }
}

// 销毁图表
const destroyChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}

// 渲染模拟图表（当Chart.js不可用时）
const renderMockChart = (ctx) => {
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  // 绘制模拟图表
  ctx.fillStyle = '#f5f7fa'
  ctx.fillRect(0, 0, width, height)
  
  ctx.fillStyle = '#909399'
  ctx.font = '14px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Chart.js is required to display charts', width / 2, height / 2)
  ctx.fillText('Please install Chart.js: npm install chart.js', width / 2, height / 2 + 20)
}
</script>

<style scoped>
.chart-display-card {
  height: 100%;
  min-height: 500px;
}

.no-chart-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.chart-container {
  position: relative;
  height: 400px;
}

.chart-container h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #666;
  font-size: 16px;
  text-align: center;
}

.chart-canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>