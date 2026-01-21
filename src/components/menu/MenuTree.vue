<template>
  <div class="menu-tree">
    <div class="tree-header">
      <el-select v-model="selectedCategory" placeholder="Select Category" style="width: 200px;">
        <el-option label="portal" value="portal" />
        <el-option label="admin-center" value="admin-center" />
        <el-option label="workstation" value="workstation" />
      </el-select>
      <div class="header-right">
        <el-button :icon="Refresh" @click="handleRefresh">Refresh</el-button>
        <el-button type="primary" :icon="Plus" @click="handleAdd">Add</el-button>
      </div>
    </div>
    <el-tree
      ref="treeRef"
      :data="menus"
      :props="defaultProps"
      node-key="id"
      :expand-on-click-node="true"
      :highlight-current="true"
      :default-expand-all="true"
      @node-click="handleNodeClick"
      class="menu-tree-component"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <el-icon v-if="data.icon" :size="16" class="node-icon">
            <component :is="data.icon" />
          </el-icon>
          <span class="node-label">{{ data.text }}</span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { RefreshRight as Refresh, Plus } from '@element-plus/icons-vue'

const props = defineProps({
  menus: {
    type: Array,
    default: () => []
  },
  currentMenu: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['refresh', 'add', 'node-click', 'update:selectedCategory'])

const treeRef = ref(null)
const selectedCategory = ref('')

watch(selectedCategory, (newVal) => {
  emit('update:selectedCategory', newVal)
})

const defaultProps = {
  children: 'children',
  label: 'text'
}

const handleRefresh = () => {
  emit('refresh')
}

const handleAdd = () => {
  emit('add')
}

const handleNodeClick = (data) => {
  emit('node-click', data)
}

defineExpose({
  treeRef
})
</script>

<style scoped>
.menu-tree {
  flex: 1;
  min-width: 300px;
  border-right: 1px solid #dcdfe6;
  padding-right: 20px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.menu-tree::-webkit-scrollbar {
  display: none;
}

.tree-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.header-right {
  display: flex;
  gap: 10px;
}

.menu-tree-component {
  background: #f5f7fa;
  border-radius: 4px;
  padding: 10px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.node-icon {
  color: #409eff;
}

.node-label {
  font-size: 14px;
}
</style>
