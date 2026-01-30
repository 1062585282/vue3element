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
            <el-option label="bund BU" :value="1" />
            <el-option label="unbund BU" :value="2" />
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
      
      <el-table-column label="Actions" width="160" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small">Edit</el-button>
          <el-button type="danger" size="small">Delete</el-button>
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
    <el-dialog
      v-model="addRoleDialogVisible"
      title="Add Role"
      width="500px"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRoleFormRef"
        label-width="100px"
        class="add-role-form"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="addRoleForm.name" placeholder="Enter role name" />
        </el-form-item>
        <el-form-item label="Code" prop="code">
          <el-input v-model="addRoleForm.code" placeholder="Enter role code" />
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select
            v-model="addRoleForm.type"
            placeholder="Select role type"
          >
            <el-option label="bund BU" :value="1" />
            <el-option label="unbund BU" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="addRoleForm.description"
            placeholder="Enter role description"
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveRole">Save</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'

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
const addRoleFormRef = ref(null)

// 表单数据
const addRoleForm = reactive({
  name: '',
  code: '',
  type: '',
  description: ''
})

// 表单验证规则
const addRoleRules = reactive({
  name: [
    { required: true, message: 'Please enter role name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be between 2 and 50', trigger: 'blur' }
  ],
  code: [
    { required: true, message: 'Please enter role code', trigger: 'blur' },
    { min: 2, max: 20, message: 'Length should be between 2 and 20', trigger: 'blur' }
  ],
  type: [
    { required: true, message: 'Please select role type', trigger: 'change' }
  ]
})

// 类型映射
const typeMap = {
  1: 'bund BU',
  2: 'unbund BU'
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
  // Reset form
  addRoleForm.name = ''
  addRoleForm.code = ''
  addRoleForm.type = ''
  addRoleForm.description = ''
  // Open dialog
  addRoleDialogVisible.value = true
}

// 保存角色
const saveRole = () => {
  if (!addRoleFormRef.value) return
  
  addRoleFormRef.value.validate((valid) => {
    if (valid) {
      // Generate new role ID
      const newId = `ROLE_${String(mockRoles.value.length + 1).padStart(3, '0')}`
      
      // Create new role object
      const newRole = {
        id: newId,
        name: addRoleForm.name,
        code: addRoleForm.code,
        type: addRoleForm.type,
        description: addRoleForm.description
      }
      
      // Add to mock data
      mockRoles.value.unshift(newRole)
      
      // Close dialog
      addRoleDialogVisible.value = false
      
      // Reload roles
      loadRoles()
      
      // Show success message
      ElMessage.success('Role added successfully!')
    } else {
      return false
    }
  })
}

// 初始化加载
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

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>