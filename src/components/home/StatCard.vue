<template>
  <el-card 
    class="stat-card"
    :style="{ '--card-color': color }"
    shadow="never"
    v-loading="loading"
  >
    <div class="stat-content">
      <div class="stat-status">{{ status }}</div>
      <div class="stat-count">{{ count }}</div>
    </div>
  </el-card>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    required: true
  },
  count: {
    type: [Number, String],
    required: true
  },
  color: {
    type: String,
    default: '#95a5a6'
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.stat-card {
  width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  padding: 0;
  border: none;
  background: #f5f5f5;
}

.stat-card :deep(.el-card__body) {
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  text-align: center;
}

.stat-status {
  font-size: 18px;
  font-weight: normal;
  margin-bottom: 10px;
  color: var(--card-color);
}

.stat-count {
  font-size: 20px;
  font-weight: normal;
  color: var(--card-color);
}
</style>