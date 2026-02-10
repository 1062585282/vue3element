<template>
  <div id="app">
    <el-container style="height: 100vh;">
      <!-- 左侧菜单 -->
      <el-aside width="220px" style="background-color: #fff; border-right: 1px solid #e4e7ed;">
        <el-menu
          :default-active="activeMenu"
          class="app-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard" :icon="DataLine">
            Dashboard
          </el-menu-item>
          <el-menu-item index="kong" :icon="Link">
            Kong Management
          </el-menu-item>
          <el-menu-item index="module" :icon="Grid">
            Module Management
          </el-menu-item>
          <el-menu-item index="menu" :icon="Menu">
            Menu Management
          </el-menu-item>
          <el-menu-item index="role" :icon="UserFilled">
            Role Management
          </el-menu-item>
          <el-menu-item index="permission" :icon="Lock">
            Permission Management
          </el-menu-item>
          <el-menu-item index="form-design" :icon="EditPen">
            Form Design
          </el-menu-item>
          <el-menu-item index="staff-management" :icon="User">
            Staff Management
          </el-menu-item>
          <el-menu-item index="login" :icon="Key">
            Login
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 右侧内容 -->
      <el-main style="padding: 20px; overflow: auto;">
        <Suspense>
          <template #default>
            <component :is="currentComponent" />
          </template>
          <template #fallback>
            <div v-loading="true">Loading...</div>
          </template>
        </Suspense>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { Grid, Menu, EditPen, User, UserFilled, Lock, DataLine, Key } from '@element-plus/icons-vue'

const activeMenu = ref('menu')

// 使用本地异步组件加载（开发模式）
const ModuleManagement = defineAsyncComponent(() => 
  import('./components/module/ModuleManagement.vue')
)
const MenuManagement = defineAsyncComponent(() => 
  import('./components/menu/MenuManagement.vue')
)
const RoleManagement = defineAsyncComponent(() => 
  import('./components/role/RoleManagement.vue')
)
const FormDesign = defineAsyncComponent(() => 
  import('./components/unit/FormDesign.vue')
)
const StaffManagement = defineAsyncComponent(() => 
  import('./components/unit/StaffManagement.vue')
)
const PermissionManagement = defineAsyncComponent(() => 
  import('./components/permission/PermissionManagement.vue')
)
const Dashboard = defineAsyncComponent(() => 
  import('./components/dashboard/Dashboard.vue')
)
const KongManagement = defineAsyncComponent(() => 
  import('./components/kong/KongManagement.vue')
)
const Login = defineAsyncComponent(() => 
  import('./components/auth/Login.vue')
)

// 组件映射
const componentMap = {
  'dashboard': Dashboard,
  'kong': KongManagement,
  'module': ModuleManagement,
  'menu': MenuManagement,
  'role': RoleManagement,
  'permission': PermissionManagement,
  'form-design': FormDesign,
  'staff-management': StaffManagement,
  'login': Login
}

// 当前显示的组件
const currentComponent = computed(() => {
  return componentMap[activeMenu.value]
})

// 处理菜单选择
const handleMenuSelect = (index) => {
  activeMenu.value = index
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  background-color: #f5f7fa;
}

.app-menu {
  height: 100%;
  border-right: none;
}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
  overflow: auto;
}

/* 表格标题行样式 */
.el-table th {
  background-color: #f5f7fa !important;
}

/* 滚动条样式 */
.el-main::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.el-main::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 4px;
}

.el-main::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

.el-main::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 4px;
}

.el-main {
  scrollbar-width: 8px;
  scrollbar-color: #dcdfe6 #f5f7fa;
  scrollbar-track-color: #f5f7fa;
}

.el-main::-ms-overflow-style {
  scrollbar-width: 8px;
  scrollbar-color: #dcdfe6 #f5f7fa;
  scrollbar-track-color: #f5f7fa;
}
</style>
