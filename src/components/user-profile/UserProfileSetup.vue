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
            <el-button type="success" @click="submitAddForm">Save</el-button>
            <el-button type="primary" @click="submitAddForm" style="float: right;">Submit</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Edit, Refresh } from '@element-plus/icons-vue'

const loading = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('')
const pagination = ref({
  currentPage: 1,
  pageSize: 10
})

const showAddForm = ref(false)
const businessUnitOptions = [
  { value: 'Sales', label: 'Sales', roles: ['Sales Manager', 'Sales Representative', 'Sales Associate'] },
  { value: 'Marketing', label: 'Marketing', roles: ['Marketing Manager', 'Marketing Specialist', 'Content Creator'] },
  { value: 'Finance', label: 'Finance', roles: ['Finance Manager', 'Accountant', 'Financial Analyst'] },
  { value: 'Human Resources', label: 'Human Resources', roles: ['HR Manager', 'HR Specialist', 'Recruiter'] },
  { value: 'IT', label: 'IT', roles: ['IT Manager', 'Developer', 'System Administrator', 'Help Desk'] },
  { value: 'Operations', label: 'Operations', roles: ['Operations Manager', 'Operations Coordinator', 'Logistics Specialist'] },
  { value: 'Customer Service', label: 'Customer Service', roles: ['CS Manager', 'CS Representative', 'Support Specialist'] },
  { value: 'Product Management', label: 'Product Management', roles: ['Product Manager', 'Product Specialist', 'UX Designer'] }
]

const addForm = ref({
  id: '',
  requester: '',
  requestDate: new Date().toISOString(),
  status: 'Draft',
  approverRejecter: '',
  approverRejecterDate: null,
  selectedBusinessUnit: '',
  selectedRoles: []
})
const addFormRef = ref(null)
const rules = {
  requester: [
    { required: true, message: 'Please enter requester name', trigger: 'blur' }
  ],
  status: [
    { required: true, message: 'Please select status', trigger: 'change' }
  ]
}

const mockRequests = ref([
  { 
    id: 'REQ_001', 
    requester: 'John Doe', 
    requestDate: '2026-03-20T10:00:00', 
    status: 'Approved', 
    approverRejecter: 'Alice Smith', 
    approverRejecterDate: '2026-03-21T14:30:00',
    businessUnit: 'Sales',
    roles: ['Sales Manager', 'Sales Representative']
  },
  { 
    id: 'REQ_002', 
    requester: 'Jane Smith', 
    requestDate: '2026-03-21T09:15:00', 
    status: 'Pending', 
    approverRejecter: null, 
    approverRejecterDate: null,
    businessUnit: 'Marketing',
    roles: ['Marketing Manager', 'Content Creator']
  },
  { 
    id: 'REQ_003', 
    requester: 'Bob Johnson', 
    requestDate: '2026-03-22T11:30:00', 
    status: 'Rejected', 
    approverRejecter: 'Alice Smith', 
    approverRejecterDate: '2026-03-23T09:45:00',
    businessUnit: 'Finance',
    roles: ['Finance Manager']
  },
  { 
    id: 'REQ_004', 
    requester: 'Sarah Wilson', 
    requestDate: '2026-03-23T14:00:00', 
    status: 'Approved', 
    approverRejecter: 'Michael Brown', 
    approverRejecterDate: '2026-03-24T10:15:00',
    businessUnit: 'IT',
    roles: ['IT Manager', 'Developer']
  },
  { 
    id: 'REQ_005', 
    requester: 'David Lee', 
    requestDate: '2026-03-24T10:30:00', 
    status: 'Pending', 
    approverRejecter: null, 
    approverRejecterDate: null,
    businessUnit: 'Human Resources',
    roles: ['HR Specialist']
  },
  { 
    id: 'REQ_006', 
    requester: 'Emma Davis', 
    requestDate: '2026-03-25T08:45:00', 
    status: 'Approved', 
    approverRejecter: 'Michael Brown', 
    approverRejecterDate: '2026-03-25T11:00:00',
    businessUnit: 'Operations',
    roles: ['Operations Manager', 'Logistics Specialist']
  },
  { 
    id: 'REQ_007', 
    requester: 'Tom Wilson', 
    requestDate: '2026-03-26T10:00:00', 
    status: 'Draft', 
    approverRejecter: null, 
    approverRejecterDate: null,
    businessUnit: 'Customer Service',
    roles: ['CS Representative']
  },
  { 
    id: 'REQ_008', 
    requester: 'Lisa Chen', 
    requestDate: '2026-03-26T11:30:00', 
    status: 'Draft', 
    approverRejecter: null, 
    approverRejecterDate: null,
    businessUnit: 'Product Management',
    roles: ['Product Manager', 'UX Designer']
  }
])

