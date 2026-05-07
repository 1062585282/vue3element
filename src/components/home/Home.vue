<template>
  <div class="home-container">
    <div class="cards-row">
      <!-- Task Center -->
      <el-card class="outer-card task-center-card" shadow="never" v-loading="loading">
        <div class="icon-text">icon</div>
        <h3>Task Center</h3>
        <p class="subtitle">Quick access to tasks</p>
        <div class="cards-grid">
          <StatCard 
            v-for="task in taskStats" 
            :key="task.status" 
            :status="task.status" 
            :count="task.count"
            :color="getColor(task.status)"
          />
        </div>
      </el-card>
      
      <!-- Applications -->
      <el-card class="outer-card apps-card" shadow="never" v-loading="loading">
        <div class="header-row">
          <div>
            <div class="icon-text">icon</div>
            <h3>Applications</h3>
            <p class="subtitle">Overview of your applications</p>
          </div>
          <el-select 
            v-model="selectedDays" 
            class="days-select" 
            placeholder="Select days"
          >
            <el-option label="Last 30 days" :value="30" />
            <el-option label="Last 60 days" :value="60" />
            <el-option label="Last 90 days" :value="90" />
          </el-select>
        </div>
        <div class="cards-grid">
          <StatCard 
            v-for="app in applicationStats" 
            :key="app.status" 
            :status="app.status" 
            :count="app.count"
            :color="getColor(app.status)"
            class="narrow-card"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatCard from './StatCard.vue'
import { getColor, fetchTaskStats, fetchApplicationStats } from './homeService.js'

const taskStats = ref([])
const applicationStats = ref([])
const loading = ref(true)
const selectedDays = ref(30)

onMounted(async () => {
  loading.value = true
  try {
    taskStats.value = await fetchTaskStats()
    applicationStats.value = await fetchApplicationStats()
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style>
.home-container {
  padding: 15px;
}

.cards-row {
  display: flex;
  gap: 16px;
  width: 100%;
}

.outer-card {
  flex: 1;
  padding: 15px;
  background: #fff;
  border-radius: 18px;
}

.outer-card h3 {
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: normal;
  color: #606266;
}

.subtitle {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #909399;
}

.cards-grid {
  display: flex;
  gap: 12px;
}

.narrow-card {
  width: 160px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.days-select {
  width: 140px;
}
</style>