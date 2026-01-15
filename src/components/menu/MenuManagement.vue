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
import { get, post } from '../../utils/request.js'
import { DEFAULT_MENUS } from '../../constants/mockData.js'

const currentMenu = ref(null)
const menus = ref([])

const loadMenus = async () => {
  try {
    const data = await get('/menus')
    if (data && data.length > 0) {
      menus.value = data
    } else {
      console.log('No data from API, using default menus')
      menus.value = DEFAULT_MENUS
    }
  } catch (error) {
    console.log('API call failed, using default menus:', error)
    menus.value = DEFAULT_MENUS
  }
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

const deleteMenu = async (menuId) => {
  try {
    await post(`/menus/${menuId}/delete`)
    findAndDelete(menus.value, menuId)
  } catch (error) {
    console.error('Failed to delete menu:', error)
    ElMessage.error('Failed to delete menu')
  }
}

const addMenu = async (formData) => {
  try {
    const newMenu = await post('/menus', formData)
    if (formData.parent_id) {
      addToParent(menus.value, formData.parent_id, newMenu)
    } else {
      menus.value.push(newMenu)
    }
  } catch (error) {
    console.error('Failed to add menu:', error)
    ElMessage.error('Failed to add menu')
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

const updateMenu = async (formData) => {
  try {
    const updatedMenu = await post(`/menus/${formData.id}`, formData)
    const update = (items) => {
      for (const item of items) {
        if (item.id === formData.id) {
          Object.assign(item, updatedMenu)
          return true
        }
        if (item.children && update(item.children)) {
          return true
        }
      }
      return false
    }
    update(menus.value)
  } catch (error) {
    console.error('Failed to update menu:', error)
    ElMessage.error('Failed to update menu')
  }
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
    currentMenu.value = null
    ElMessage.success('Deleted successfully')
  }).catch(() => {
    ElMessage.info('Deletion cancelled')
  })
}

const handleNodeClick = (data) => {
  currentMenu.value = data
}

const handleSave = async (formData) => {
  if (!formData.name) {
    ElMessage.warning('Please enter menu name')
    return
  }

  if (formData.id) {
    await updateMenu(formData)
    ElMessage.success('Saved successfully')
  } else {
    await addMenu(formData)
    ElMessage.success('Added successfully')
  }
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
