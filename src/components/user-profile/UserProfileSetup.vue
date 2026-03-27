<template>
  <el-card shadow="false" class="request-management">
    <div class="management-header">
      <div class="header-content">
        <div v-if="!showAddForm" class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="Search by Requester or ID"
            clearable
            @input="handleSearch"
            class="search-input"
          />
          <el-select
            v-model="selectedStatus"
            placeholder="Filter by Status"
            clearable
            @change="handleSearch"
            class="status-select"
          >
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
        <div class="header-buttons">
          <el-button v-if="!showAddForm" @click="loadRequests">
            <el-icon><Refresh /></el-icon>Refresh
          </el-button>
          <el-button v-if="!showAddForm" type="primary" @click="openAddForm">
            <el-icon><Plus /></el-icon>Add Request
          </el-button>
        </div>
      </div>
    </div>
    
    <RequestTable
      v-if="!showAddForm"
      :data="paginatedRequests"
      :loading="loading"
      @edit="handleEdit"
      @approve="handleApprove"
      @reject="handleReject"
    />
    
    <div v-if="!showAddForm" class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredRequests.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <RequestForm
      v-else
      :form-data="addForm"
      :business-unit-options="businessUnitOptions"
      :available-roles="availableRoles"
      @cancel="cancelAddForm"
      @submit="handleFormSubmit"
    />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { useUserProfileSetup } from './useUserProfileSetup.js'
import RequestTable from './RequestTable.vue'
import RequestForm from './RequestForm.vue'

const {
  loading,
  searchQuery,
  selectedStatus,
  pagination,
  showAddForm,
  addForm,
  filteredRequests,
  paginatedRequests,
  availableRoles,
  businessUnitOptions,
  statusOptions,
  loadRequests,
  handleSearch,
  handleSizeChange,
  handleCurrentChange,
  openAddForm,
  cancelAddForm,
  submitAddForm,
  handleEdit,
  handleApprove,
  handleReject
} = useUserProfileSetup()

const handleFormSubmit = (formData, action) => {
  // Create a form ref for validation
  const formRef = { validate: async () => true } // Mock form ref for validation
  submitAddForm(formRef)
}

onMounted(loadRequests)
</script>

<style scoped>
.request-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

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

.status-select {
  width: 150px;
}

.header-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.header-buttons .el-icon {
  margin-right: 4px;
}

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-button--small .el-icon) {
  margin-right: 2px;
}

.request-details {
  padding: 20px;
  background-color: #f5f7fa;
}

.form-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.form-col {
  flex: 1;
  min-width: 300px;
}

.view-request-form {
  margin-top: 0;
}

.add-form-section {
  margin-top: 20px;
}

.add-form-card {
  margin-top: 20px;
}

.request-form {
  margin-top: 20px;
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
</style>
