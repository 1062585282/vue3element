<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="isViewMode ? {} : rules"
      label-width="120px"
    >
      <el-form-item label="Parent ID" prop="parent_id">
        <el-input v-model="formData.parent_id" :disabled="isViewMode" placeholder="Please enter parent ID" />
      </el-form-item>

      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" :disabled="isViewMode" placeholder="Please enter menu name" />
      </el-form-item>

      <el-form-item label="Path" prop="path">
        <el-input v-model="formData.path" :disabled="isViewMode" placeholder="Please enter path" />
      </el-form-item>

      <el-form-item label="Component" prop="component">
        <el-input v-model="formData.component" :disabled="isViewMode" placeholder="Please enter component name" />
      </el-form-item>

      <el-form-item label="Sequence" prop="seq">
        <el-input-number v-model="formData.seq" :disabled="isViewMode" :min="1" placeholder="Please enter sequence" />
      </el-form-item>

      <el-form-item label="Icon" prop="icon">
        <el-select v-model="formData.icon" :disabled="isViewMode" placeholder="Please select icon" style="width: 100%" filterable clearable>
          <el-option label="Odometer" value="Odometer" />
          <el-option label="DataLine" value="DataLine" />
          <el-option label="TrendCharts" value="TrendCharts" />
          <el-option label="Setting" value="Setting" />
          <el-option label="User" value="User" />
          <el-option label="UserFilled" value="UserFilled" />
          <el-option label="Tools" value="Tools" />
          <el-option label="Operation" value="Operation" />
          <el-option label="Lock" value="Lock" />
          <el-option label="Menu" value="Menu" />
          <el-option label="Document" value="Document" />
          <el-option label="Files" value="Files" />
          <el-option label="Folder" value="Folder" />
          <el-option label="Star" value="Star" />
          <el-option label="Bell" value="Bell" />
          <el-option label="Message" value="Message" />
          <el-option label="Camera" value="Camera" />
          <el-option label="Location" value="Location" />
          <el-option label="Calendar" value="Calendar" />
          <el-option label="Clock" value="Clock" />
          <el-option label="Search" value="Search" />
          <el-option label="Edit" value="Edit" />
          <el-option label="Delete" value="Delete" />
          <el-option label="Plus" value="Plus" />
          <el-option label="Minus" value="Minus" />
          <el-option label="Check" value="Check" />
          <el-option label="Close" value="Close" />
          <el-option label="Refresh" value="Refresh" />
          <el-option label="Download" value="Download" />
          <el-option label="Upload" value="Upload" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ isViewMode ? 'Close' : 'Cancel' }}</el-button>
        <el-button type="primary" @click="handleConfirm" v-if="!isViewMode">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  menu: {
    type: Object,
    default: () => ({})
  },
  mode: {
    type: String,
    default: 'add'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const formRef = ref(null)
const formData = ref({
  id: '',
  parent_id: '',
  name: '',
  path: '',
  component: '',
  seq: 1,
  icon: ''
})

const rules = {
  name: [
    { required: true, message: 'Please enter menu name', trigger: 'blur' }
  ],
  path: [
    { required: true, message: 'Please enter path', trigger: 'blur' }
  ],
  component: [
    { required: true, message: 'Please enter component name', trigger: 'blur' }
  ],
  seq: [
    { required: true, message: 'Please enter sequence', trigger: 'blur' }
  ]
}

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isViewMode = computed(() => props.mode === 'view')

const dialogTitle = computed(() => {
  if (props.mode === 'view') return 'Menu Details'
  if (props.mode === 'add') return 'Add Menu'
  return 'Edit Menu'
})

watch(() => props.menu, (newVal) => {
  if (newVal) {
    formData.value = {
      id: newVal.id || '',
      parent_id: newVal.parent_id || '',
      name: newVal.name || '',
      path: newVal.path || '',
      component: newVal.component || '',
      seq: newVal.seq || 1,
      icon: newVal.icon || ''
    }
  }
}, { immediate: true, deep: true })

const handleClose = () => {
  formRef.value?.resetFields()
  visible.value = false
}

const handleConfirm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emit('confirm', formData.value)
    }
  })
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
