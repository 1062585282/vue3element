<template>
  <el-card shadow="false" class="chart-config-card">
    <h3>Chart Configuration</h3>
    <el-form :model="form" label-width="80px" class="chart-config-form">
      <!-- 图表类型选择 -->
      <el-form-item label="Chart Type">
        <el-select v-model="form.chartType" placeholder="Select chart type" @change="handleChartTypeChange">
          <el-option label="Bar Chart" value="bar" />
          <el-option label="Pie Chart" value="pie" />
          <el-option label="Line Chart" value="line" />
          <el-option label="Doughnut Chart" value="doughnut" />
          <el-option label="Radar Chart" value="radar" />
        </el-select>
      </el-form-item>
      
      <!-- 数据表选择 -->
      <el-form-item label="Data Table">
        <el-select v-model="form.table" placeholder="Select data table" @change="handleTableChange">
          <el-option label="Users" value="users" />
          <el-option label="Orders" value="orders" />
          <el-option label="Products" value="products" />
        </el-select>
      </el-form-item>
      
      <!-- X轴属性选择 -->
      <el-form-item label="X Axis">
        <el-select v-model="form.xAxis" placeholder="Select X axis" :disabled="!form.table">
          <el-option 
            v-for="field in availableFields" 
            :key="field.value" 
            :label="field.label" 
            :value="field.value" 
          />
        </el-select>
      </el-form-item>
      
      <!-- Y轴属性选择 -->
      <el-form-item label="Y Axis">
        <el-select v-model="form.yAxis" placeholder="Select Y axis" :disabled="!form.table">
          <el-option 
            v-for="field in availableFields" 
            :key="field.value" 
            :label="field.label" 
            :value="field.value" 
          />
        </el-select>
      </el-form-item>
      
      <!-- 图表标题 -->
      <el-form-item label="Chart Title">
        <el-input v-model="form.title" placeholder="Enter chart title" />
      </el-form-item>
      
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button 
          type="primary" 
          @click="submitConfig" 
          :disabled="!isFormValid"
        >
          Generate Chart
        </el-button>
        <el-button @click="resetForm">Reset</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// 定义emit事件
const emit = defineEmits(['chart-configured'])

// 表单数据
const form = ref({
  chartType: 'bar',
  table: '',
  xAxis: '',
  yAxis: '',
  title: ''
})

// 表字段配置
const tableFields = {
  users: [
    { label: 'Name', value: 'name' },
    { label: 'Age', value: 'age' },
    { label: 'Count', value: 'count' },
    { label: 'Score', value: 'score' }
  ],
  orders: [
    { label: 'Date', value: 'date' },
    { label: 'Amount', value: 'amount' },
    { label: 'Count', value: 'count' },
    { label: 'Status', value: 'status' }
  ],
  products: [
    { label: 'Name', value: 'name' },
    { label: 'Price', value: 'price' },
    { label: 'Stock', value: 'stock' },
    { label: 'Sales', value: 'sales' }
  ]
}

// 可用字段计算属性
const availableFields = computed(() => {
  if (!form.value.table) {
    return []
  }
  return tableFields[form.value.table] || []
})

// 表单验证计算属性
const isFormValid = computed(() => {
  return form.value.chartType && 
         form.value.table && 
         form.value.xAxis && 
         form.value.yAxis
})

// 处理图表类型变更
const handleChartTypeChange = (value) => {
  console.log('Chart type changed:', value)
}

// 处理表变更
const handleTableChange = (value) => {
  // 重置轴选择
  form.value.xAxis = ''
  form.value.yAxis = ''
  console.log('Table changed:', value)
}

// 提交配置
const submitConfig = () => {
  if (!isFormValid.value) return
  
  // 构建配置对象
  const config = {
    ...form.value
  }
  
  // 发送配置事件
  emit('chart-configured', config)
  console.log('Chart config submitted:', config)
}

// 重置表单
const resetForm = () => {
  form.value = {
    chartType: 'bar',
    table: '',
    xAxis: '',
    yAxis: '',
    title: ''
  }
}
</script>

<style scoped>
.chart-config-card {
  height: 100%;
}

.chart-config-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #666;
  font-size: 16px;
}

.chart-config-form {
  max-width: 100%;
}

.el-form-item {
  margin-bottom: 16px;
}
</style>