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
import ModuleUploadDialog from './ModuleUploadDialog.vue'
import { get, post } from '../../utils/request.js'
import { DEFAULT_MODULES } from '../../constants/mockData.js'

const loading = ref(false)
const dialogVisible = ref(false)
const uploadDialogVisible = ref(false)
const dialogMode = ref('add')
const currentModule = ref(null)

const modules = ref([])

const getCurrentUser = () => {
  return 'admin'
}

const loadModules = async () => {
  loading.value = true
  try {
    // 直接使用模拟数据，不调用API
    modules.value = DEFAULT_MODULES
    console.log('Using default modules data')
  } catch (error) {
    console.log('Error loading modules:', error)
    modules.value = DEFAULT_MODULES
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogMode.value = 'add'
  currentModule.value = {
    id: '',
    name: '',
    category: 'portal',
    version: '1.0.0',
    type: 1,
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

const handleDelete = async (module) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete module "${module.name}"?`,
      'Delete Confirmation',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    await post(`/modules/${module.id}/delete`)
    const index = modules.value.findIndex(m => m.id === module.id)
    if (index > -1) {
      modules.value.splice(index, 1)
      ElMessage.success('Deleted successfully')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete module:', error)
      ElMessage.error('Failed to delete module')
    }
  }
}

const handleDialogConfirm = async (formData) => {
  if (dialogMode.value === 'view') {
    dialogVisible.value = false
    return
  }

  try {
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
      const newModule = await post('/modules', {
        ...formData,
        created_at: now,
        created_by: getCurrentUser(),
        updated_at: now,
        updated_by: getCurrentUser()
      })
      modules.value.push(newModule)
      ElMessage.success('Added successfully')
    } else {
      const updatedModule = await post(`/modules/${formData.id}`, {
        ...formData,
        updated_at: now,
        updated_by: getCurrentUser()
      })
      const index = modules.value.findIndex(m => m.id === formData.id)
      if (index > -1) {
        modules.value[index] = updatedModule
        ElMessage.success('Updated successfully')
      }
    }
    dialogVisible.value = false
  } catch (error) {
    console.error('Failed to save module:', error)
    ElMessage.error('Failed to save module')
  }
}



const handleBatchDelete = async (selectedRows) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete ${selectedRows.length} module(s)?`,
      'Delete Confirmation',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    const idsToDelete = selectedRows.map(row => row.id)
    await post('/modules/batch-delete', { ids: idsToDelete })
    modules.value = modules.value.filter(m => !idsToDelete.includes(m.id))
    ElMessage.success(`Deleted ${selectedRows.length} module(s) successfully`)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to batch delete modules:', error)
      ElMessage.error('Failed to delete modules')
    }
  }
}

const handleView = (module) => {
  dialogMode.value = 'view'
  currentModule.value = { ...module }
  dialogVisible.value = true
}

const handleUploadFile = (module) => {
  currentModule.value = { ...module }
  uploadDialogVisible.value = true
}

const handleUploadConfirm = async (data) => {
  try {
    const now = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-')

    // 模拟文件上传API调用
    console.log('Uploading file:', data.fileName, 'for module:', data.module.id)
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟成功响应
    const updatedModule = {
      ...data.module,
      file: data.fileName,
      updated_at: now,
      updated_by: getCurrentUser()
    }
    
    // 更新本地数据
    const index = modules.value.findIndex(m => m.id === data.module.id)
    if (index > -1) {
      modules.value[index] = updatedModule
      ElMessage.success('File uploaded successfully')
    }
    
    console.log('File uploaded successfully:', updatedModule)
  } catch (error) {
    console.error('Failed to upload file:', error)
    ElMessage.error('Failed to upload file')
  }
}

onMounted(() => {
  loadModules()
})
</script>

<style scoped>
.module-management {
  width: 100%;
}

.content-card {
  min-height: 600px;
}
</style>
