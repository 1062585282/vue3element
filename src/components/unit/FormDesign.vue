<template>
  <div class="form-design">
    <div class="design-header">
      <h2>Form Design</h2>
      <div class="header-actions">
        <el-button type="primary" :icon="Check">Save</el-button>
        <el-button :icon="RefreshRight">Refresh</el-button>
      </div>
    </div>
    
    <div class="design-content">
      <!-- 左侧组件库 -->
      <div class="component-library">
        <h3>Component Library</h3>
        <div class="component-list">
          <div 
            v-for="component in components" 
            :key="component.type"
            class="component-item"
            draggable="true"
            @dragstart="onDragStart($event, component)"
          >
            <el-icon :size="24"><component :is="component.icon" /></el-icon>
            <span>{{ component.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- 中间表单画布 -->
      <div class="form-canvas">
        <h3>Form Canvas</h3>
        <div 
          class="canvas-dropzone"
          @dragover.prevent
          @drop="onDrop($event)"
        >
          <div 
            v-for="(field, index) in formFields" 
            :key="field.id"
            class="field-item"
            @click="selectField(field, index)"
            :class="{ 'selected': selectedFieldIndex === index }"
          >
            <el-icon :size="18"><component :is="field.icon" /></el-icon>
            <span>{{ field.label || field.name || 'New Field' }}</span>
            <div class="field-actions">
              <el-button 
                type="text" 
                size="small" 
                :icon="Delete" 
                @click.stop="deleteField(index)"
              >
                Delete
              </el-button>
            </div>
          </div>
          <el-empty v-if="formFields.length === 0" description="Drag components here" />
        </div>
      </div>
      
      <!-- 右侧属性配置 -->
      <div class="property-panel">
        <h3>Properties</h3>
        <div v-if="selectedField" class="property-content">
          <el-form :model="selectedField" label-width="100px">
            <el-form-item label="Field Name">
              <el-input v-model="selectedField.name" placeholder="Enter field name" />
            </el-form-item>
            
            <el-form-item label="Label">
              <el-input v-model="selectedField.label" placeholder="Enter field label" />
            </el-form-item>
            
            <el-form-item label="Type">
              <el-select v-model="selectedField.type" placeholder="Select field type">
                <el-option label="Text" value="text" />
                <el-option label="Number" value="number" />
                <el-option label="Date" value="date" />
                <el-option label="Select" value="select" />
                <el-option label="Checkbox" value="checkbox" />
                <el-option label="Radio" value="radio" />
                <el-option label="Textarea" value="textarea" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="Length">
              <el-input-number 
                v-model="selectedField.length" 
                :min="1" 
                :max="1000" 
                placeholder="Enter max length"
              />
            </el-form-item>
            
            <el-form-item label="Required">
              <el-switch v-model="selectedField.required" />
            </el-form-item>
            
            <el-form-item label="Placeholder">
              <el-input v-model="selectedField.placeholder" placeholder="Enter placeholder" />
            </el-form-item>
            
            <el-form-item label="Default Value">
              <el-input v-model="selectedField.defaultValue" placeholder="Enter default value" />
            </el-form-item>
          </el-form>
        </div>
        <el-empty v-else description="Select a field to edit properties" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  EditPen, Document, Calendar, ArrowDown, Check, 
  CircleCheck, DocumentCopy, RefreshRight, Delete 
} from '@element-plus/icons-vue'

const components = ref([
  { type: 'text', name: 'Text Input', icon: EditPen },
  { type: 'number', name: 'Number Input', icon: Document },
  { type: 'date', name: 'Date Picker', icon: Calendar },
  { type: 'select', name: 'Select', icon: ArrowDown },
  { type: 'checkbox', name: 'Checkbox', icon: Check },
  { type: 'radio', name: 'Radio', icon: CircleCheck },
  { type: 'textarea', name: 'Textarea', icon: DocumentCopy }
])

const formFields = ref([])
const selectedFieldIndex = ref(-1)
const selectedField = ref(null)
let fieldId = 1

const onDragStart = (event, component) => {
  event.dataTransfer.setData('application/json', JSON.stringify(component))
}

const onDrop = (event) => {
  event.preventDefault()
  const componentData = JSON.parse(event.dataTransfer.getData('application/json'))
  
  const newField = {
    id: `field_${fieldId++}`,
    ...componentData,
    name: '',
    label: '',
    length: 50,
    required: false,
    placeholder: '',
    defaultValue: ''
  }
  
  formFields.value.push(newField)
}

const selectField = (field, index) => {
  selectedFieldIndex.value = index
  selectedField.value = field
}

const deleteField = (index) => {
  formFields.value.splice(index, 1)
  if (selectedFieldIndex.value === index) {
    selectedFieldIndex.value = -1
    selectedField.value = null
  } else if (selectedFieldIndex.value > index) {
    selectedFieldIndex.value--
  }
}
</script>

<style scoped>
.form-design {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.design-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.design-header h2 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.design-content {
  display: flex;
  flex: 1;
  gap: 20px;
  overflow: hidden;
}

.component-library, .property-panel {
  width: 250px;
  background: #f5f7fa;
  border-radius: 4px;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.component-library h3, .property-panel h3, .form-canvas h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #303133;
}

.component-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.component-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: move;
  transition: all 0.3s;
}

.component-item:hover {
  background: #e6f7ff;
  border-color: #91d5ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.form-canvas {
  flex: 1;
  background: #f5f7fa;
  border-radius: 4px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.canvas-dropzone {
  flex: 1;
  background: white;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  padding: 20px;
  overflow-y: auto;
  transition: all 0.3s;
}

.canvas-dropzone.dragover {
  border-color: #409eff;
  background: #ecf5ff;
}

.field-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #fafafa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.field-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.field-item.selected {
  border-color: #409eff;
  background: #ecf5ff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.field-actions {
  margin-left: auto;
}

.property-content {
  flex: 1;
  overflow-y: auto;
}

.property-content :deep(.el-form-item) {
  margin-bottom: 15px;
}
</style>