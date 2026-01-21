<template>
  <div class="menu-management">
    <el-card class="content-card">
      <div class="menu-container">
        <MenuTree 
          :menus="menus" 
          :current-menu="currentMenu"
          v-model:selectedCategory="selectedCategory"
          @refresh="loadMenus"
          @add="handleAdd"
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
const selectedCategory = ref('portal')

const loadMenus = async () => {
  try {
    // 直接使用模拟数据，不调用API
    menus.value = DEFAULT_MENUS
    console.log('Using default menus data')
  } catch (error) {
    console.log('Error loading menus:', error)
    menus.value = DEFAULT_MENUS
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
    category: selectedCategory.value || 'portal', // 使用选择的category或默认值
    text: '',
    link: '',
    active: true,
    seq: 1,
    icon: ''
  }
}

const handleNodeClick = (data) => {
  currentMenu.value = data
}

const handleSave = async (formData) => {
  if (!formData.name) {
    ElMessage.warning('Please enter menu name')
    return
  }

  // 确保带上category字段
  const menuData = {
    ...formData,
    category: formData.category || 'portal' // 如果没有category，默认值为portal
  }

  if (formData.id) {
    await updateMenu(menuData)
    ElMessage.success('Saved successfully')
  } else {
    await addMenu(menuData)
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
