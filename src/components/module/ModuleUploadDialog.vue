<template>
  <el-dialog
    v-model="visible"
    title="Upload File"
    width="600px"
    @close="handleClose"
  >
    <el-form
      :model="formData"
      label-width="120px"
    >
      <el-form-item label="Module Name">
        <el-input v-model="formData.moduleName" disabled />
      </el-form-item>

      <el-form-item label="File">
        <el-upload
          class="upload-demo"
          drag
          :auto-upload="false"
          :show-file-list="false"
          :accept="'.zip,application/zip'"
          :on-change="handleFileChange"
          action="#"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drag file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              <el-tag type="info" size="small">Only .zip files are allowed</el-tag>
            </div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item label="File Name">
        <el-input v-model="formData.fileName" disabled />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm" :disabled="!formData.file">Upload</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'

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

const emit = defineEmits(['update:modelValue', 'confirm'])

const formData = ref({
  moduleName: '',
  fileName: '',
  file: null
})

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

watch(() => props.module, (newVal) => {
  if (newVal) {
    formData.value = {
      moduleName: newVal.name || '',
      fileName: newVal.file || '',
      file: null
    }
  }
}, { immediate: true, deep: true })

const handleFileChange = (file) => {
  formData.value.file = file.raw
  formData.value.fileName = file.name
}

const handleConfirm = () => {
  if (formData.value.file) {
    emit('confirm', {
      module: props.module,
      file: formData.value.file,
      fileName: formData.value.fileName
    })
  }
}

const handleClose = () => {
  formData.value = {
    moduleName: '',
    fileName: '',
    file: null
  }
  visible.value = false
}
</script>

<style scoped>
.upload-demo {
  width: 100%;
}

.el-icon--upload {
  font-size: 67px;
  color: #c0c4cc;
  margin: 40px 0 16px;
  line-height: 50px;
}

.el-upload__text {
  color: #606266;
  font-size: 14px;
  text-align: center;
}

.el-upload__text em {
  color: #409eff;
  font-style: normal;
}

.el-upload__tip {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
