<template>
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
</template>

<script setup>
defineProps({
  taskDetails: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const handleViewAll = () => {
  window.dispatchEvent(new CustomEvent('navigateToMenu'))
}
</script>
