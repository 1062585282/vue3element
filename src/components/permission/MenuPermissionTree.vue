<template>
  <div class="permission-tree-section">
    <div class="tree-header">
      <h3>Menu Permissions</h3>
      <div class="header-actions">
        <el-select
          v-model="selectedCategory"
          placeholder="Select a category"
          clearable
          @change="handleCategoryChange"
          class="category-select"
        >
          <el-option
            v-for="category in categories"
            :key="category.value"
            :label="category.label"
            :value="category.value"
          />
        </el-select>
        <el-button
          v-if="selectedRole"
          type="primary"
          @click="handleSave"
          class="save-button"
        >
          Save Permissions
        </el-button>
      </div>
    </div>
    <el-tree
      v-if="selectedRole"
      v-model="checkedKeys"
      :data="menuTree"
      node-key="id"
      show-checkbox
      :default-expand-all="true"
      @check-change="handleCheckChange"
      class="permission-tree"
    >
      <template #default="{ node, data }">
        <span class="tree-node-content">
          <i :class="data.icon || 'el-icon-folder'" style="margin-right: 8px;"></i>
          {{ data.label }}
        </span>
      </template>
    </el-tree>
    <div v-else class="no-role-selected">
      Please select a role from the left list to configure permissions
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuPermissionTree',
  props: {
    selectedRole: {
      type: Object,
      default: null
    },
    menuTree: {
      type: Array,
      default: () => []
    },
    checkedKeys: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    },
    selectedCategory: {
      type: String,
      default: null
    }
  },
  emits: ['category-change', 'save-permissions', 'check-change'],
  methods: {
    handleCategoryChange(value) {
      this.$emit('category-change', value)
    },
    handleSave() {
      this.$emit('save-permissions')
    },
    handleCheckChange(data, checked, indeterminate) {
      this.$emit('check-change', data, checked, indeterminate)
    }
  }
}
</script>

<style scoped>
.permission-tree-section {
  flex: 1;
}

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.tree-header h3 {
  margin: 0;
  color: #666;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.header-actions .category-select {
  width: 200px;
}

.save-button {
  flex-shrink: 0;
}

.permission-tree {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  max-height: 500px;
  overflow-y: auto;
}

.tree-node-content {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.no-role-selected {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  background-color: #f5f7fa;
  border-radius: 8px;
  border: 1px dashed #dcdfe6;
}

/* 滚动条样式 */
.permission-tree::-webkit-scrollbar {
  width: 8px;
}

.permission-tree::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 4px;
}

.permission-tree::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 4px;
}

.permission-tree {
  scrollbar-width: 8px;
  scrollbar-color: #dcdfe6 #f5f7fa;
}
</style>