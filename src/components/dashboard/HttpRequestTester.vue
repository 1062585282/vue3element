<template>
  <el-card shadow="false" class="http-request-tester">
    <h3>HTTP Request Tester</h3>
    <el-form :model="form" label-width="100px" class="request-form">
      <!-- 请求方法选择 -->
      <el-form-item label="Method">
        <el-select v-model="form.method" placeholder="Select HTTP method">
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
          <el-option label="PUT" value="PUT" />
          <el-option label="DELETE" value="DELETE" />
        </el-select>
      </el-form-item>
      
      <!-- 请求URL -->
      <el-form-item label="URL">
        <el-input
          v-model="form.url"
          placeholder="Enter request URL (e.g., http://localhost:3000/api)"
          class="url-input"
        />
      </el-form-item>
      
      <!-- 请求头 -->
      <el-form-item label="Headers">
        <el-input
          v-model="form.headers"
          placeholder="Enter headers as JSON (optional)"
          type="textarea"
          :rows="3"
          class="headers-input"
        />
      </el-form-item>
      
      <!-- 请求体 -->
      <el-form-item label="Body" v-if="['POST', 'PUT'].includes(form.method)">
        <el-input
          v-model="form.body"
          placeholder="Enter request body as JSON (optional)"
          type="textarea"
          :rows="5"
          class="body-input"
        />
      </el-form-item>
      
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button 
          type="primary" 
          @click="sendRequest" 
          :loading="loading"
        >
          Send Request
        </el-button>
        <el-button @click="resetForm">Reset</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 响应结果 -->
    <div v-if="response" class="response-container">
      <h4>Response</h4>
      <div class="response-status" :class="response.success ? 'success' : 'error'">
        {{ response.status }} - {{ response.statusText }}
      </div>
      <div class="response-body">
        <pre>{{ formattedResponse }}</pre>
      </div>
      <div class="response-time">
        Response time: {{ response.time }}ms
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const form = ref({
  method: 'GET',
  url: '',
  headers: '',
  body: ''
})
const loading = ref(false)
const response = ref(null)

// 格式化响应数据
const formattedResponse = computed(() => {
  if (!response.value || !response.value.data) return ''
  try {
    return JSON.stringify(response.value.data, null, 2)
  } catch (e) {
    return response.value.data
  }
})

// 发送请求
const sendRequest = async () => {
  if (!form.value.url) {
    ElMessage.error('Please enter request URL')
    return
  }
  
  loading.value = true
  response.value = null
  
  try {
    const startTime = Date.now()
    
    // 解析请求头
    let headers = {}
    if (form.value.headers) {
      try {
        headers = JSON.parse(form.value.headers)
      } catch (e) {
        ElMessage.warning('Invalid headers format, using default headers')
      }
    }
    
    // 解析请求体
    let body = null
    if (['POST', 'PUT'].includes(form.value.method) && form.value.body) {
      try {
        body = JSON.parse(form.value.body)
      } catch (e) {
        ElMessage.warning('Invalid body format, sending as plain text')
        body = form.value.body
      }
    }
    
    // 模拟请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟响应
    const mockResponse = {
      success: true,
      status: 200,
      statusText: 'OK',
      data: {
        message: `Mock ${form.value.method} request successful!`,
        url: form.value.url,
        method: form.value.method,
        timestamp: new Date().toISOString(),
        headers: headers,
        body: body
      },
      time: Date.now() - startTime
    }
    
    // 模拟错误情况
    if (form.value.url.includes('error')) {
      mockResponse.success = false
      mockResponse.status = 404
      mockResponse.statusText = 'Not Found'
      mockResponse.data = {
        error: 'Resource not found',
        url: form.value.url
      }
    }
    
    response.value = mockResponse
    ElMessage.success('Request sent successfully!')
  } catch (error) {
    response.value = {
      success: false,
      status: 500,
      statusText: 'Internal Server Error',
      data: {
        error: error.message
      },
      time: 0
    }
    ElMessage.error('Error sending request')
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  form.value = {
    method: 'GET',
    url: '',
    headers: '',
    body: ''
  }
  response.value = null
}
</script>

<style scoped>
.http-request-tester {
  margin-top: 30px;
}

.http-request-tester h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #666;
}

.request-form {
  margin-bottom: 30px;
}

.url-input {
  width: 100%;
}

.headers-input,
.body-input {
  width: 100%;
  font-family: monospace;
  font-size: 12px;
}

.response-container {
  margin-top: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.response-container h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #666;
}

.response-status {
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-weight: 500;
}

.response-status.success {
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
}

.response-status.error {
  background-color: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
}

.response-body {
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
  max-height: 300px;
  overflow: auto;
}

.response-body pre {
  margin: 0;
  font-family: monospace;
  font-size: 12px;
  color: #333;
}

.response-time {
  font-size: 12px;
  color: #909399;
  text-align: right;
}
</style>