<template>
  <div class="role-list-section">
    <h3>Roles</h3>
    <div class="role-search">
      <el-input
        v-model="roleSearchQuery"
        placeholder="Search by name or code"
        clearable
        @input="handleRoleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    <div class="role-list">
      <div
        v-for="role in filteredRoles"
        :key="role.id"
        :class="['role-item', { 'active': selectedRole && selectedRole.id === role.id }]"
        @click="selectRole(role)"
      >
        <div class="role-name">{{ role.name }}</div>
        <div class="role-code">{{ role.code }}</div>
        <div class="role-description">{{ role.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'

export default {
  name: 'RoleList',
  props: {
    roles: {
      type: Array,
      default: () => []
    },
    selectedRole: {
      type: Object,
      default: null
    }
  },
  emits: ['role-select'],
  data() {
    return {
      roleSearchQuery: ''
    }
  },
  computed: {
    filteredRoles() {
      if (!this.roleSearchQuery) {
        return this.roles
      }
      
      const query = this.roleSearchQuery.toLowerCase()
      return this.roles.filter(role => 
        role.name.toLowerCase().includes(query) ||
        role.code.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    handleRoleSearch() {
      // 搜索逻辑已在computed属性中处理
    },
    selectRole(role) {
      this.$emit('role-select', role)
    }
  }
}
</script>

<style scoped>
.role-list-section {
  width: 300px;
  flex-shrink: 0;
}

.role-list-section h3 {
  margin-bottom: 16px;
  color: #666;
}

.role-search {
  margin-bottom: 16px;
}

.role-search .el-input {
  width: 100%;
}

.role-list {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fff;
  max-height: 450px;
  overflow-y: auto;
}

.role-item {
  padding: 16px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.role-item:hover {
  background-color: #f5f7fa;
}

.role-item.active {
  background-color: #ecf5ff;
  border-left: 4px solid #409eff;
}

.role-item:last-child {
  border-bottom: none;
}

.role-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}

.role-code {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.role-description {
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}
</style>