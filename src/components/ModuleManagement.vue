<template>
  <div class="module-management">
    <el-card class="content-card">
      <ModuleTable
        :modules="modules"
        :loading="loading"
        @edit="handleEdit"
        @delete="handleDelete"
        @refresh="loadModules"
        @add="handleAdd"
        @batch-delete="handleBatchDelete"
        @view="handleView"
        @upload-file="handleUploadFile"
      />
    </el-card>

    <ModuleDialog
      v-model="dialogVisible"
      :module="currentModule"
      :mode="dialogMode"
      @confirm="handleDialogConfirm"
    />

    <ModuleViewDialog
      v-model="viewDialogVisible"
      :module="currentModule"
    />

    <ModuleUploadDialog
      v-model="uploadDialogVisible"
      :module="currentModule"
      @confirm="handleUploadConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import ModuleTable from './ModuleTable.vue'
import ModuleDialog from './ModuleDialog.vue'
import ModuleViewDialog from './ModuleViewDialog.vue'
import ModuleUploadDialog from './ModuleUploadDialog.vue'

const loading = ref(false)
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const uploadDialogVisible = ref(false)
const dialogMode = ref('add')
const currentModule = ref(null)

const modules = ref([])

const generateId = () => {
  return 'module_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

const getCurrentUser = () => {
  return 'admin'
}

const loadModules = () => {
  loading.value = true
  setTimeout(() => {
    const storedModules = localStorage.getItem('modules')
    if (storedModules) {
      modules.value = JSON.parse(storedModules)
    } else {
      modules.value = [
        {
          id: 'module_001',
          name: 'User Management',
          category: 'portal',
          version: '1.0.0',
          file: 'user-management.js',
          type: 'component',
          tab: 'portal',
          entry: false,
          created_at: '2024-01-01 10:00:00',
          created_by: 'admin',
          updated_at: '2024-01-01 10:00:00',
          updated_by: 'admin'
        },
        {
          id: 'module_002',
          name: 'Statistics',
          category: 'portal',
          version: '1.2.0',
          file: 'statistics.js',
          type: 'lib',
          tab: 'portal',
          entry: false,
          created_at: '2024-01-02 14:30:00',
          created_by: 'admin',
          updated_at: '2024-01-05 09:15:00',
          updated_by: 'admin'
        },
        {
          id: 'module_003',
          name: 'System Configuration',
          category: 'admin_center',
          version: '2.0.0',
          file: 'system-config.js',
          type: 'component',
          tab: 'admin_center',
          entry: true,
          created_at: '2024-01-03 11:20:00',
          created_by: 'admin',
          updated_at: '2024-01-10 16:45:00',
          updated_by: 'admin'
        },
        {
          id: 'module_004',
          name: 'Permission Management',
          category: 'admin_center',
          version: '1.5.0',
          file: 'permission.js',
          type: 'lib',
          tab: 'admin_center',
          entry: false,
          created_at: '2024-01-04 08:00:00',
          created_by: 'admin',
          updated_at: '2024-01-08 13:20:00',
          updated_by: 'admin'
        },
        {
          id: 'module_005',
          name: 'Workstation',
          category: 'workstation',
          version: '1.0.0',
          file: 'workstation.js',
          type: 'component',
          tab: 'workstation',
          entry: true,
          created_at: '2024-01-05 15:30:00',
          created_by: 'admin',
          updated_at: '2024-01-05 15:30:00',
          updated_by: 'admin'
        },
        {
          id: 'module_006',
          name: 'Utility Functions',
          category: 'workstation',
          version: '1.3.0',
          file: 'utils.js',
          type: 'lib',
          tab: 'workstation',
          entry: false,
          created_at: '2024-01-06 09:00:00',
          created_by: 'admin',
          updated_at: '2024-01-12 10:30:00',
          updated_by: 'admin'
        }
      ]
      saveModules()
    }
    loading.value = false
  }, 500)
}

const saveModules = () => {
  localStorage.setItem('modules', JSON.stringify(modules.value))
}

const handleAdd = () => {
  dialogMode.value = 'add'
  currentModule.value = {
    id: '',
    name: '',
    category: 'portal',
    version: '1.0.0',
    file: '',
    type: 'component',
    tab: 'portal',
    entry: false,
    created_at: '',
    created_by: '',
    updated_at: '',
    updated_by: ''
  }
  dialogVisible.value = true
}

const handleEdit = (module) => {
  dialogMode.value = 'edit'
  currentModule.value = { ...module }
  dialogVisible.value = true
}

const handleDelete = (module) => {
  ElMessageBox.confirm(
    `Are you sure you want to delete module "${module.name}"?`,
    'Delete Confirmation',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    const index = modules.value.findIndex(m => m.id === module.id)
    if (index > -1) {
      modules.value.splice(index, 1)
      saveModules()
      ElMessage.success('Deleted successfully')
    }
  }).catch(() => {
    ElMessage.info('Deletion cancelled')
  })
}

const handleDialogConfirm = (formData) => {
  const now = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-')

  if (dialogMode.value === 'add') {
    const newModule = {
      ...formData,
      id: generateId(),
      created_at: now,
      created_by: getCurrentUser(),
      updated_at: now,
      updated_by: getCurrentUser()
    }
    modules.value.push(newModule)
    ElMessage.success('Added successfully')
  } else {
    const index = modules.value.findIndex(m => m.id === formData.id)
    if (index > -1) {
      modules.value[index] = {
        ...formData,
        updated_at: now,
        updated_by: getCurrentUser()
      }
      ElMessage.success('Updated successfully')
    }
  }
  saveModules()
  dialogVisible.value = false
}

const handleUpdateEntry = (module) => {
  const index = modules.value.findIndex(m => m.id === module.id)
  if (index > -1) {
    modules.value[index].entry = true
    saveModules()
    ElMessage.success('Entry enabled')
  }
}

const handleBatchDelete = (selectedRows) => {
  ElMessageBox.confirm(
    `Are you sure you want to delete ${selectedRows.length} module(s)?`,
    'Delete Confirmation',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    const idsToDelete = selectedRows.map(row => row.id)
    modules.value = modules.value.filter(m => !idsToDelete.includes(m.id))
    saveModules()
    ElMessage.success(`Deleted ${selectedRows.length} module(s) successfully`)
  }).catch(() => {
    ElMessage.info('Deletion cancelled')
  })
}

const handleView = (module) => {
  currentModule.value = { ...module }
  viewDialogVisible.value = true
}

const handleUploadFile = (module) => {
  currentModule.value = { ...module }
  uploadDialogVisible.value = true
}

const handleUploadConfirm = (data) => {
  const index = modules.value.findIndex(m => m.id === data.module.id)
  if (index > -1) {
    modules.value[index].file = data.fileName
    const now = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-')
    modules.value[index].updated_at = now
    modules.value[index].updated_by = getCurrentUser()
    saveModules()
    ElMessage.success('File uploaded successfully')
  }
}

onMounted(() => {
  loadModules()
})
</script>

<style scoped>
.module-management {
  padding: 20px;
  width: 100%;
}

.content-card {
  min-height: 600px;
}
</style>
