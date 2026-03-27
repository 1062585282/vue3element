<template>
  <div class="add-form-section">
    <el-card shadow="false" class="add-form-card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="request-form"
      >
        <el-form-item label="Business Unit">
          <el-select
            v-model="formData.selectedBusinessUnit"
            placeholder="Select business unit"
            style="width: 100%"
            @change="handleBusinessUnitChange"
            filterable
            allow-create
            default-first-option
          >
            <el-option
              v-for="option in businessUnitOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Roles">
          <el-select
            v-model="formData.selectedRoles"
            multiple
            placeholder="Select roles"
            style="width: 100%"
            filterable
            allow-create
            default-first-option
          >
            <el-option
              v-for="role in availableRoles"
              :key="role"
              :label="role"
              :value="role"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="$emit('cancel')">Cancel</el-button>
          <el-button type="success" @click="handleSubmit('save')">Save</el-button>
          <el-button type="primary" @click="handleSubmit('submit')" style="float: right;">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    default: () => ({
      id: '',
      requester: '',
      requestDate: new Date().toISOString(),
      status: 'Draft',
      approverRejecter: '',
      approverRejecterDate: null,
      selectedBusinessUnit: '',
      selectedRoles: []
    })
  },
  businessUnitOptions: {
    type: Array,
    default: () => []
  },
  availableRoles: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['cancel', 'submit'])

const formRef = ref(null)
const rules = {
  requester: [
    { required: true, message: 'Please enter requester name', trigger: 'blur' }
  ],
  status: [
    { required: true, message: 'Please select status', trigger: 'change' }
  ]
}

const handleBusinessUnitChange = () => {
  // Reset roles when business unit changes
  props.formData.selectedRoles = []
}

const handleSubmit = async (action) => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    emit('submit', props.formData, action)
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}
</script>

<style scoped>
.add-form-section {
  margin-top: 20px;
}

.add-form-card {
  margin-top: 20px;
}

.request-form {
  margin-top: 20px;
}
</style>
