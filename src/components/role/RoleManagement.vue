<template>
  <el-card shadow="false" class="role-management">
    <div class="management-header">
      <div class="header-content">
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="Search by Name or Code"
            clearable
            @input="handleSearch"
            class="search-input"
          />
          <el-select
            v-model="selectedType"
            placeholder="Filter by Type"
            clearable
            @change="handleSearch"
            class="type-select"
          >
            <el-option label="bund BU" :value="1" />
            <el-option label="unbund BU" :value="2" />
          </el-select>
        </div>
        <div class="header-buttons">
          <el-button @click="loadRoles">Refresh</el-button>
          <el-button type="primary">Add Role</el-button>
        </div>
      </div>
    </div>
    
    <el-table
      :data="roles"
      v-loading="loading"
      stripe
      border
      style="width: 100%"
      row-key="id"
    >
      <el-table-column prop="id" label="ID" min-width="100" />
      <el-table-column prop="name" label="Name" min-width="150" />
      <el-table-column prop="code" label="Code" min-width="120" />
      <el-table-column prop="type" label="Type" min-width="120">
        <template #default="{ row }">
          {{ typeMap[row.type] }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="Description" min-width="200" />
      
      <el-table-column label="Actions" width="160" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small">Edit</el-button>
          <el-button type="danger" size="small">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRoles"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'RoleManagement',
  data() {
    return {
      roles: [],
      totalRoles: 0,
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      searchQuery: '',
      selectedType: '',
      typeMap: {
        1: 'bund BU',
        2: 'unbund BU'
      },
      mockRoles: [
        {
          id: 'ROLE_001',
          name: 'Admin',
          code: 'ADMIN',
          type: 1,
          description: 'System administrator'
        },
        {
          id: 'ROLE_002',
          name: 'Manager',
          code: 'MANAGER',
          type: 1,
          description: 'Department manager'
        },
        {
          id: 'ROLE_003',
          name: 'User',
          code: 'USER',
          type: 2,
          description: 'Regular user'
        },
        {
          id: 'ROLE_004',
          name: 'Guest',
          code: 'GUEST',
          type: 2,
          description: 'Guest user'
        },
        {
          id: 'ROLE_005',
          name: 'HR Manager',
          code: 'HR_MANAGER',
          type: 1,
          description: 'HR department manager'
        },
        {
          id: 'ROLE_006',
          name: 'Finance Manager',
          code: 'FINANCE_MANAGER',
          type: 1,
          description: 'Finance department manager'
        },
        {
          id: 'ROLE_007',
          name: 'Developer',
          code: 'DEVELOPER',
          type: 2,
          description: 'Software developer'
        },
        {
          id: 'ROLE_008',
          name: 'Tester',
          code: 'TESTER',
          type: 2,
          description: 'Software tester'
        }
      ]
    }
  },
  mounted() {
    this.loadRoles()
  },
  methods: {
    loadRoles() {
      this.loading = true
      setTimeout(() => {
        // 先过滤数据
        let filteredData = [...this.mockRoles]
        
        // 根据搜索条件过滤
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase()
          filteredData = filteredData.filter(role => {
            return (
              role.name.toLowerCase().includes(query) ||
              role.code.toLowerCase().includes(query)
            )
          })
        }
        
        // 根据类型过滤
        if (this.selectedType) {
          filteredData = filteredData.filter(role => {
            return role.type === this.selectedType
          })
        }
        
        // 计算总数和分页
        this.totalRoles = filteredData.length
        const start = (this.pagination.currentPage - 1) * this.pagination.pageSize
        const end = start + this.pagination.pageSize
        this.roles = filteredData.slice(start, end)
        this.loading = false
      }, 500)
    },
    handleSearch() {
      // 重置到第一页
      this.pagination.currentPage = 1
      // 重新加载数据
      this.loadRoles()
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.pagination.currentPage = 1
      this.loadRoles()
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page
      this.loadRoles()
    }
  }
}
</script>

<style scoped>
.role-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.management-header {
  margin-bottom: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.search-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.type-select {
  width: 150px;
}

.header-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>