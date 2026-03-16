<template>
  <div class="management-header">
    <div class="header-content">
      <div class="search-section">
        <el-input
          :model-value="search"
          @update:model-value="$emit('update:search', $event)"
          placeholder="Search by Name or Code"
          clearable
          class="search-input"
        />
      </div>
      <div class="header-buttons">
        <el-button @click="$emit('refresh')">
          <el-icon><Refresh /></el-icon>Refresh
        </el-button>
        <el-button type="primary" @click="$emit('add')">
          <el-icon><Plus /></el-icon>Add Role
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, Refresh } from '@element-plus/icons-vue'

defineProps({
  search: {
    type: String,
    default: ''
  }
})

defineEmits(['update:search', 'refresh', 'add'])
</script>

<style scoped>
.management-header {
  margin-bottom: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.search-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.header-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.header-buttons .el-icon {
  margin-right: 4px;
}
</style>
