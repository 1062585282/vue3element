<template>
  <el-card shadow="false" class="staff-management">
    <div class="management-header">
      <div class="header-content">
        <el-input
          v-model="searchQuery"
          placeholder="Search by Staff ID or Name"
          prefix-icon="Search"
          clearable
          @input="handleSearch"
          class="search-input"
        />
        <div class="header-buttons">
          <el-button :icon="Refresh" @click="loadStaffs">Refresh</el-button>
          <el-button type="primary" :icon="Plus">Add Staff</el-button>
        </div>
      </div>
    </div>
    
    <!-- 员工表格 -->
    <el-table
      :data="staffs"
      v-loading="loading"
      stripe
      border
      style="width: 100%"
      row-key="staffId"
    >
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="expanded-form">
            <el-form :model="row" label-position="right" label-width="200px" class="staff-form">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="Staff ID">
                    <el-input v-model="row.staffId" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Staff Name">
                    <el-input v-model="row.staffName" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="Email">
                    <el-input v-model="row.email" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Mobile Tel Num">
                    <el-input v-model="row.mobileTelNum" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="Company">
                    <el-input v-model="row.company" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Department">
                    <el-input v-model="row.department" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="Job Title">
                    <el-input v-model="row.jobTitle" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Entity Manager">
                    <el-input v-model="row.entityManager" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="Entity Manager ID">
                    <el-input v-model="row.entityManagerId" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Function Manager">
                    <el-input v-model="row.functionManager" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="Function Manager ID">
                    <el-input v-model="row.functionManagerId" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </template>
      </el-table-column>
      
      <!-- 基本信息列 -->
      <el-table-column prop="staffId" label="Staff ID" min-width="120" />
      <el-table-column prop="staffName" label="Staff Name" min-width="150" />
      <el-table-column prop="email" label="Email" min-width="200" />
      <el-table-column prop="department" label="Department" min-width="120" />
      <el-table-column prop="jobTitle" label="Job Title" min-width="120" />
      
      <!-- 操作列 -->
      <el-table-column label="Actions" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" :icon="Edit">Edit</el-button>
          <el-button type="danger" size="small" :icon="DeleteIcon">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalStaffs"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, RefreshRight as Refresh, Search, Edit, Delete as DeleteIcon } from '@element-plus/icons-vue'
import { get } from '../../utils/request.js'
import { DEFAULT_STAFFS } from '../../constants/mockData.js'

// 员工数据
const staffs = ref([])
const totalStaffs = ref(0)
const loading = ref(false)
const searchQuery = ref('')

// 分页数据
const pagination = ref({
  currentPage: 1,
  pageSize: 10
})

// 加载员工数据
const loadStaffs = async () => {
  loading.value = true
  try {
    // 模拟API调用，传递分页参数和searchQuery
    const params = {
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
      search: searchQuery.value
    }
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 使用模拟数据模拟API返回
    let filteredData = [...DEFAULT_STAFFS]
    
    // 模拟API搜索
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filteredData = filteredData.filter(staff => {
        return (
          staff.staffId.toLowerCase().includes(query) ||
          staff.staffName.toLowerCase().includes(query)
        )
      })
    }
    
    // 模拟API分页
    totalStaffs.value = filteredData.length
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    staffs.value = filteredData.slice(start, end)
    
  } catch (error) {
    console.error('Failed to load staffs:', error)
    // 出错时使用模拟数据
    staffs.value = DEFAULT_STAFFS
    totalStaffs.value = DEFAULT_STAFFS.length
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  // 重置到第一页
  pagination.value.currentPage = 1
  // 重新加载数据
  loadStaffs()
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  pagination.value.currentPage = 1
  // 重新加载数据
  loadStaffs()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  pagination.value.currentPage = page
  // 重新加载数据
  loadStaffs()
}

// 初始化
onMounted(() => {
  loadStaffs()
})
</script>

<style scoped>
.staff-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
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

.header-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.expanded-form {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 4px;
}

.staff-form {
  margin: 0;
}

.staff-form .el-row {
  margin-bottom: 15px;
}

.staff-form .el-row:last-child {
  margin-bottom: 0;
}

.staff-form .el-form-item {
  margin-bottom: 0;
}

.staff-form .el-form-item__label {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.staff-form .el-form-item__content {
  overflow: hidden;
}

/* 表格样式，与ModuleTable保持一致 */
:deep(.el-table th) {
  background-color: #f5f7fa !important;
}

:deep(.el-table__row) {
  height: 40px !important;
}

:deep(.el-table td) {
  padding: 8px 0 !important;
}
</style>