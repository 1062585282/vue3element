<template>
  <el-dialog
    v-model="dialogVisible"
    title="Add Role"
    width="500px"
    @close="handleClose"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="add-role-form"
    >
      <el-form-item label="Name" prop="name">
        <el-input v-model="form.name" placeholder="Enter role name" />
      </el-form-item>
      <el-form-item label="Code" prop="code">
        <el-input v-model="form.code" placeholder="Enter role code" />
      </el-form-item>
      <el-form-item label="Type" prop="type">
        <el-select
          v-model="form.type"
          placeholder="Select role type"
        >
          <el-option label="System Role" :value="1" />
          <el-option label="Business Role" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="Groups" prop="groups">
        <div class="groups-input-section">
          <el-input
            v-model="groupsInput"
            placeholder="Enter group name"
            @keyup.enter="addGroupFromInput"
            class="group-input"
          />
          <el-button type="primary" size="small" circle @click="addNewGroupInput">
            <el-icon><Plus /></el-icon>
          </el-button>
        </div>
        <div class="groups-list" v-if="groupInputs.length > 0">
          <div v-for="(input, index) in groupInputs" :key="index" class="group-item">
            <el-input 
              v-model="groupInputs[index]" 
              size="small" 
              class="group-edit-input" 
              placeholder="Enter group name"
            />
            <el-button type="danger" size="small" circle @click="removeGroupInput(index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input
          v-model="form.description"
          placeholder="Enter role description"
          type="textarea"
          rows="3"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleSave">Save</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'role-added'])

const dialogVisible = ref(props.visible)
const formRef = ref(null)
const groupsInput = ref('')
const groupInputs = ref([])

const form = reactive({
  name: '',
  code: '',
  type: '',
  groups: [],
  description: ''
})

const rules = {
  name: [
    { required: true, message: 'Please enter role name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be between 2 and 50', trigger: 'blur' }
  ],
  code: [
    { required: true, message: 'Please enter role code', trigger: 'blur' },
    { min: 2, max: 20, message: 'Length should be between 2 and 20', trigger: 'blur' }
  ],
  type: [
    { required: true, message: 'Please select role type', trigger: 'change' }
  ]
}

watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal) {
    resetForm()
  }
})

watch(() => dialogVisible.value, (newVal) => {
  emit('update:visible', newVal)
})

const resetForm = () => {
  form.name = ''
  form.code = ''
  form.type = ''
  form.groups = []
  groupsInput.value = ''
  groupInputs.value = []
  form.description = ''
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

const addGroupFromInput = () => {
  if (groupsInput.value.trim()) {
    const groupName = groupsInput.value.trim()
    if (!groupInputs.value.includes(groupName)) {
      groupInputs.value.push(groupName)
    } else {
      ElMessage.warning('Group already exists!')
    }
    groupsInput.value = ''
  }
}

const addNewGroupInput = () => {
  groupInputs.value.push('')
}

const removeGroupInput = (index) => {
  groupInputs.value.splice(index, 1)
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

const handleSave = () => {
  if (!formRef.value) return
  
  formRef.value.validate((valid) => {
    if (valid) {
      // Filter out empty groups and remove duplicates
      const validGroups = groupInputs.value
        .map(g => g.trim())
        .filter(g => g)
      
      // Remove duplicates
      form.groups = [...new Set(validGroups)]
      
      // Emit role-added event with form data
      emit('role-added', { ...form })
      
      // Show success message
      ElMessage.success('Role added successfully!')
      
      // Close dialog
      handleClose()
    } else {
      return false
    }
  })
}
</script>

<style scoped>
.add-role-form {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.groups-input-section {
  display: flex;
  gap: 8px;
  align-items: center;
}

.group-input {
  flex: 1;
}

.groups-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.group-edit-input {
  flex: 1;
}
</style>