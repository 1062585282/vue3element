<template>
  <el-table
    :data="data"
    v-loading="loading"
    stripe
    border
    style="width: 100%"
    row-key="id"
  >
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
  }
})

defineEmits(['edit', 'delete', 'permissions', 'active-change'])
</script>
