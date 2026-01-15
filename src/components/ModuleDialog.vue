<template>
  <el-dialog
    v-model="visible"
    :title="mode === 'add' ? 'Add Module' : 'Edit Module'"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="Module Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please enter module name" />
      </el-form-item>

      <el-form-item label="Category" prop="category">
        <el-select v-model="formData.category" placeholder="Please select category" style="width: 100%">
          <el-option label="Portal" value="portal" />
          <el-option label="Admin Center" value="admin_center" />
          <el-option label="Workstation" value="workstation" />
        </el-select>
      </el-form-item>

      <el-form-item label="Type" prop="type">
        <el-select v-model="formData.type" placeholder="Please select type" style="width: 100%">
          <el-option label="Component" value="component" />
          <el-option label="Lib" value="lib" />
        </el-select>
      </el-form-item>

      <el-form-item label="Version" prop="version">
        <el-input v-model="formData.version" placeholder="Please enter version" />
      </el-form-item>

      <el-form-item label="Entry" prop="entry">
        <el-switch v-model="formData.entry" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm">Confirm</el-button>
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
  entry: false
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

watch(() => props.module, (newVal) => {
  if (newVal) {
    formData.value = {
      id: newVal.id || '',
      name: newVal.name || '',
      category: newVal.category || '',
      version: newVal.version || '',
      type: newVal.type || '',
      entry: typeof newVal.entry === 'boolean' ? newVal.entry : false
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
