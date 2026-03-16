import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export function useRoleManagement() {
  const roles = ref([])
  const loading = ref(false)

  const addRole = (roleData) => {
    const newId = `ROLE_${String(roles.value.length + 1).padStart(3, '0')}`
    const newRole = {
      id: newId,
      ...roleData,
      groups: roleData.groups || []
    }
    roles.value.unshift(newRole)
    ElMessage.success('Role added successfully!')
    return newRole
  }

  const updateRole = (roleData) => {
    const index = roles.value.findIndex(r => r.id === roleData.id)
    if (index > -1) {
      roles.value[index] = {
        ...roles.value[index],
        ...roleData,
        groups: roleData.groups || []
      }
      ElMessage.success('Role updated successfully!')
      return true
    }
    return false
  }

  const deleteRole = async (role) => {
    try {
      await ElMessageBox.confirm(
        `Are you sure you want to delete role "${role.name}"?`,
        'Confirm Delete',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )

      const index = roles.value.findIndex(r => r.id === role.id)
      if (index > -1) {
        roles.value.splice(index, 1)
        ElMessage.success('Role deleted successfully!')
        return true
      }
    } catch {
      return false
    }
  }

  return {
    roles,
    loading,
    addRole,
    updateRole,
    deleteRole
  }
}
