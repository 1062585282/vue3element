<template>
  <div class="permissions-management">
    <div v-if="roleId" class="role-info">
      <el-alert
        :title="`Managing permissions for Role ID: ${roleId}`"
        type="info"
        :closable="false"
        show-icon
      />
    </div>
    <PermissionsTable
      :permissions="permissions"
      @add-permission="showAddForm = true"
      @remove-permission="removePermission"
    />
    
    <!-- Add Permission Form -->
    <div v-if="showAddForm" class="add-permission-form">
      <el-divider />
      <h4>Add New Permission</h4>
      <el-form :model="selectedPermission" label-width="120px">
        <el-form-item label="Permission">
          <el-select
            v-model="selectedPermission"
            placeholder="Select permission"
            style="width: 100%"
          >
            <el-option
              v-for="perm in availablePermissions"
              :key="perm.code"
              :label="perm.name"
              :value="perm"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmAddPermission">Confirm</el-button>
          <el-button @click="cancelAddPermission">Cancel</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import PermissionsTable from './PermissionsTable.vue'

const props = defineProps({
  permissions: {
    type: Array,
    default: () => []
  },
  roleId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:permissions', 'save'])

const showAddForm = ref(false)
const selectedPermission = ref(null)

// 可用的权限列表
const availablePermissions = [
  { name: 'View Users', code: 'user:view', description: 'Can view user list' },
  { name: 'Edit Users', code: 'user:edit', description: 'Can edit user information' },
  { name: 'Delete Users', code: 'user:delete', description: 'Can delete users' },
  { name: 'View Roles', code: 'role:view', description: 'Can view role list' },
  { name: 'Edit Roles', code: 'role:edit', description: 'Can edit roles' },
  { name: 'Delete Roles', code: 'role:delete', description: 'Can delete roles' },
  { name: 'View Modules', code: 'module:view', description: 'Can view modules' },
  { name: 'Edit Modules', code: 'module:edit', description: 'Can edit modules' },
  { name: 'Delete Modules', code: 'module:delete', description: 'Can delete modules' }
]

// 删除权限
const removePermission = (index) => {
  const newPermissions = [...props.permissions]
  newPermissions.splice(index, 1)
  emit('update:permissions', newPermissions)
  ElMessage.success('Permission removed successfully!')
}

// 确认添加权限
const confirmAddPermission = () => {
  if (!selectedPermission.value) {
    ElMessage.warning('Please select a permission!')
    return
  }
  
  // 检查是否已存在
  const exists = props.permissions.some(
    p => p.code === selectedPermission.value.code
  )
  
  if (exists) {
    ElMessage.warning('Permission already exists!')
    return
  }
  
  const newPermissions = [...props.permissions, {
    name: selectedPermission.value.name,
    code: selectedPermission.value.code,
    description: selectedPermission.value.description
  }]
  
  emit('update:permissions', newPermissions)
  selectedPermission.value = null
  showAddForm.value = false
  ElMessage.success('Permission added successfully!')
}

// 取消添加权限
const cancelAddPermission = () => {
  selectedPermission.value = null
  showAddForm.value = false
}
</script>

<style scoped>
.permissions-management {
  width: 100%;
}

.role-info {
  margin-bottom: 20px;
}

.add-permission-form {
  margin-top: 20px;
}

.add-permission-form h4 {
  margin-bottom: 16px;
  color: #606266;
}
</style>
