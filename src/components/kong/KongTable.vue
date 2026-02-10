<template>
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
        <el-button type="primary" size="small" @click="$emit('edit-service', scope.row)">
          Edit
        </el-button>
        <el-button type="danger" size="small" @click="$emit('delete-service', scope.row.id)">
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
                <el-button type="primary" size="small" @click="$emit('edit-route', routeScope.row, scope.row.id)">
                  Edit
                </el-button>
                <el-button type="danger" size="small" @click="$emit('delete-route', routeScope.row.id, scope.row.id)">
                  Delete
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 定义 props
const props = defineProps({
  services: {
    type: Array,
    default: () => []
  }
})

// 定义 events
const emit = defineEmits([
  'edit-service',
  'delete-service',
  'edit-route',
  'delete-route'
])

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}
</script>

<style scoped>
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
</style>