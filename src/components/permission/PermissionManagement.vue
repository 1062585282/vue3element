<template>
  <el-card shadow="false" class="permission-management">
    <div class="management-header">
      <div class="header-content">
        <h2>Permission Management</h2>
      </div>
    </div>
    
    <div class="permission-content">
      <!-- 左侧角色列表 -->
      <RoleList 
        :roles="roles"
        :selected-role="selectedRole"
        @role-select="selectRole"
      />
      
      <!-- 右侧菜单权限树 -->
      <MenuPermissionTree 
        :selected-role="selectedRole"
        :menu-tree="menuTree"
        :checked-keys="checkedKeys"
        :categories="categories"
        :selected-category="selectedCategory"
        @category-change="handleCategoryChange"
        @save-permissions="savePermissions"
        @check-change="handleCheckChange"
      />
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { DEFAULT_MENUS } from '../../constants/mockData.js'
import RoleList from './RoleList.vue'
import MenuPermissionTree from './MenuPermissionTree.vue'

// 响应式数据
const roles = ref([])
const selectedRole = ref(null)
const categories = ref([
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'unit', label: 'Function Unit' },
  { value: 'system', label: 'System' },
  { value: 'settings', label: 'Settings' },
  { value: 'content', label: 'Content' },
  { value: 'reports', label: 'Reports' }
])
const selectedCategory = ref(null)
const menuTree = ref([])
const checkedKeys = ref([])

// 加载角色数据
const loadRoles = () => {
  // Mock role data
  roles.value = [
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
}

// 加载菜单树
const loadMenuTree = () => {
  // 使用与Menu Management相同的数据源
  // 转换菜单数据结构以适应权限树
  const transformMenus = (menus) => {
    return menus.map(menu => {
      const transformedMenu = {
        id: menu.id,
        label: menu.text || menu.name,
        icon: menu.icon,
        category: menu.module
      }
      
      if (menu.children && menu.children.length > 0) {
        transformedMenu.children = transformMenus(menu.children)
      }
      
      return transformedMenu
    })
  }
  
  let allMenus = transformMenus(DEFAULT_MENUS)
  
  // Filter menus by selected category
  if (selectedCategory.value) {
    // 筛选包含指定category的菜单及其子菜单
    const filterByCategory = (menus) => {
      return menus.filter(menu => {
        if (menu.category === selectedCategory.value) {
          return true
        }
        if (menu.children && menu.children.length > 0) {
          const filteredChildren = filterByCategory(menu.children)
          if (filteredChildren.length > 0) {
            menu.children = filteredChildren
            return true
          }
        }
        return false
      })
    }
    
    menuTree.value = filterByCategory(allMenus)
  } else {
    menuTree.value = allMenus
  }
}

// 处理分类变更
const handleCategoryChange = (value) => {
  selectedCategory.value = value
  // Reload menu tree when category changes
  loadMenuTree()
  // If a role is selected, reload its permissions
  if (selectedRole.value) {
    loadRolePermissions(selectedRole.value.id)
  }
}

// 选择角色
const selectRole = (role) => {
  selectedRole.value = role
  handleRoleChange(role)
}

// 处理角色变更
const handleRoleChange = (role) => {
  if (role) {
    // Load existing permissions for the selected role
    loadRolePermissions(role.id)
  } else {
    checkedKeys.value = []
  }
}

// 加载角色权限
const loadRolePermissions = (roleId) => {
  // Mock permission data with new menu IDs
  const mockPermissions = {
    'ROLE_001': ['menu_001', 'menu_002', 'menu_003', 'menu_004', 'menu_005', 'menu_006', 'menu_007', 'menu_008', 'menu_009', 'menu_010', 'menu_011', 'menu_012', 'menu_013', 'menu_014', 'menu_015', 'menu_016', 'menu_017', 'menu_018', 'menu_019', 'menu_020', 'menu_021', 'menu_022', 'menu_023', 'menu_024', 'menu_025', 'menu_026', 'menu_027', 'menu_028'],
    'ROLE_002': ['menu_001', 'menu_002', 'menu_003', 'menu_007', 'menu_008', 'menu_009', 'menu_010', 'menu_011', 'menu_018', 'menu_019', 'menu_020', 'menu_021', 'menu_022', 'menu_023', 'menu_024', 'menu_025', 'menu_026', 'menu_027', 'menu_028'],
    'ROLE_003': ['menu_001', 'menu_002', 'menu_003', 'menu_010', 'menu_011', 'menu_018', 'menu_019', 'menu_026', 'menu_027', 'menu_028'],
    'ROLE_004': ['menu_001', 'menu_002', 'menu_018', 'menu_019']
  }
  
  checkedKeys.value = mockPermissions[roleId] || []
}

// 处理勾选变更
const handleCheckChange = (data, checked, indeterminate) => {
  // Handle check change event
  console.log('Check change:', data, checked, indeterminate)
}

// 保存权限
const savePermissions = () => {
  if (!selectedRole.value) return
  
  // Save permissions logic
  console.log('Saving permissions for role:', selectedRole.value.name)
  console.log('Selected menu IDs:', checkedKeys.value)
  
  // Mock save success
  ElMessage.success('Permissions saved successfully!')
}

// 生命周期
onMounted(() => {
  loadRoles()
  loadMenuTree()
})
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

.permission-content {
  display: flex;
  gap: 20px;
  flex: 1;
}
</style>