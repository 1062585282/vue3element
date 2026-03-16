<template>
  <el-card shadow="false" class="role-management">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="System Role" name="system">
        <RoleHeader
          v-model:search="systemSearchQuery"
          @refresh="initData"
          @add="openAddRoleDialog"
        />
        <RoleTable
          :data="paginatedSystemRoles"
          :loading="loading"
          :expandable="true"
          @edit="handleEdit"
          @delete="handleDelete"
          @permissions="openPermissionsDialog"
          @active-change="handleActiveChange"
        />
        <Pagination
          v-model:current-page="systemPagination.currentPage"
          v-model:page-size="systemPagination.pageSize"
          :total="filteredSystemRoles.length"
        />
      </el-tab-pane>

      <el-tab-pane label="Business Unit Role" name="business">
        <RoleHeader
          v-model:search="businessSearchQuery"
          @refresh="initData"
          @add="openAddRoleDialog"
        />
        <RoleTable
          :data="paginatedBusinessRoles"
          :loading="loading"
          :expandable="false"
          @edit="handleEdit"
          @delete="handleDelete"
          @permissions="openPermissionsDialog"
          @active-change="handleActiveChange"
        />
        <Pagination
          v-model:current-page="businessPagination.currentPage"
          v-model:page-size="businessPagination.pageSize"
          :total="filteredBusinessRoles.length"
        />
      </el-tab-pane>
    </el-tabs>

    <AddRoleDialog
      v-model:visible="addRoleDialogVisible"
      :edit-data="editRoleData"
      @role-added="handleRoleAdded"
      @role-updated="handleRoleUpdated"
      @update:visible="(val) => { if (!val) editRoleData = null }"
    />

    <el-dialog
      v-model="permissionsDialogVisible"
      title=""
      width="700px"
      destroy-on-close
      @close="closePermissionsDialog"
    >
      <PermissionsManagement v-model:permissions="permissionsList" />
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoleManagement } from './useRoleManagement.js'
import { usePagination } from './usePagination.js'
import { usePermissions } from './usePermissions.js'
import RoleHeader from './RoleHeader.vue'
import RoleTable from './RoleTable.vue'
import Pagination from './Pagination.vue'
import AddRoleDialog from './AddRoleDialog.vue'
import PermissionsManagement from './PermissionsManagement.vue'

const activeTab = ref('system')
const systemSearchQuery = ref('')
const businessSearchQuery = ref('')
const addRoleDialogVisible = ref(false)
const editRoleData = ref(null)

const { roles, loading, addRole, updateRole, deleteRole } = useRoleManagement()
const systemPagination = usePagination()
const businessPagination = usePagination()
const { permissionsDialogVisible, permissionsList, openPermissionsDialog, closePermissionsDialog, savePermissions } = usePermissions()

const mockData = [
  { id: 'ROLE_001', name: 'Admin', code: 'ADMIN', type: 'System Role', active: true, description: 'System administrator with full access', groups: ['Domain Admins', 'Enterprise Admins', 'Schema Admins'] },
  { id: 'ROLE_002', name: 'Manager', code: 'MANAGER', type: 'System Role', active: true, description: 'Department manager', groups: ['Managers', 'Department Heads'] },
  { id: 'ROLE_003', name: 'User', code: 'USER', type: 'Business Role', active: true, description: 'Regular user' },
  { id: 'ROLE_004', name: 'Guest', code: 'GUEST', type: 'Business Role', active: false, description: 'Guest user with limited access' },
  { id: 'ROLE_005', name: 'HR Manager', code: 'HR_MANAGER', type: 'System Role', active: true, description: 'HR department manager', groups: ['HR Department', 'Managers'] },
  { id: 'ROLE_006', name: 'Finance Manager', code: 'FINANCE_MANAGER', type: 'System Role', active: true, description: 'Finance department manager', groups: ['Finance Department', 'Managers'] },
  { id: 'ROLE_007', name: 'Developer', code: 'DEVELOPER', type: 'Business Role', active: true, description: 'Software developer' },
  { id: 'ROLE_008', name: 'Tester', code: 'TESTER', type: 'Business Role', active: false, description: 'Software tester' }
]

const filterBySearch = (data, searchQuery) => {
  if (!searchQuery) return data
  const query = searchQuery.toLowerCase()
  return data.filter(role =>
    role.name.toLowerCase().includes(query) ||
    role.code.toLowerCase().includes(query)
  )
}

const filteredSystemRoles = computed(() =>
  filterBySearch(roles.value.filter(role => role.type === 'System Role'), systemSearchQuery.value)
)

const filteredBusinessRoles = computed(() =>
  filterBySearch(roles.value.filter(role => role.type === 'Business Role'), businessSearchQuery.value)
)

const paginatedSystemRoles = computed(() =>
  systemPagination.paginate(filteredSystemRoles.value)
)

const paginatedBusinessRoles = computed(() =>
  businessPagination.paginate(filteredBusinessRoles.value)
)

const initData = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  roles.value = [...mockData]
  loading.value = false
}

const openAddRoleDialog = () => {
  editRoleData.value = null
  addRoleDialogVisible.value = true
}

const handleRoleAdded = (roleData) => {
  addRole(roleData)
  systemPagination.reset()
  businessPagination.reset()
}

const handleEdit = (row) => {
  editRoleData.value = { ...row }
  addRoleDialogVisible.value = true
}

const handleRoleUpdated = (roleData) => {
  updateRole(roleData)
}

const handleDelete = async (row) => {
  const success = await deleteRole(row)
  if (success) {
    systemPagination.reset()
    businessPagination.reset()
  }
}

const handleActiveChange = (row, value) => {
  const index = roles.value.findIndex(r => r.id === row.id)
  if (index > -1) {
    roles.value[index].active = value
    ElMessage.success(`Role "${row.name}" is now ${value ? 'active' : 'inactive'}`)
  }
}

onMounted(initData)
</script>

<style scoped>
.role-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-tabs__content) {
  padding: 20px;
}
</style>
