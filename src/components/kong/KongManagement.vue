<template>
  <el-card shadow="false" class="management-container">
    <div class="management-header">
      <div class="header-content">
        <div class="header-actions">
          <el-button @click="loadServices">Refresh</el-button>
          <el-button type="primary" @click="openAddServiceDialog" :icon="Plus">
            Add Service
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
        @bind-route="handleBindRoute"
      />
    </div>
    
    <!-- 添加Service对话框 -->
    <AddServiceDialog
      v-model:visible="addServiceDialogVisible"
      @service-added="handleServiceAdded"
    />
    

  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import AddServiceDialog from './AddServiceDialog.vue'
import KongTable from './KongTable.vue'

// 响应式数据
const services = ref([])
const addServiceDialogVisible = ref(false)

// 加载服务数据
const loadServices = async () => {
  try {
    // 模拟API调用
    console.log('Loading services from Kong API...')
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟API响应数据
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
    
    console.log('Services loaded successfully:', services.value.length, 'services')
  } catch (error) {
    console.error('Error loading services:', error)
    ElMessage.error('Failed to load services from Kong API')
  }
}

// 打开添加Service对话框
const openAddServiceDialog = () => {
  addServiceDialogVisible.value = true
}

// 处理Service添加
const handleServiceAdded = async (service) => {
  try {
    // 模拟API调用
    console.log('Adding service to Kong API:', service)
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟API响应
    const newService = {
      id: `service_${Date.now()}`,
      name: service.name,
      url: service.url,
      created_at: new Date().toISOString(),
      routes: []
    }
    
    // 添加到本地列表
    services.value.push(newService)
    console.log('Service added successfully:', newService.id)
    ElMessage.success('Service added successfully!')
  } catch (error) {
    console.error('Error adding service:', error)
    ElMessage.error('Failed to add service to Kong API')
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

// 绑定Route
const handleBindRoute = async (service) => {
  try {
    // 模拟API调用
    console.log('Binding route to service:', service.id)
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟API响应 - 创建一个新的route
    const newRoute = {
      id: `route_${Date.now()}`,
      name: `Route for ${service.name}`,
      paths: [`/${service.name.toLowerCase().replace(' ', '-')}`],
      methods: ['GET', 'POST'],
      service_id: service.id
    }
    
    // 添加到本地列表
    const serviceIndex = services.value.findIndex(s => s.id === service.id)
    if (serviceIndex > -1) {
      services.value[serviceIndex].routes.push(newRoute)
      console.log('Route bound successfully:', newRoute.id)
      ElMessage.success('Route bound successfully!')
    } else {
      ElMessage.error('Service not found')
    }
  } catch (error) {
    console.error('Error binding route:', error)
    ElMessage.error('Failed to bind route to service')
  }
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