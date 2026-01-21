<template>
  <div class="menu-form">
    <div v-if="currentMenu" class="form-content">
      <div class="form-header">
        <h3>Menu Information</h3>
        <div class="header-actions">
          <el-button :icon="Refresh" @click="handleClear">Clear</el-button>
          <el-button type="primary" :icon="Check" @click="handleSave">Save</el-button>
        </div>
      </div>
      <el-form :model="formData" label-width="120px">
        <el-form-item label="ID">
          <el-input v-model="formData.id" disabled placeholder="Auto generated" />
        </el-form-item>
        <el-form-item label="Parent ID">
          <el-input v-model="formData.parent_id" placeholder="Please enter parent ID" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="formData.name" placeholder="Please enter menu name" />
        </el-form-item>
        <el-form-item label="Module">
          <el-select v-model="formData.module" placeholder="Please select module">
            <el-option label="Dashboard" value="dashboard" />
            <el-option label="System" value="system" />
            <el-option label="Settings" value="settings" />
            <el-option label="User" value="user" />
            <el-option label="Report" value="report" />
          </el-select>
        </el-form-item>
        <el-form-item label="Text">
          <el-input v-model="formData.text" placeholder="Please enter text" />
        </el-form-item>
        <el-form-item label="Link">
          <el-input v-model="formData.link" placeholder="Please enter link" />
        </el-form-item>
        <el-form-item label="Active">
          <el-switch v-model="formData.active" />
        </el-form-item>
        <el-form-item label="Sequence">
          <el-input-number v-model="formData.seq" :min="1" placeholder="Please enter sequence" />
        </el-form-item>
        <el-form-item label="Icon">
          <div class="icon-selector">
            <el-input v-model="formData.icon" placeholder="Please select icon" readonly>
              <template #prefix>
                <el-icon v-if="formData.icon" :size="20">
                  <component :is="formData.icon" />
                </el-icon>
              </template>
            </el-input>
            <div class="icon-grid">
              <div 
                v-for="icon in iconList" 
                :key="icon" 
                class="icon-item"
                @click="handleIconClick(icon)"
              >
                <el-icon :size="24">
                  <component :is="icon" />
                </el-icon>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-empty v-else description="Select a menu to view details" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { RefreshRight as Refresh, Check } from '@element-plus/icons-vue'
import * as ElementPlusIcons from '@element-plus/icons-vue'

const props = defineProps({
  currentMenu: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'clear'])

const formData = ref({
  id: '',
  parent_id: '',
  name: '',
  module: '',
  category: '',
  text: '',
  link: '',
  active: true,
  seq: 1,
  icon: ''
})

const iconList = Object.keys(ElementPlusIcons).filter(key => {
  return typeof ElementPlusIcons[key] === 'object' && ElementPlusIcons[key].name
})

watch(() => props.currentMenu, (newMenu) => {
  if (newMenu) {
    formData.value = {
      id: newMenu.id,
      parent_id: newMenu.parent_id || '',
      name: newMenu.name,
      module: newMenu.module || '',
      category: newMenu.category || '',
      text: newMenu.text || '',
      link: newMenu.link || '',
      active: newMenu.active !== undefined ? newMenu.active : true,
      seq: newMenu.seq,
      icon: newMenu.icon
    }
  }
}, { deep: true })

const handleClear = () => {
  emit('clear')
}

const handleSave = () => {
  if (!formData.value.name) {
    return
  }
  emit('save', { ...formData.value })
}

const handleIconClick = (icon) => {
  formData.value.icon = icon
}
</script>

<style scoped>
.menu-form {
  flex: 2;
  padding-left: 20px;
  overflow: hidden;
  min-height: 0;
}

.menu-form::-webkit-scrollbar {
  display: none;
}

.form-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.form-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.form-content::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 4px;
}

.form-content::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

.form-content::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 4px;
}

.form-content {
  scrollbar-width: 8px;
  scrollbar-color: #dcdfe6 #f5f7fa;
  scrollbar-track-color: #f5f7fa;
}

.form-content::-ms-overflow-style {
  scrollbar-width: 8px;
  scrollbar-color: #dcdfe6 #f5f7fa;
  scrollbar-track-color: #f5f7fa;
}

.form-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.form-header h3 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.icon-selector {
  width: 100%;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 8px;
  margin-top: 10px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  max-height: 200px;
  overflow-y: auto;
}

.icon-grid::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.icon-grid::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 4px;
}

.icon-grid::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

.icon-grid::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 4px;
}

.icon-grid {
  scrollbar-width: 8px;
  scrollbar-color: #dcdfe6 #f5f7fa;
  scrollbar-track-color: #f5f7fa;
}

.icon-grid::-ms-overflow-style {
  scrollbar-width: 8px;
  scrollbar-color: #dcdfe6 #f5f7fa;
  scrollbar-track-color: #f5f7fa;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.icon-item:hover {
  background: #e6f7ff;
  transform: scale(1.1);
}
</style>
