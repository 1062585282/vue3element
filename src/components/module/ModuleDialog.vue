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
      <el-form-item label="Module Name" prop="name">
        <el-input v-model="formData.name" :disabled="isViewMode" />
      </el-form-item>

      <el-form-item label="Category" prop="category">
        <el-select v-model="formData.category" :disabled="isViewMode" style="width: 100%">
          <el-option label="Portal" value="portal" />
          <el-option label="Admin Center" value="admin_center" />
          <el-option label="Workstation" value="workstation" />
        </el-select>
      </el-form-item>

      <el-form-item label="Type" prop="type">
        <el-select v-model="formData.type" :disabled="isViewMode" style="width: 100%">
          <el-option label="Component" :value="1" />
          <el-option label="Lib" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="Version" prop="version">
        <el-input v-model="formData.version" :disabled="isViewMode" />
      </el-form-item>

      <el-form-item label="Entry" prop="entry">
        <el-switch v-model="formData.entry" :disabled="isViewMode" />
      </el-form-item>

      <el-form-item label="Created At" v-if="isViewMode">
        <el-input v-model="formData.created_at" disabled />
      </el-form-item>

      <el-form-item label="Created By" v-if="isViewMode">
        <el-input v-model="formData.created_by" disabled />
      </el-form-item>

      <el-form-item label="Updated At" v-if="isViewMode">
        <el-input v-model="formData.updated_at" disabled />
      </el-form-item>

      <el-form-item label="Updated By" v-if="isViewMode">
        <el-input v-model="formData.updated_by" disabled />
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
  module: {
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
  name: '',
  category: '',
  version: '',
  type: '',
  entry: false,
  created_at: '',
  created_by: '',
  updated_at: '',
  updated_by: ''
})

const rules = {
  name: [
    { required: true, message: 'Please enter module name', trigger: 'blur' }
  ],
  category: [
    { required: true, message: 'Please select category', trigger: 'change' }
  ],
  type: [
    { required: true, message: 'Please select type', trigger: 'change' }
  ],
  version: [
    { required: true, message: 'Please enter version', trigger: 'blur' }
  ]
}

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isViewMode = computed(() => props.mode === 'view')

const dialogTitle = computed(() => {
  if (props.mode === 'view') return 'Module Details'
  if (props.mode === 'add') return 'Add Module'
  return 'Edit Module'
})

watch(() => props.module, (newVal) => {
  if (newVal) {
    formData.value = {
      id: newVal.id || '',
      name: newVal.name || '',
      category: newVal.category || '',
      version: newVal.version || '',
      type: newVal.type || '',
      entry: typeof newVal.entry === 'boolean' ? newVal.entry : false,
      created_at: newVal.created_at || '',
      created_by: newVal.created_by || '',
      updated_at: newVal.updated_at || '',
      updated_by: newVal.updated_by || ''
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
