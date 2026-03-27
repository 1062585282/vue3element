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
    
    <el-table
      v-if="!showAddForm"
      :data="paginatedRequests"
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
            @click="handleEdit(row)"
          >
            <el-icon><Edit /></el-icon>Edit
          </el-button>
          <el-button 
            type="success" 
            size="small" 
            :disabled="row.status !== 'Pending'"
            @click="handleApprove(row)"
          >
            Approve
          </el-button>
          <el-button 
            type="danger" 
            size="small" 
            :disabled="row.status !== 'Pending'"
            @click="handleReject(row)"
          >
            Reject
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
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
    
    <div v-else class="add-form-section">
      <el-card shadow="false" class="add-form-card">
        <el-form
          ref="addFormRef"
          :model="addForm"
          :rules="rules"
          label-width="120px"
          class="request-form"
        >
          <el-form-item label="Business Unit">
            <el-select
              v-model="addForm.selectedBusinessUnit"
              placeholder="Select business unit"
              style="width: 100%"
              @change="handleBusinessUnitChange"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="option in businessUnitOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Roles">
            <el-select
              v-model="addForm.selectedRoles"
              multiple
              placeholder="Select roles"
              style="width: 100%"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="role in availableRoles"
                :key="role"
                :label="role"
                :value="role"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="cancelAddForm">Cancel</el-button>
            <el-button type="success" @click="submitAddForm(addFormRef)">Save</el-button>
            <el-button type="primary" @click="submitAddForm(addFormRef)" style="float: right;">Submit</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Edit, Refresh } from '@element-plus/icons-vue'
import { useUserProfileSetup } from './useUserProfileSetup.js'

const addFormRef = ref(null)
const rules = {
  requester: [
    { required: true, message: 'Please enter requester name', trigger: 'blur' }
  ],
  status: [
    { required: true, message: 'Please select status', trigger: 'change' }
  ]
}

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
  getStatusTag,
  formatDate,
  openAddForm,
  cancelAddForm,
  handleBusinessUnitChange,
  submitAddForm,
  handleEdit,
  handleApprove,
  handleReject
} = useUserProfileSetup()

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
