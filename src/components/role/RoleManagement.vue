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
            <el-option label="System Role" :value="1" />
            <el-option label="Business Role" :value="2" />
          </el-select>
        </div>
        <div class="header-buttons">
          <el-button @click="loadRoles">Refresh</el-button>
          <el-button type="primary" @click="openAddRoleDialog">Add Role</el-button>
        </div>
      </div>
    </div>
    
    <el-table
      :data="roles"
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
          {{ typeMap[row.type] }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="Description" min-width="200" />
      
      <el-table-column label="Actions" width="240" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small">Edit</el-button>
          <el-button type="danger" size="small">Delete</el-button>
          <el-button type="warning" size="small" @click="openPermissionsDialog(row)">Permissions</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRoles"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- Add Role Dialog -->
    <AddRoleDialog
      v-model:visible="addRoleDialogVisible"
      @role-added="handleRoleAdded"
    />
    
    <!-- Permissions Dialog -->
    <el-dialog
      v-model="permissionsDialogVisible"
      title=""
      width="700px"
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
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import AddRoleDialog from './AddRoleDialog.vue'
import PermissionsManagement from './PermissionsManagement.vue'

// 状态变量
const roles = ref([])
const totalRoles = ref(0)
const loading = ref(false)
const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})
const searchQuery = ref('')
const selectedType = ref('')
const addRoleDialogVisible = ref(false)

// 权限管理相关
const permissionsDialogVisible = ref(false)
const currentRole = ref(null)
const permissionsList = ref([])

// 类型映射
const typeMap = {
  1: 'System Role',
  2: 'Business Role'
}

// 模拟数据
const mockRoles = ref([
  {
    id: 'ROLE_001',
    name: 'Admin',
    code: 'ADMIN',
    type: 1,
    description: 'System administrator'
  },
  {
    id: 'ROLE_002',
    name: 'Manager',
    code: 'MANAGER',
    type: 1,
    description: 'Department manager'
  },
  {
    id: 'ROLE_003',
    name: 'User',
    code: 'USER',
    type: 2,
    description: 'Regular user'
  },
  {
    id: 'ROLE_004',
    name: 'Guest',
    code: 'GUEST',
    type: 2,
    description: 'Guest user'
  },
  {
    id: 'ROLE_005',
    name: 'HR Manager',
    code: 'HR_MANAGER',
    type: 1,
    description: 'HR department manager'
  },
  {
    id: 'ROLE_006',
    name: 'Finance Manager',
    code: 'FINANCE_MANAGER',
    type: 1,
    description: 'Finance department manager'
  },
  {
    id: 'ROLE_007',
    name: 'Developer',
    code: 'DEVELOPER',
    type: 2,
    description: 'Software developer'
  },
  {
    id: 'ROLE_008',
    name: 'Tester',
    code: 'TESTER',
    type: 2,
    description: 'Software tester'
  }
])

// 加载角色数据
const loadRoles = () => {
  loading.value = true
  setTimeout(() => {
    // 先过滤数据
    let filteredData = [...mockRoles.value]
    
    // 根据搜索条件过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filteredData = filteredData.filter(role => {
        return (
          role.name.toLowerCase().includes(query) ||
          role.code.toLowerCase().includes(query)
        )
      })
    }
    
    // 根据类型过滤
    if (selectedType.value) {
      filteredData = filteredData.filter(role => {
        return role.type === selectedType.value
      })
    }
    
    // 计算总数和分页
    totalRoles.value = filteredData.length
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    roles.value = filteredData.slice(start, end)
    loading.value = false
  }, 500)
}

// 处理搜索
const handleSearch = () => {
  // 重置到第一页
  pagination.currentPage = 1
  // 重新加载数据
  loadRoles()
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadRoles()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  loadRoles()
}

// 打开添加角色对话框
const openAddRoleDialog = () => {
  // Open dialog
  addRoleDialogVisible.value = true
}

// 处理角色添加
const handleRoleAdded = (roleData) => {
  // Generate new role ID
  const newId = `ROLE_${String(mockRoles.value.length + 1).padStart(3, '0')}`
  
  // Create new role object
  const newRole = {
    id: newId,
    name: roleData.name,
    code: roleData.code,
    type: roleData.type,
    description: roleData.description
  }
  
  // Add to mock data
  mockRoles.value.unshift(newRole)
  
  // Reload roles
  loadRoles()
}

// 初始化加载
onMounted(() => {
  loadRoles()
})

// 打开权限管理对话框
const openPermissionsDialog = (role) => {
  currentRole.value = role
  // 模拟加载该角色的权限
  permissionsList.value = [
    { name: 'View Users', code: 'user:view', description: 'Can view user list' },
    { name: 'Edit Users', code: 'user:edit', description: 'Can edit user information' },
    { name: 'Delete Users', code: 'user:delete', description: 'Can delete users' }
  ]
  permissionsDialogVisible.value = true
}

// 关闭权限管理对话框
const closePermissionsDialog = () => {
  permissionsDialogVisible.value = false
  currentRole.value = null
  permissionsList.value = []
}

// 保存权限
const savePermissions = () => {
  // 这里可以添加保存到后端的逻辑
  ElMessage.success('Permissions saved successfully!')
  closePermissionsDialog()
}
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

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

</style>
