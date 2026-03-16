<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEditMode ? 'Edit Role' : 'Add Role'"
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
          <el-option
            v-for="option in TYPE_OPTIONS"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
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
          <div v-for="(input, index) in groupInputs" :key="index" class="groups-input-section">
            <el-input 
              v-model="groupInputs[index]" 
              class="group-input" 
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
        <el-button type="primary" @click="handleSave">{{ isEditMode ? 'Update' : 'Save' }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { TYPE_OPTIONS } from './roleConstants.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  editData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'role-added', 'role-updated'])

const dialogVisible = ref(props.visible)
const formRef = ref(null)
const groupsInput = ref('')
const groupInputs = ref([])

const isEditMode = computed(() => !!props.editData)

const form = reactive({
  id: '',
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
    if (props.editData) {
      loadEditData()
    } else {
      resetForm()
    }
  }
})

watch(() => dialogVisible.value, (newVal) => {
  emit('update:visible', newVal)
})

watch(() => props.editData, (newVal) => {
  if (newVal && dialogVisible.value) {
    loadEditData()
  }
})

const loadEditData = () => {
  if (!props.editData) return
  
  form.id = props.editData.id
  form.name = props.editData.name
  form.code = props.editData.code
  form.type = props.editData.type
  form.description = props.editData.description || ''
  
  // Load groups if exists
  if (props.editData.groups && props.editData.groups.length > 0) {
    groupInputs.value = [...props.editData.groups]
  } else {
    groupInputs.value = []
  }
  
  groupsInput.value = ''
}

const resetForm = () => {
  form.id = ''
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
  emit('update:visible', false)
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
      
      if (isEditMode.value) {
        // Emit role-updated event with form data
        emit('role-updated', { ...form })
        ElMessage.success('Role updated successfully!')
      } else {
        // Emit role-added event with form data
        emit('role-added', { ...form })
        ElMessage.success('Role added successfully!')
      }
      
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
</style>
