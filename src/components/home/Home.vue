<template>
  <div class="home-container">
    <div class="cards-row">
      <!-- Task Center -->
      <div class="task-section">
        <el-card class="outer-card" shadow="never" v-loading="loading">
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
        
        <!-- Task Details Table -->
        <el-card class="outer-card table-card" shadow="never" v-loading="loading">
          <div class="table-header-row">
            <span class="table-title">Recent Tasks</span>
            <span class="view-all-link" @click="handleViewAll">View All</span>
          </div>
          <el-table :data="taskDetails" border style="width: 100%">
            <el-table-column prop="taskName" label="Task Name" />
            <el-table-column prop="functionUnitName" label="Function Unit Name" />
            <el-table-column prop="initiator" label="Initiator" />
            <el-table-column prop="createTime" label="Create Time" />
          </el-table>
        </el-card>
      </div>
      
      <!-- Applications -->
      <el-card class="outer-card" shadow="never" v-loading="loading">
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
import { getColor, fetchTaskStats, fetchApplicationStats, fetchTaskDetails } from './homeService.js'

const taskStats = ref([])
const applicationStats = ref([])
const taskDetails = ref([])
const loading = ref(true)
const selectedDays = ref(30)

const handleViewAll = () => {
  window.dispatchEvent(new CustomEvent('navigateToMenu'))
}

onMounted(async () => {
  try {
    taskStats.value = await fetchTaskStats()
    applicationStats.value = await fetchApplicationStats()
    taskDetails.value = await fetchTaskDetails()
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style src="./index.css"></style>
