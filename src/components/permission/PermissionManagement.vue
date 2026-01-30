<template>
  <el-card shadow="false" class="permission-management">
    <div class="management-header">
      <div class="header-content">
        <h2>Permission Management</h2>
      </div>
    </div>
    
    <!-- 角色选择 -->
    <div class="role-selection">
      <el-select
        v-model="selectedRole"
        placeholder="Select a role"
        clearable
        @change="handleRoleChange"
        class="role-select"
      >
        <el-option
          v-for="role in roles"
          :key="role.id"
          :label="role.name"
          :value="role"
        />
      </el-select>
      <el-button
        v-if="selectedRole"
        type="primary"
        @click="savePermissions"
      >
        Save Permissions
      </el-button>
    </div>
    
    <!-- 菜单权限树 -->
    <div class="permission-tree-section">
      <h3>Menu Permissions</h3>
      <el-tree
        v-if="selectedRole"
        v-model="checkedKeys"
        :data="menuTree"
        node-key="id"
        show-checkbox
        check-strictly
        :default-expand-all="true"
        @check-change="handleCheckChange"
        class="permission-tree"
      >
        <template #default="{ node, data }">
          <span class="tree-node-content">
            <i :class="data.icon || 'el-icon-folder'" style="margin-right: 8px;"></i>
            {{ data.label }}
          </span>
        </template>
      </el-tree>
      <div v-else class="no-role-selected">
        Please select a role to configure permissions
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'PermissionManagement',
  data() {
    return {
      roles: [],
      selectedRole: null,
      menuTree: [],
      checkedKeys: [],
      permissions: {}
    }
  },
  mounted() {
    this.loadRoles()
    this.loadMenuTree()
  },
  methods: {
    loadRoles() {
      // Mock role data
      this.roles = [
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
        }
      ]
    },
    loadMenuTree() {
      // Mock menu tree data
      this.menuTree = [
        {
          id: 'MENU_001',
          label: 'Module Management',
          icon: 'el-icon-grid'
        },
        {
          id: 'MENU_002',
          label: 'Menu Management',
          icon: 'el-icon-menu'
        },
        {
          id: 'MENU_003',
          label: 'Role Management',
          icon: 'el-icon-user-filled'
        },
        {
          id: 'MENU_004',
          label: 'Permission Management',
          icon: 'el-icon-lock'
        },
        {
          id: 'MENU_005',
          label: 'Form Design',
          icon: 'el-icon-edit'
        },
        {
          id: 'MENU_006',
          label: 'Staff Management',
          icon: 'el-icon-user'
        }
      ]
    },
    handleRoleChange(role) {
      if (role) {
        // Load existing permissions for the selected role
        this.loadRolePermissions(role.id)
      } else {
        this.checkedKeys = []
      }
    },
    loadRolePermissions(roleId) {
      // Mock permission data
      const mockPermissions = {
        'ROLE_001': ['MENU_001', 'MENU_002', 'MENU_003', 'MENU_004', 'MENU_005', 'MENU_006'],
        'ROLE_002': ['MENU_001', 'MENU_002', 'MENU_005', 'MENU_006'],
        'ROLE_003': ['MENU_005', 'MENU_006'],
        'ROLE_004': ['MENU_006']
      }
      
      this.checkedKeys = mockPermissions[roleId] || []
    },
    handleCheckChange(data, checked, indeterminate) {
      // Handle check change event
      console.log('Check change:', data, checked, indeterminate)
    },
    savePermissions() {
      if (!this.selectedRole) return
      
      // Save permissions logic
      console.log('Saving permissions for role:', this.selectedRole.name)
      console.log('Selected menu IDs:', this.checkedKeys)
      
      // Mock save success
      this.$message.success('Permissions saved successfully!')
    }
  }
}
</script>

<style scoped>
.permission-management {
  width: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.management-header {
  margin-bottom: 20px;
}

.header-content h2 {
  margin: 0;
  color: #333;
}

.role-selection {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.role-select {
  width: 300px;
}

.permission-tree-section {
  flex: 1;
}

.permission-tree-section h3 {
  margin-bottom: 16px;
  color: #666;
}

.permission-tree {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  max-height: 500px;
  overflow-y: auto;
}

.tree-node-content {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.no-role-selected {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  background-color: #f5f7fa;
  border-radius: 8px;
  border: 1px dashed #dcdfe6;
}

/* 滚动条样式 */
.permission-tree::-webkit-scrollbar {
  width: 8px;
}

.permission-tree::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 4px;
}

.permission-tree::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 4px;
}

.permission-tree {
  scrollbar-width: 8px;
  scrollbar-color: #dcdfe6 #f5f7fa;
}
</style>