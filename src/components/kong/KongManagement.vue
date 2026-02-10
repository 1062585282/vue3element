<template>
  <el-card shadow="false" class="kong-management-container">
    <div class="kong-header">
      <h2>Kong Gateway Management</h2>
      <div class="header-actions">
        <el-button type="primary" @click="openAddServiceDialog" :icon="Plus">
          Add Service
        </el-button>
        <el-button type="success" @click="openAddRouteDialog" :icon="Link">
          Add Route
        </el-button>
      </div>
    </div>
    
    <div class="kong-content">
      <!-- Service列表 -->
      <el-table
        :data="services"
        style="width: 100%"
        class="service-table"
      >
        <el-table-column prop="name" label="Service Name" width="200">
          <template #default="scope">
            <div class="service-name">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="URL" min-width="300">
          <template #default="scope">
            <div class="service-url">{{ scope.row.url }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="Created At" width="200">
          <template #default="scope">
            <div class="service-date">{{ formatDate(scope.row.created_at) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="routes.length" label="Routes" width="100">
          <template #default="scope">
            <div class="service-routes-count">{{ scope.row.routes.length }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEditService(scope.row)">
              Edit
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteService(scope.row.id)">
              Delete
            </el-button>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template #default="scope">
            <div class="route-list">
              <h4>Routes for {{ scope.row.name }}</h4>
              <el-table
                :data="scope.row.routes"
                style="width: 100%"
                class="route-table"
              >
                <el-table-column prop="name" label="Route Name" width="180">
                  <template #default="routeScope">
                    <div class="route-name">{{ routeScope.row.name || 'N/A' }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="paths" label="Paths" min-width="250">
                  <template #default="routeScope">
                    <div class="route-paths">
                      <span v-for="(path, index) in routeScope.row.paths" :key="index" class="path-tag">
                        {{ path }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="methods" label="Methods" width="200">
                  <template #default="routeScope">
                    <div class="route-methods">
                      <span v-for="(method, index) in routeScope.row.methods" :key="index" class="method-tag">
                        {{ method }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Actions" width="120" fixed="right">
                  <template #default="routeScope">
                    <el-button type="primary" size="small" @click="handleEditRoute(routeScope.row, scope.row.id)">
                      Edit
                    </el-button>
                    <el-button type="danger" size="small" @click="handleDeleteRoute(routeScope.row.id, scope.row.id)">
                      Delete
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 添加Service对话框 -->
    <AddServiceDialog
      v-model:visible="addServiceDialogVisible"
      @service-added="handleServiceAdded"
    />
    
    <!-- 添加Route对话框 -->
    <AddRouteDialog
      v-model:visible="addRouteDialogVisible"
      :services="services"
      @route-added="handleRouteAdded"
    />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Link } from '@element-plus/icons-vue'
import AddServiceDialog from './AddServiceDialog.vue'
import AddRouteDialog from './AddRouteDialog.vue'

// 响应式数据
const services = ref([])
const addServiceDialogVisible = ref(false)
const addRouteDialogVisible = ref(false)

// 加载服务数据
const loadServices = () => {
  // 模拟数据
  services.value = [
    {
      id: 'service_001',
      name: 'User Service',
      url: 'http://localhost:3001/users',
      created_at: new Date().toISOString(),
      routes: [
        {
          id: 'route_001',
          name: 'Get Users',
          paths: ['/users'],
          methods: ['GET'],
          service_id: 'service_001'
        },
        {
          id: 'route_002',
          name: 'Create User',
          paths: ['/users'],
          methods: ['POST'],
          service_id: 'service_001'
        }
      ]
    },
    {
      id: 'service_002',
      name: 'Product Service',
      url: 'http://localhost:3002/products',
      created_at: new Date().toISOString(),
      routes: [
        {
          id: 'route_003',
          name: 'Get Products',
          paths: ['/products'],
          methods: ['GET'],
          service_id: 'service_002'
        }
      ]
    },
    {
      id: 'service_003',
      name: 'Order Service',
      url: 'http://localhost:3003/orders',
      created_at: new Date().toISOString(),
      routes: []
    }
  ]
}

// 打开添加Service对话框
const openAddServiceDialog = () => {
  addServiceDialogVisible.value = true
}

// 打开添加Route对话框
const openAddRouteDialog = () => {
  addRouteDialogVisible.value = true
}

// 处理Service添加
const handleServiceAdded = (service) => {
  // 添加新Service到列表
  const newService = {
    id: `service_${Date.now()}`,
    name: service.name,
    url: service.url,
    created_at: new Date().toISOString(),
    routes: []
  }
  services.value.push(newService)
  ElMessage.success('Service added successfully!')
}

// 处理Route添加
const handleRouteAdded = (route) => {
  // 查找对应的Service并添加Route
  const service = services.value.find(s => s.id === route.service_id)
  if (service) {
    const newRoute = {
      id: `route_${Date.now()}`,
      name: route.name,
      paths: route.paths,
      methods: route.methods,
      service_id: route.service_id
    }
    service.routes.push(newRoute)
    ElMessage.success('Route added successfully!')
  }
}

// 编辑Service
const handleEditService = (service) => {
  console.log('Edit service:', service)
  ElMessage.info('Edit service functionality will be implemented soon!')
}

// 删除Service
const handleDeleteService = (serviceId) => {
  ElMessageBox.confirm('Are you sure you want to delete this service?', 'Warning', {
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    type: 'warning'
  }).then(() => {
    services.value = services.value.filter(s => s.id !== serviceId)
    ElMessage.success('Service deleted successfully!')
  }).catch(() => {
    // Canceled
  })
}

// 编辑Route
const handleEditRoute = (route, serviceId) => {
  console.log('Edit route:', route, 'Service:', serviceId)
  ElMessage.info('Edit route functionality will be implemented soon!')
}

// 删除Route
const handleDeleteRoute = (routeId, serviceId) => {
  ElMessageBox.confirm('Are you sure you want to delete this route?', 'Warning', {
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    type: 'warning'
  }).then(() => {
    const service = services.value.find(s => s.id === serviceId)
    if (service) {
      service.routes = service.routes.filter(r => r.id !== routeId)
      ElMessage.success('Route deleted successfully!')
    }
  }).catch(() => {
    // Canceled
  })
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 生命周期
onMounted(() => {
  loadServices()
})
</script>

<style scoped>
.kong-management-container {
  width: 100%;
  min-height: 600px;
}

.kong-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.kong-header h2 {
  margin: 0;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.kong-content {
  min-height: 500px;
}

.service-table {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.service-name {
  font-weight: 600;
  color: #333;
}

.service-url {
  color: #606266;
  font-size: 14px;
}

.service-date {
  color: #909399;
  font-size: 12px;
}

.service-routes-count {
  color: #409eff;
  font-weight: 500;
}

.route-list {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 10px;
}

.route-list h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #666;
}

.route-table {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.route-name {
  font-weight: 500;
  color: #333;
}

.route-paths {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.path-tag {
  background-color: #ecf5ff;
  color: #409eff;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.route-methods {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.method-tag {
  background-color: #f0f9eb;
  color: #67c23a;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .kong-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .header-actions {
    align-self: flex-end;
  }
}
</style>