<template>
  <el-table
    :data="data"
    v-loading="loading"
    stripe
    border
    style="width: 100%"
    row-key="id"
    type="expand"
  >
    <el-table-column type="expand" width="50">
      <template #default="{ row }">
        <div class="request-details">
          <div class="business-unit-table-section">
            <el-table
              :data="[{ businessUnit: row.businessUnit, roles: row.roles }]"
              stripe
              border
              style="width: 100%"
            >
              <el-table-column prop="businessUnit" label="Business Unit" min-width="200" />
              <el-table-column label="Roles" min-width="300">
                <template #default="{ row: buRow }">
                  <div class="roles-list">
                    <el-tag
                      v-for="role in buRow.roles"
                      :key="role"
                      size="small"
                      style="margin-right: 8px; margin-bottom: 8px"
                    >
                      {{ role }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="id" label="ID" min-width="100" />
    <el-table-column prop="requester" label="Requester" min-width="150" />
    <el-table-column prop="requestDate" label="Request Date" min-width="180">
      <template #default="{ row }">
        {{ formatDate(row.requestDate) }}
      </template>
    </el-table-column>
    <el-table-column prop="status" label="Status" min-width="120">
      <template #default="{ row }">
        <el-tag :type="getStatusTag(row.status)">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="approverRejecter" label="Approver/Rejecter" min-width="150" />
    <el-table-column prop="approverRejecterDate" label="Approver/Rejecter Date" min-width="180">
      <template #default="{ row }">
        {{ row.approverRejecterDate ? formatDate(row.approverRejecterDate) : '-' }}
      </template>
    </el-table-column>
    <el-table-column label="Actions" width="240" fixed="right">
      <template #default="{ row }">
        <el-button 
          type="primary" 
          size="small" 
          :disabled="row.status !== 'Draft'"
          @click="$emit('edit', row)"
        >
          <el-icon><Edit /></el-icon>Edit
        </el-button>
        <el-button 
          type="success" 
          size="small" 
          :disabled="row.status !== 'Pending'"
          @click="$emit('approve', row)"
        >
          Approve
        </el-button>
        <el-button 
          type="danger" 
          size="small" 
          :disabled="row.status !== 'Pending'"
          @click="$emit('reject', row)"
        >
          Reject
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { Edit } from '@element-plus/icons-vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'approve', 'reject'])

const getStatusTag = (status) => {
  switch (status) {
    case 'Approved': return 'success'
    case 'Rejected': return 'danger'
    case 'Pending': return 'warning'
    default: return 'info'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.request-details {
  padding: 20px;
  background-color: #f5f7fa;
}

.business-unit-table-section {
  margin-top: 20px;
  padding-top: 0;
}

.roles-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

:deep(.el-button--small .el-icon) {
  margin-right: 2px;
}
</style>
