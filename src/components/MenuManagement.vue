<template>
  <div class="menu-management">
    <el-card class="content-card">
      <div class="menu-container">
        <MenuTree 
          :menus="menus" 
          :current-menu="currentMenu"
          @refresh="loadMenus"
          @add="handleAdd"
          @delete="handleDelete"
          @node-click="handleNodeClick"
        />
        <MenuForm 
          :current-menu="currentMenu"
          @save="handleSave"
          @clear="handleClear"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MenuTree from './MenuTree.vue'
import MenuForm from './MenuForm.vue'
import { get, post } from '../utils/request.js'

const currentMenu = ref(null)
const menus = ref([])

const DEFAULT_MENUS = [
  {
    id: 'menu_001',
    parent_id: null,
    name: 'Dashboard',
    module: 'dashboard',
    text: 'Dashboard Overview',
    link: '/dashboard',
    active: true,
    seq: 1,
    icon: 'Odometer',
    children: [
      {
        id: 'menu_002',
        parent_id: 'menu_001',
        name: 'Overview',
        module: 'dashboard',
        text: 'Dashboard Overview',
        link: '/dashboard/overview',
        active: true,
        seq: 1,
        icon: 'DataLine'
      },
      {
        id: 'menu_003',
        parent_id: 'menu_001',
        name: 'Statistics',
        module: 'dashboard',
        text: 'Dashboard Statistics',
        link: '/dashboard/statistics',
        active: true,
        seq: 2,
        icon: 'TrendCharts'
      }
    ]
  },
  {
    id: 'menu_004',
    parent_id: null,
    name: 'System',
    module: 'system',
    text: 'System Management',
    link: '/system',
    active: true,
    seq: 2,
    icon: 'Setting',
    children: [
      {
        id: 'menu_005',
        parent_id: 'menu_004',
        name: 'User Management',
        module: 'system',
        text: 'User Management',
        link: '/system/users',
        active: true,
        seq: 1,
        icon: 'User'
      },
      {
        id: 'menu_006',
        parent_id: 'menu_004',
        name: 'Role Management',
        module: 'system',
        text: 'Role Management',
        link: '/system/roles',
        active: true,
        seq: 2,
        icon: 'UserFilled'
      }
    ]
  },
  {
    id: 'menu_007',
    parent_id: null,
    name: 'Settings',
    module: 'settings',
    text: 'Settings',
    link: '/settings',
    active: true,
    seq: 3,
    icon: 'Tools',
    children: [
      {
        id: 'menu_008',
        parent_id: 'menu_007',
        name: 'General',
        module: 'settings',
        text: 'General Settings',
        link: '/settings/general',
        active: true,
        seq: 1,
        icon: 'Operation'
      },
      {
        id: 'menu_009',
        parent_id: 'menu_007',
        name: 'Security',
        module: 'settings',
        text: 'Security Settings',
        link: '/settings/security',
        active: true,
        seq: 2,
        icon: 'Lock'
      }
    ]
  }
]

const loadMenus = async () => {
  try {
    const data = await get('/menus')
    menus.value = data || DEFAULT_MENUS
    saveMenus()
  } catch (error) {
    console.error('Failed to load menus:', error)
    menus.value = DEFAULT_MENUS
    saveMenus()
  }
}

const saveMenus = () => {
  localStorage.setItem('menus', JSON.stringify(menus.value))
}

const findAndDelete = (items, menuId) => {
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].id === menuId) {
      items.splice(i, 1)
      return true
    }
    if (items[i].children && findAndDelete(items[i].children, menuId)) {
      return true
    }
  }
  return false
}

const checkMenuChildren = (menuId) => {
  const check = (items) => {
    for (const item of items) {
      if (item.id === menuId && item.children && item.children.length > 0) {
        return true
      }
      if (item.children && check(item.children)) {
        return true
      }
    }
    return false
  }
  return check(menus.value)
}

const deleteMenu = (menuId) => {
  findAndDelete(menus.value, menuId)
}

const addMenu = (formData) => {
  const newMenu = {
    ...formData,
    id: 'menu_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    children: []
  }

  if (formData.parent_id) {
    addToParent(menus.value, formData.parent_id, newMenu)
  } else {
    menus.value.push(newMenu)
  }
}

const addToParent = (items, parentId, newMenu) => {
  for (const item of items) {
    if (item.id === parentId) {
      if (!item.children) {
        item.children = []
      }
      item.children.push(newMenu)
      return true
    }
    if (item.children && addToParent(item.children, parentId, newMenu)) {
      return true
    }
  }
  return false
}

const updateMenu = (formData) => {
  const update = (items) => {
    for (const item of items) {
      if (item.id === formData.id) {
        Object.assign(item, formData)
        return true
      }
      if (item.children && update(item.children)) {
        return true
      }
    }
    return false
  }
  update(menus.value)
}

const handleRefresh = () => {
  loadMenus()
}

const handleAdd = () => {
  currentMenu.value = {
    id: '',
    parent_id: 'root',
    name: '',
    module: '',
    text: '',
    link: '',
    active: true,
    seq: 1,
    icon: ''
  }
}

const handleDelete = () => {
  if (!currentMenu.value) return

  const hasChildren = checkMenuChildren(currentMenu.value.id)
  if (hasChildren) {
    ElMessage.warning('Cannot delete menu with children. Please delete children first.')
    return
  }

  ElMessageBox.confirm(
    `Are you sure you want to delete menu "${currentMenu.value.name}"?`,
    'Delete Confirmation',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    deleteMenu(currentMenu.value.id)
    saveMenus()
    currentMenu.value = null
    ElMessage.success('Deleted successfully')
  }).catch(() => {
    ElMessage.info('Deletion cancelled')
  })
}

const handleNodeClick = (data) => {
  currentMenu.value = data
}

const handleSave = (formData) => {
  if (!formData.name) {
    ElMessage.warning('Please enter menu name')
    return
  }

  if (formData.id) {
    updateMenu(formData)
    ElMessage.success('Saved successfully')
  } else {
    addMenu(formData)
    ElMessage.success('Added successfully')
  }
  saveMenus()
  currentMenu.value = null
}

const handleClear = () => {
  currentMenu.value = null
}

onMounted(() => {
  loadMenus()
})
</script>

<style scoped>
.menu-management {
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.content-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-card__body) {
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.menu-container {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}
</style>
