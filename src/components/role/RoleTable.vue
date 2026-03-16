<template>
  <el-table
    :data="data"
    v-loading="loading"
    stripe
    border
    style="width: 100%"
    row-key="id"
  >
    <el-table-column v-if="expandable" type="expand" width="50">
      <template #default="{ row }">
        <div class="expand-content">
          <div class="ad-groups-section">
            <h4>AD Groups</h4>
            <div v-if="row.groups && row.groups.length > 0" class="ad-groups-list">
              <div
                v-for="(group, index) in row.groups"
                :key="index"
                class="ad-group-item"
              >
                {{ group }}
              </div>
            </div>
            <div v-else class="no-groups">
              No AD Groups
            </div>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="id" label="ID" min-width="100" />
    <el-table-column prop="name" label="Name" min-width="150" />
    <el-table-column prop="code" label="Code" min-width="120" />
    <el-table-column prop="description" label="Description" min-width="200" show-overflow-tooltip />
    <el-table-column label="Active" width="100" align="center">
      <template #default="{ row }">
        <el-switch
          v-model="row.active"
          @change="(val) => $emit('active-change', row, val)"
        />
      </template>
    </el-table-column>
    <el-table-column label="Actions" width="280" fixed="right">
      <template #default="{ row }">
        <el-button type="primary" size="small" @click="$emit('edit', row)">
          <el-icon><Edit /></el-icon>Edit
        </el-button>
        <el-button type="danger" size="small" @click="$emit('delete', row)">
          <el-icon><Delete /></el-icon>Delete
        </el-button>
        <el-button type="warning" size="small" @click="$emit('permissions', row)">
          <el-icon><Key /></el-icon>Permissions
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { Edit, Delete, Key } from '@element-plus/icons-vue'

defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  expandable: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'delete', 'permissions', 'active-change'])
</script>

<style scoped>
.expand-content {
  padding: 20px;
  background-color: #f5f7fa;
}

.ad-groups-section {
  margin-bottom: 16px;
}

.ad-groups-section h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.ad-groups-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ad-group-item {
  padding: 8px 12px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
}

.no-groups {
  color: #909399;
  font-style: italic;
}
</style>
