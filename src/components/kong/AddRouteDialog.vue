<template>
  <el-dialog
    v-model="dialogVisible"
    title="Add New Route"
    width="600px"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="route-form">
      <el-form-item label="Service" prop="service_id">
        <el-select
          v-model="form.service_id"
          placeholder="Select a service"
          class="route-service-select"
        >
          <el-option
            v-for="service in services"
            :key="service.id"
            :label="service.name"
            :value="service.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="Route Name" prop="name">
        <el-input
          v-model="form.name"
          placeholder="Enter route name"
          class="route-name-input"
        />
      </el-form-item>
      
      <el-form-item label="Paths" prop="paths">
        <div class="paths-container">
          <el-input
            v-model="pathInput"
            placeholder="Enter path (e.g., /users)"
            class="path-input"
            @keyup.enter="addPath"
          />
          <el-button type="primary" @click="addPath" size="small" class="add-path-button">
            Add Path
          </el-button>
        </div>
        <div class="paths-list">
          <el-tag
            v-for="(path, index) in form.paths"
            :key="index"
            closable
            @close="removePath(index)"
            class="path-tag"
          >
            {{ path }}
          </el-tag>
        </div>
      </el-form-item>
      
      <el-form-item label="Methods" prop="methods">
        <div class="methods-container">
          <el-select
            v-model="methodInput"
            placeholder="Select HTTP method"
            class="method-select"
          >
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
            <el-option label="PATCH" value="PATCH" />
            <el-option label="OPTIONS" value="OPTIONS" />
          </el-select>
          <el-button type="primary" @click="addMethod" size="small" class="add-method-button">
            Add Method
          </el-button>
        </div>
        <div class="methods-list">
          <el-tag
            v-for="(method, index) in form.methods"
            :key="index"
            closable
            @close="removeMethod(index)"
            class="method-tag"
          >
            {{ method }}
          </el-tag>
        </div>
      </el-form-item>
      
      <el-form-item label="Description" prop="description">
        <el-input
          v-model="form.description"
          placeholder="Enter route description (optional)"
          type="textarea"
          :rows="3"
          class="route-description-input"
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
  },
  services: {
    type: Array,
    default: () => []
  }
})

// 定义emit事件
const emit = defineEmits(['update:visible', 'route-added'])

// 响应式数据
const dialogVisible = ref(props.visible)
const formRef = ref(null)
const form = ref({
  service_id: '',
  name: '',
  paths: [],
  methods: [],
  description: ''
})
const pathInput = ref('')
const methodInput = ref('')

// 表单验证规则
const rules = {
  service_id: [
    { required: true, message: 'Please select a service', trigger: 'blur' }
  ],
  name: [
    { required: true, message: 'Please enter route name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50 characters', trigger: 'blur' }
  ],
  paths: [
    { required: true, message: 'Please add at least one path', trigger: 'blur' },
    { type: 'array', min: 1, message: 'Please add at least one path', trigger: 'blur' }
  ],
  methods: [
    { required: true, message: 'Please add at least one method', trigger: 'blur' },
    { type: 'array', min: 1, message: 'Please add at least one method', trigger: 'blur' }
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
    service_id: '',
    name: '',
    paths: [],
    methods: [],
    description: ''
  }
  pathInput.value = ''
  methodInput.value = ''
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 添加路径
const addPath = () => {
  if (pathInput.value.trim()) {
    if (!form.value.paths.includes(pathInput.value.trim())) {
      form.value.paths.push(pathInput.value.trim())
      pathInput.value = ''
    } else {
      ElMessage.warning('Path already exists!')
    }
  }
}

// 移除路径
const removePath = (index) => {
  form.value.paths.splice(index, 1)
}

// 添加方法
const addMethod = () => {
  if (methodInput.value) {
    if (!form.value.methods.includes(methodInput.value)) {
      form.value.methods.push(methodInput.value)
      methodInput.value = ''
    } else {
      ElMessage.warning('Method already exists!')
    }
  }
}

// 移除方法
const removeMethod = (index) => {
  form.value.methods.splice(index, 1)
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
      emit('route-added', {
        service_id: form.value.service_id,
        name: form.value.name,
        paths: form.value.paths,
        methods: form.value.methods,
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
.route-form {
  margin-top: 20px;
}

.route-service-select,
.route-name-input {
  width: 100%;
}

.paths-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.path-input {
  flex: 1;
}

.add-path-button {
  flex-shrink: 0;
}

.paths-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.path-tag {
  margin-right: 8px;
}

.methods-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.method-select {
  flex: 1;
}

.add-method-button {
  flex-shrink: 0;
}

.methods-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.method-tag {
  margin-right: 8px;
}

.route-description-input {
  width: 100%;
  resize: vertical;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 768px) {
  .paths-container,
  .methods-container {
    flex-direction: column;
  }
  
  .add-path-button,
  .add-method-button {
    align-self: flex-start;
  }
}
</style>