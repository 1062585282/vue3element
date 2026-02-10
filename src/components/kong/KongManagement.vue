<template>
  <el-card shadow="false" class="management-container">
    <div class="management-header">
      <div class="header-content">
        <div class="header-actions">
          <el-button @click="loadServices">Refresh</el-button>
          <el-button type="primary" @click="openAddServiceDialog" :icon="Plus">
            Add Service
          </el-button>
          <el-button type="success" @click="openAddRouteDialog" :icon="Link">
            Add Route
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="management-content">
      <!-- Service列表 -->
      <KongTable
        :services="services"
        @edit-service="handleEditService"
        @delete-service="handleDeleteService"
        @edit-route="handleEditRoute"
        @delete-route="handleDeleteRoute"
      />
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
import KongTable from './KongTable.vue'

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



// 生命周期
onMounted(() => {
  loadServices()
})
</script>

<style scoped>
.management-container {
  width: 100%;
  min-height: 600px;
}

.management-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.header-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.management-content {
  min-height: 500px;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .header-actions {
    align-self: flex-end;
  }
}
</style>