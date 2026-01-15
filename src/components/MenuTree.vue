<template>
  <div class="menu-tree">
    <div class="tree-header">
      <el-button :icon="Refresh" @click="handleRefresh">Refresh</el-button>
      <div class="header-right">
        <el-button type="primary" :icon="Plus" @click="handleAdd">Add</el-button>
        <el-button 
          type="danger" 
          :icon="Delete" 
          :disabled="!currentMenu"
          @click="handleDelete"
        >
          Delete
        </el-button>
      </div>
    </div>
    <el-tree
      ref="treeRef"
      :data="menus"
      :props="defaultProps"
      node-key="id"
      :expand-on-click-node="false"
      :highlight-current="true"
      @node-click="handleNodeClick"
      class="menu-tree-component"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <el-icon v-if="data.icon" :size="16" class="node-icon">
            <component :is="data.icon" />
          </el-icon>
          <span class="node-label">{{ data.name }}</span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Refresh, Delete, Plus } from '@element-plus/icons-vue'

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

const emit = defineEmits(['refresh', 'add', 'delete', 'node-click'])

const treeRef = ref(null)

const defaultProps = {
  children: 'children',
  label: 'name'
}

const handleRefresh = () => {
  emit('refresh')
}

const handleAdd = () => {
  emit('add')
}

const handleDelete = () => {
  emit('delete')
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
