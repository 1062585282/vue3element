<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-header">
        <h2>System Login</h2>
        <p>Please select login method</p>
      </div>
      
      <!-- 登录方式切换 -->
      <div class="login-tabs">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="login-tabs-container">
          <el-tab-pane label="Token Login" name="token" />
          <el-tab-pane label="SSO Login" name="sso" />
        </el-tabs>
      </div>
      

      
      <!-- Token Login Form -->
      <el-form
        v-if="activeTab === 'token'"
        :model="tokenForm"
        :rules="tokenRules"
        ref="tokenFormRef"
        class="login-form"
        label-position="top"
      >
        <el-form-item label="Token" prop="token">
          <el-input
            v-model="tokenForm.token"
            type="textarea"
            placeholder="Please paste Token"
            :prefix-icon="Key"
            size="large"
            :rows="4"
          />
        </el-form-item>
        

        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleTokenLogin"
            size="large"
            class="login-button"
            :disabled="loading"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- SSO登录表单 -->
      <el-form
        v-else-if="activeTab === 'sso'"
        class="login-form"
        label-position="top"
      >
        <el-form-item>
          <div class="sso-login-info">
            <p>Click the button below to login with your SSO account</p>
            <p class="sso-note">You will be redirected to the SSO authentication page</p>
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSSOLogin"
            size="large"
            class="login-button"
            :disabled="loading"
          >
            {{ loading ? 'Logging in...' : 'Login with SSO' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 登录信息提示 -->
      <div v-if="loginMessage" class="login-message" :class="{ 'error': loginError }">
        {{ loginMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Key } from '@element-plus/icons-vue'
import { login as authLogin } from './authStore'

// 响应式数据
const activeTab = ref('token')
const loading = ref(false)
const loginMessage = ref('')
const loginError = ref(false)

// 表单引用
const tokenFormRef = ref(null)

// Token登录表单
const tokenForm = reactive({
  token: ''
})

// 表单验证规则
const tokenRules = {
  token: [
    { required: true, message: 'Please enter Token', trigger: 'blur' },
    { min: 10, message: 'Token length should be at least 10 characters', trigger: 'blur' }
  ]
}

// 处理标签切换
const handleTabClick = () => {
  loginMessage.value = ''
  loginError.value = false
}

// 处理Token登录
const handleTokenLogin = async () => {
  if (!tokenFormRef.value) return
  
  tokenFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      loginMessage.value = ''
      
      try {
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟登录成功
        if (tokenForm.token.includes('Bearer')) {
          loginSuccess('Token login successful')
        } else {
          throw new Error('Invalid Token format')
        }
      } catch (error) {
        loginFailure(error.message)
      } finally {
        loading.value = false
      }
    }
  })
}

// 处理SSO登录
const handleSSOLogin = async () => {
  loading.value = true
  loginMessage.value = ''
  
  try {
    // 模拟SSO登录请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟SSO登录成功
    loginSuccess('SSO login successful')
  } catch (error) {
    loginFailure(error.message || 'SSO login failed')
  } finally {
    loading.value = false
  }
}

// 登录成功处理
const loginSuccess = (message) => {
  loginMessage.value = message
  loginError.value = false
  ElMessage.success(message)
  
  // 调用登录状态管理
  if (activeTab.value === 'token') {
    authLogin(null, tokenForm)
  } else if (activeTab.value === 'sso') {
    // SSO登录处理
    authLogin({ type: 'sso' }, null)
  }
  
  // 这里可以添加实际的登录逻辑，如存储token、跳转到首页等
  setTimeout(() => {
    // 模拟跳转到首页
    console.log('Login successful, redirecting to homepage')
  }, 1000)
}

// 登录失败处理
const loginFailure = (message) => {
  loginMessage.value = message
  loginError.value = true
  ElMessage.error(message)
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-image: url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=HSBC%20bank%20logo%20on%20white%20background%2C%20clean%20professional%20corporate%20style&image_size=landscape_16_9');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1;
}

.login-form-wrapper {
  position: relative;
  z-index: 2;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 480px;
  animation: slideIn 0.6s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.login-header p {
  margin: 0;
  font-size: 16px;
  color: #909399;
}

.login-tabs {
  margin-bottom: 30px;
}

.login-tabs-container {
  width: 100%;
}

.login-form {
  width: 100%;
}

.login-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
}

.forgot-password {
  float: right;
  margin-top: 8px;
}

.login-message {
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  transition: all 0.3s ease;
}

.login-message.error {
  background-color: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
}

.login-message:not(.error) {
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-form-wrapper {
    padding: 30px 20px;
    margin: 0 10px;
  }
  
  .login-header h2 {
    font-size: 24px;
  }
  
  .login-header p {
    font-size: 14px;
  }
}

/* 输入框样式增强 */
:deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 2px rgba(78, 120, 116, 0.1) !important;
}

:deep(.el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 2px rgba(78, 120, 116, 0.3) !important;
  border-color: #4e7874 !important;
}

/* 按钮样式增强 */
:deep(.el-button--primary) {
  background: #4e7874;
  border: none;
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(78, 120, 116, 0.4);
}

:deep(.el-button--primary:active) {
  transform: translateY(0);
}

/* 标签样式 */
:deep(.el-tabs__active-bar) {
  background: #4e7874;
  height: 3px;
}

:deep(.el-tabs__item.is-active) {
  color: #4e7874 !important;
  font-weight: 500;
}

:deep(.el-tabs__item:hover) {
  color: #4e7874 !important;
}
</style>