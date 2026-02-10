<template>
  <el-card shadow="false" class="dashboard-container">
    <div class="dashboard-header">
      <h2>Dashboard</h2>
      <p>Create and customize your data visualizations</p>
    </div>
    
    <div class="dashboard-content">
      <!-- 左侧图表配置 -->
      <div class="chart-config-section">
        <ChartConfig 
          @chart-configured="handleChartConfigured"
        />
      </div>
      
      <!-- 右侧图表展示 -->
      <div class="chart-display-section">
        <ChartDisplay 
          :chartConfig="chartConfig"
          :chartData="chartData"
        />
      </div>
    </div>
    
    <!-- HTTP 请求测试器 -->
    <HttpRequestTester />
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import ChartConfig from './ChartConfig.vue'
import ChartDisplay from './ChartDisplay.vue'
import HttpRequestTester from './HttpRequestTester.vue'

// 响应式数据
const chartConfig = ref(null)
const chartData = ref(null)

// 处理图表配置完成
const handleChartConfigured = (config) => {
  chartConfig.value = config
  // 生成图表数据
  generateChartData(config)
}

// 生成图表数据
const generateChartData = (config) => {
  if (!config) return
  
  // 根据配置生成模拟数据
  // 实际项目中这里会从后端获取真实数据
  const { chartType, table, xAxis, yAxis } = config
  
  // 模拟数据
  const mockData = {
    'users': {
      'age': [18, 25, 30, 35, 40, 45, 50],
      'count': [120, 190, 300, 250, 180, 120, 80],
      'name': ['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7'],
      'score': [85, 92, 78, 90, 88, 76, 82]
    },
    'orders': {
      'date': ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'],
      'amount': [12000, 19000, 30000, 25000, 18000, 22000],
      'count': [120, 190, 300, 250, 180, 220],
      'status': ['completed', 'pending', 'cancelled', 'refunded', 'processing', 'delivered']
    },
    'products': {
      'name': ['Product1', 'Product2', 'Product3', 'Product4', 'Product5'],
      'price': [120, 190, 300, 250, 180],
      'stock': [1200, 1900, 3000, 2500, 1800],
      'sales': [120, 190, 300, 250, 180]
    }
  }
  
  // 根据选择的表和属性生成数据
  if (mockData[table]) {
    const tableData = mockData[table]
    chartData.value = {
      labels: tableData[xAxis] || [],
      datasets: [{
        label: yAxis,
        data: tableData[yAxis] || [],
        backgroundColor: getChartColors(chartType, tableData[xAxis]?.length || 0),
        borderColor: getChartColors(chartType, tableData[xAxis]?.length || 0, true),
        borderWidth: 1
      }]
    }
  }
}

// 获取图表颜色
const getChartColors = (chartType, count, isBorder = false) => {
  const baseColors = [
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(199, 199, 199, 0.6)',
    'rgba(83, 102, 255, 0.6)'
  ]
  
  const borderColors = [
    'rgba(54, 162, 235, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(199, 199, 199, 1)',
    'rgba(83, 102, 255, 1)'
  ]
  
  const colors = isBorder ? borderColors : baseColors
  const result = []
  
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length])
  }
  
  return result
}
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  min-height: 600px;
}

.dashboard-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.dashboard-header h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.dashboard-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.dashboard-content {
  display: flex;
  gap: 20px;
}

.chart-config-section {
  width: 350px;
  flex-shrink: 0;
}

.chart-display-section {
  flex: 1;
  min-height: 500px;
}

@media (max-width: 1200px) {
  .dashboard-content {
    flex-direction: column;
  }
  
  .chart-config-section {
    width: 100%;
  }
}
</style>