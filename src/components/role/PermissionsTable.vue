<template>
  <div class="permissions-table-container">
    <div class="permissions-header">
      <el-button type="primary" size="small" @click="$emit('add-permission')">
        <el-icon><Plus /></el-icon>Add Permission
      </el-button>
    </div>
    
    <el-table
      :data="permissions"
      stripe
      border
      style="width: 100%; margin-top: 16px;"
    >
      <el-table-column prop="name" label="Name" min-width="150" />
      <el-table-column prop="code" label="Code" min-width="150" />
      <el-table-column prop="description" label="Description" min-width="200" />
      <el-table-column label="Actions" width="100" fixed="right">
        <template #default="{ $index }">
          <el-button type="danger" size="small" circle @click="$emit('remove-permission', $index)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { Plus, Delete } from '@element-plus/icons-vue'

defineProps({
  permissions: {
    type: Array,
    default: () => []
  }
})

defineEmits(['add-permission', 'remove-permission'])
</script>

<style scoped>
.permissions-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
}
</style>
