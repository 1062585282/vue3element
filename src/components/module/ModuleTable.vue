<template>
  <div class="module-table">
    <div class="table-header">
      <el-button :icon="Refresh" @click="$emit('refresh')">Refresh</el-button>
      <div class="header-right">
        <el-button type="primary" :icon="Plus" @click="$emit('add')">Add Module</el-button>
        <el-button 
          type="danger" 
          :icon="Delete" 
          :disabled="selectedRows.length === 0"
          @click="handleBatchDelete"
        >
          Delete Selected ({{ selectedRows.length }})
        </el-button>
      </div>
    </div>

    <el-table
      :data="modules"
      v-loading="loading"
      stripe
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" min-width="180" />
      <el-table-column prop="name" label="Module Name" min-width="150" />
      <el-table-column prop="category" label="Category" min-width="120">
        <template #default="{ row }">
          <el-tag :type="getCategoryTagType(row.category)">
            {{ getCategoryLabel(row.category) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="Type" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 'component' ? 'success' : 'info'">
            {{ row.type === 'component' ? 'Component' : 'Lib' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="version" label="Version" min-width="100" />
      <el-table-column prop="file" label="File Name" min-width="150" />
      <el-table-column prop="entry" label="Entry" min-width="80">
        <template #default="{ row }">
          <el-tag :type="row.entry ? 'success' : 'info'">
            {{ row.entry ? 'true' : 'false' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="220" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            :icon="Edit"
            @click="$emit('edit', row)"
          />
          <el-button
            type="success"
            size="small"
            :icon="Upload"
            @click="$emit('upload-file', row)"
          />
          <el-button
            type="info"
            size="small"
            :icon="View"
            @click="$emit('view', row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && modules.length === 0" description="No data" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Refresh, Edit, Delete, Plus, View, Upload } from '@element-plus/icons-vue'

defineProps({
  modules: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'delete', 'refresh', 'add', 'batch-delete', 'view', 'upload-file'])

const selectedRows = ref([])

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleBatchDelete = () => {
  if (selectedRows.value.length > 0) {
    emit('batch-delete', selectedRows.value)
  }
}

const getCategoryLabel = (category) => {
  const labels = {
    portal: 'Portal',
    admin_center: 'Admin Center',
    workstation: 'Workstation'
  }
  return labels[category] || category
}

const getCategoryTagType = (category) => {
  const types = {
    portal: 'primary',
    admin_center: 'warning',
    workstation: 'success'
  }
  return types[category] || 'info'
}
</script>

<style scoped>
.module-table {
  width: 100%;
}

.table-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-right {
  display: flex;
  gap: 10px;
}

:deep(.el-table th) {
  background-color: #f5f7fa !important;
}

:deep(.el-table__row) {
  height: 40px !important;
}

:deep(.el-table td) {
  padding: 8px 0 !important;
}
</style>