const statusOptions = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' }
]

const filteredRequests = computed(() => {
  let result = [...mockRequests.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(req => 
      req.requester.toLowerCase().includes(query) ||
      req.id.toLowerCase().includes(query)
    )
  }
  
  if (selectedStatus.value) {
    result = result.filter(req => req.status === selectedStatus.value)
  }
  
  return result
})

const paginatedRequests = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredRequests.value.slice(start, end)
})

const loadRequests = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.value.currentPage = 1
  loadRequests()
}

const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  pagination.value.currentPage = 1
}

const handleCurrentChange = (page) => {
  pagination.value.currentPage = page
}

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

const openAddForm = () => {
  showAddForm.value = true
  // Reset form
  addForm.value = {
    id: '',
    requester: 'Current User',
    requestDate: new Date().toISOString(),
    status: 'Draft',
    approverRejecter: '',
    approverRejecterDate: null,
    selectedBusinessUnit: '',
    selectedRoles: []
  }
}

const cancelAddForm = () => {
  showAddForm.value = false
}

const availableRoles = computed(() => {
  if (!addForm.value.selectedBusinessUnit) {
    return []
  }
  const businessUnitOption = businessUnitOptions.find(option => option.value === addForm.value.selectedBusinessUnit)
  return businessUnitOption ? businessUnitOption.roles : []
})

const handleBusinessUnitChange = () => {
  // Reset roles when business unit changes
  addForm.value.selectedRoles = []
}

const submitAddForm = async () => {
  if (!addFormRef.value) return
  
  try {
    await addFormRef.value.validate()
    
    // Create request object with new data structure
    const requestData = {
      ...addForm.value,
      businessUnit: addForm.value.selectedBusinessUnit,
      roles: addForm.value.selectedRoles
    }
    
    // Remove unnecessary fields
    delete requestData.selectedBusinessUnit
    delete requestData.selectedRoles
    delete requestData.permissions
    
    const index = mockRequests.value.findIndex(r => r.id === addForm.value.id)
    if (index > -1) {
      // Edit existing request
      mockRequests.value[index] = requestData
      ElMessage.success('Request updated successfully!')
    } else {
      // Generate a new ID
      const timestamp = Date.now()
      requestData.id = `REQ_${String(timestamp).slice(-6).padStart(6, '0')}`
      
      // Add new request
      mockRequests.value.push(requestData)
      ElMessage.success('Request added successfully!')
    }
    
    // Reset form and go back to list
    showAddForm.value = false
    loadRequests()
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

const handleEdit = (row) => {
  if (row.status !== 'Draft') {
    ElMessage.warning('Only draft requests can be edited')
    return
  }
  showAddForm.value = true
  addForm.value = {
    ...row,
    selectedBusinessUnit: row.businessUnit || '',
    selectedRoles: row.roles || []
  }
}



const handleApprove = (row) => {
  const index = mockRequests.value.findIndex(r => r.id === row.id)
  if (index > -1) {
    mockRequests.value[index] = {
      ...row,
      status: 'Approved',
      approverRejecter: 'Current User',
      approverRejecterDate: new Date().toISOString()
    }
    ElMessage.success('Request approved successfully!')
    loadRequests()
  }
}

const handleReject = (row) => {
  const index = mockRequests.value.findIndex(r => r.id === row.id)
  if (index > -1) {
    mockRequests.value[index] = {
      ...row,
      status: 'Rejected',
      approverRejecter: 'Current User',
      approverRejecterDate: new Date().toISOString()
    }
    ElMessage.success('Request rejected successfully!')
    loadRequests()
  }
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
