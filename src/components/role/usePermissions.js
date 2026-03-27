import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const DEFAULT_PERMISSIONS = [
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

export function usePermissions() {
  const permissionsDialogVisible = ref(false)
  const permissionsList = ref([])
  const currentRoleId = ref('')

  const openPermissionsDialog = (row) => {
    const existingPermissions = row.permissions || []
    permissionsList.value = existingPermissions.length > 0 
      ? [...existingPermissions]
      : [...DEFAULT_PERMISSIONS]
    currentRoleId.value = row.id
    permissionsDialogVisible.value = true
  }

  const closePermissionsDialog = () => {
    permissionsDialogVisible.value = false
    permissionsList.value = []
    currentRoleId.value = ''
  }

  const savePermissions = () => {
    ElMessage.success(`Permissions saved successfully for role ${currentRoleId.value}!`)
    closePermissionsDialog()
  }

  return {
    permissionsDialogVisible,
    permissionsList,
    currentRoleId,
    openPermissionsDialog,
    closePermissionsDialog,
    savePermissions
  }
}
