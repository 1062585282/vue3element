<template>
  <el-card 
    class="stat-card"
    :style="{ '--card-color': color }"
    shadow="never"
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
  }
})
</script>
