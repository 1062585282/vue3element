<template>
  <el-card shadow="false" class="role-management">
    <div class="management-header">
      <div class="header-content">
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="Search by Name or Code"
            clearable
            @input="handleSearch"
            class="search-input"
          />
          <el-select
            v-model="selectedType"
            placeholder="Filter by Type"
            clearable
            @change="handleSearch"
            class="type-select"
          >
            <el-option
              v-for="option in typeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
        <div class="header-buttons">
          <el-button @click="loadRoles">
            <el-icon><Refresh /></el-icon>Refresh
          </el-button>
          <el-button type="primary" @click="openAddRoleDialog">
            <el-icon><Plus /></el-icon>Add Role
          </el-button>
        </div>
      </div>
    </div>
    
    <el-table
      :data="paginatedRoles"
      v-loading="loading"
      stripe
      border
      style="width: 100%"
      row-key="id"
    >
      <el-table-column prop="id" label="ID" min-width="100" />
      <el-table-column prop="name" label="Name" min-width="150" />
      <el-table-column prop="code" label="Code" min-width="120" />
      <el-table-column prop="type" label="Type" min-width="120">
        <template #default="{ row }">
          <el-tag :type="getRoleTypeTag(row.type)">
            {{ typeMap[row.type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="Description" min-width="200" show-overflow-tooltip />
      
      <el-table-column label="Actions" width="280" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">
            <el-icon><Edit /></el-icon>Edit
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            <el-icon><Delete /></el-icon>Delete
          </el-button>
          <el-button type="warning" size="small" @click="openPermissionsDialog(row)">
            <el-icon><Key /></el-icon>Permissions
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredRoles.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <AddRoleDialog
      v-model:visible="addRoleDialogVisible"
      @role-added="handleRoleAdded"
    />
    
    <el-dialog
      v-model="permissionsDialogVisible"
      title=""
      width="700px"
      destroy-on-close
      @close="closePermissionsDialog"
    >
      <PermissionsManagement
        v-model:permissions="permissionsList"
      />
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closePermissionsDialog">Close</el-button>
          <el-button type="primary" @click="savePermissions">Save</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Refresh, Key } from '@element-plus/icons-vue'
import AddRoleDialog from './AddRoleDialog.vue'
import PermissionsManagement from './PermissionsManagement.vue'
import { ROLE_TYPES, TYPE_OPTIONS, TYPE_MAP } from './roleConstants.js'

const DEFAULT_PAGINATION = {
  currentPage: 1,
  pageSize: 10
}

const loading = ref(false)
const searchQuery = ref('')
const selectedType = ref('')
const pagination = reactive({ ...DEFAULT_PAGINATION })

const addRoleDialogVisible = ref(false)
const permissionsDialogVisible = ref(false)
const currentRole = ref(null)
const permissionsList = ref([])

const mockRoles = ref([
  { id: 'ROLE_001', name: 'Admin', code: 'ADMIN', type: 'System Role', description: 'System administrator with full access' },
  { id: 'ROLE_002', name: 'Manager', code: 'MANAGER', type: 'System Role', description: 'Department manager' },
  { id: 'ROLE_003', name: 'User', code: 'USER', type: 'Business Role', description: 'Regular user' },
  { id: 'ROLE_004', name: 'Guest', code: 'GUEST', type: 'Business Role', description: 'Guest user with limited access' },
  { id: 'ROLE_005', name: 'HR Manager', code: 'HR_MANAGER', type: 'System Role', description: 'HR department manager' },
  { id: 'ROLE_006', name: 'Finance Manager', code: 'FINANCE_MANAGER', type: 'System Role', description: 'Finance department manager' },
  { id: 'ROLE_007', name: 'Developer', code: 'DEVELOPER', type: 'Business Role', description: 'Software developer' },
  { id: 'ROLE_008', name: 'Tester', code: 'TESTER', type: 'Business Role', description: 'Software tester' }
])

const typeOptions = computed(() => TYPE_OPTIONS)
const typeMap = computed(() => TYPE_MAP)

const filteredRoles = computed(() => {
  let result = [...mockRoles.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(role => 
      role.name.toLowerCase().includes(query) ||
      role.code.toLowerCase().includes(query)
    )
  }
  
  if (selectedType.value) {
    result = result.filter(role => role.type === selectedType.value)
  }
  
  return result
})

const paginatedRoles = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredRoles.value.slice(start, end)
})

const loadRoles = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.currentPage = 1
  loadRoles()
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
}

const handleCurrentChange = (page) => {
  pagination.currentPage = page
}

const getRoleTypeTag = (type) => {
  return type === 'System Role' ? 'danger' : 'info'
}

const openAddRoleDialog = () => {
  addRoleDialogVisible.value = true
}

const handleRoleAdded = (roleData) => {
  const newId = `ROLE_${String(mockRoles.value.length + 1).padStart(3, '0')}`
  const newRole = {
    id: newId,
    name: roleData.name,
    code: roleData.code,
    type: roleData.type,
    description: roleData.description
  }
  
  mockRoles.value.unshift(newRole)
  ElMessage.success('Role added successfully!')
  loadRoles()
}

const handleEdit = (row) => {
  ElMessage.info(`Edit role: ${row.name}`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete role "${row.name}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    const index = mockRoles.value.findIndex(r => r.id === row.id)
    if (index > -1) {
      mockRoles.value.splice(index, 1)
      ElMessage.success('Role deleted successfully!')
      loadRoles()
    }
  } catch {
  }
}

const openPermissionsDialog = (role) => {
  currentRole.value = role
  permissionsList.value = [
    { name: 'View Users', code: 'user:view', description: 'Can view user list' },
    { name: 'Edit Users', code: 'user:edit', description: 'Can edit user information' },
    { name: 'Delete Users', code: 'user:delete', description: 'Can delete users' }
  ]
  permissionsDialogVisible.value = true
}

const closePermissionsDialog = () => {
  permissionsDialogVisible.value = false
  currentRole.value = null
  permissionsList.value = []
}

const savePermissions = () => {
  ElMessage.success('Permissions saved successfully!')
  closePermissionsDialog()
}

onMounted(() => {
  loadRoles()
})
</script>

<style scoped>
.role-management {
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

.type-select {
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
</style>
