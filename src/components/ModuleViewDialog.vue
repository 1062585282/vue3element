<template>
  <el-dialog
    v-model="visible"
    title="Module Details"
    width="600px"
    @close="handleClose"
  >
    <el-form
      :model="formData"
      label-width="120px"
    >
      <el-form-item label="Module Name">
        <el-input v-model="formData.name" disabled />
      </el-form-item>

      <el-form-item label="Category">
        <el-select v-model="formData.category" disabled style="width: 100%">
          <el-option label="Portal" value="portal" />
          <el-option label="Admin Center" value="admin_center" />
          <el-option label="Workstation" value="workstation" />
        </el-select>
      </el-form-item>

      <el-form-item label="Type">
        <el-select v-model="formData.type" disabled style="width: 100%">
          <el-option label="Component" value="component" />
          <el-option label="Lib" value="lib" />
        </el-select>
      </el-form-item>

      <el-form-item label="Version">
        <el-input v-model="formData.version" disabled />
      </el-form-item>

      <el-form-item label="Entry">
        <el-switch v-model="formData.entry" disabled />
      </el-form-item>

      <el-form-item label="Created At">
        <el-input v-model="formData.created_at" disabled />
      </el-form-item>

      <el-form-item label="Created By">
        <el-input v-model="formData.created_by" disabled />
      </el-form-item>

      <el-form-item label="Updated At">
        <el-input v-model="formData.updated_at" disabled />
      </el-form-item>

      <el-form-item label="Updated By">
        <el-input v-model="formData.updated_by" disabled />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleClose">Close</el-button>
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
  }
})

const emit = defineEmits(['update:modelValue'])

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
      entry: typeof newVal.entry === 'boolean' ? newVal.entry : false,
      created_at: newVal.created_at || '',
      created_by: newVal.created_by || '',
      updated_at: newVal.updated_at || '',
      updated_by: newVal.updated_by || ''
    }
  }
}, { immediate: true, deep: true })

const handleClose = () => {
  visible.value = false
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
