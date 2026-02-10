<template>
  <el-dialog
    v-model="dialogVisible"
    title="Add New Service"
    width="500px"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="service-form">
      <el-form-item label="Service Name" prop="name">
        <el-input
          v-model="form.name"
          placeholder="Enter service name"
          class="service-name-input"
        />
      </el-form-item>
      
      <el-form-item label="Service URL" prop="url">
        <el-input
          v-model="form.url"
          placeholder="Enter service URL (e.g., http://localhost:3000)"
          class="service-url-input"
        />
      </el-form-item>
      
      <el-form-item label="Description" prop="description">
        <el-input
          v-model="form.description"
          placeholder="Enter service description (optional)"
          type="textarea"
          :rows="3"
          class="service-description-input"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">
          Cancel
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'

// 定义props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// 定义emit事件
const emit = defineEmits(['update:visible', 'service-added'])

// 响应式数据
const dialogVisible = ref(props.visible)
const formRef = ref(null)
const form = ref({
  name: '',
  url: '',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: 'Please enter service name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50 characters', trigger: 'blur' }
  ],
  url: [
    { required: true, message: 'Please enter service URL', trigger: 'blur' },
    { type: 'url', message: 'Please enter valid URL', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: 'Description should not exceed 200 characters', trigger: 'blur' }
  ]
}

// 监听visible属性变化
watch(
  () => props.visible,
  (newValue) => {
    dialogVisible.value = newValue
    if (newValue) {
      // 重置表单
      resetForm()
    }
  }
)

// 监听dialogVisible变化
watch(
  () => dialogVisible.value,
  (newValue) => {
    emit('update:visible', newValue)
  }
)

// 重置表单
const resetForm = () => {
  form.value = {
    name: '',
    url: '',
    description: ''
  }
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 处理关闭对话框
const handleClose = () => {
  dialogVisible.value = false
}

// 处理提交
const handleSubmit = () => {
  if (!formRef.value) return
  
  formRef.value.validate((valid) => {
    if (valid) {
      // 提交表单
      emit('service-added', {
        name: form.value.name,
        url: form.value.url,
        description: form.value.description
      })
      // 关闭对话框
      dialogVisible.value = false
    } else {
      ElMessage.error('Please complete the form correctly!')
      return false
    }
  })
}
</script>

<style scoped>
.service-form {
  margin-top: 20px;
}

.service-name-input,
.service-url-input {
  width: 100%;
}

.service-description-input {
  width: 100%;
  resize: vertical;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>