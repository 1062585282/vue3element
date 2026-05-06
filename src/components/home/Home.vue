<template>
  <div class="home-container">
    
    <!-- Task Cards -->
    <div class="card-row">
      <h3>Tasks</h3>
      <el-card class="tasks-wrapper-card" shadow="false">
        <div class="cards-grid">
          <div 
            v-for="task in taskStats" 
            :key="task.status" 
            class="stat-item"
            :class="getTaskCardClass(task.status)"
          >
            <div class="stat-content">
              <div class="stat-status">{{ task.status }}</div>
              <div class="stat-count">{{ task.count }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- Application Cards -->
    <div class="card-row">
      <h3>Applications</h3>
      <div class="cards-grid">
        <el-card 
          v-for="app in applicationStats" 
          :key="app.status" 
          class="stat-card"
          :class="getAppCardClass(app.status)"
        >
          <div class="stat-content">
            <div class="stat-status">{{ app.status }}</div>
            <div class="stat-count">{{ app.count }}</div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const taskStats = ref([])
const applicationStats = ref([])

// Mock API to get task statistics
const fetchTaskStats = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock API response
    taskStats.value = [
      { status: 'In Progress', count: 8 },
      { status: 'Pending', count: 15 },
      { status: 'Completed', count: 42 }
    ]
  } catch (error) {
    console.error('Error fetching task stats:', error)
  }
}

// Mock API to get application statistics
const fetchApplicationStats = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock API response
    applicationStats.value = [
      { status: 'In Progress', count: 23 },
      { status: 'Ended', count: 12 }
    ]
  } catch (error) {
    console.error('Error fetching application stats:', error)
  }
}

// Get card class based on task status
const getTaskCardClass = (status) => {
  switch (status) {
    case 'In Progress':
      return 'task-in-progress'
    case 'Pending':
      return 'task-pending'
    case 'Completed':
      return 'task-completed'
    default:
      return ''
  }
}

// Get card class based on application status
const getAppCardClass = (status) => {
  switch (status) {
    case 'In Progress':
      return 'app-in-progress'
    case 'Ended':
      return 'app-ended'
    default:
      return ''
  }
}

onMounted(() => {
  fetchTaskStats()
  fetchApplicationStats()
})
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.card-row {
  margin-bottom: 30px;
}

.card-row h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: normal;
  color: #606266;
}

.cards-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-card {
  width: 200px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tasks-wrapper-card {
  width: 100%;
  border-radius: 18px;
}

.stat-item {
  width: 200px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #ffffff;
}

.stat-content {
  text-align: center;
}

.stat-status {
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 10px;
  color: #606266;
}

.stat-count {
  font-size: 48px;
  font-weight: normal;
}

/* Task card styles - white background, colored content */
.task-in-progress .stat-status,
.task-in-progress .stat-count {
  color: #667eea;
}

.task-pending .stat-status,
.task-pending .stat-count {
  color: #f5576c;
}

.task-completed .stat-status,
.task-completed .stat-count {
  color: #4facfe;
}

/* Application card styles */
.app-in-progress {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.app-in-progress .stat-status,
.app-in-progress .stat-count {
  color: #fff;
}

.app-ended {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.app-ended .stat-status,
.app-ended .stat-count {
  color: #fff;
}
</style>
