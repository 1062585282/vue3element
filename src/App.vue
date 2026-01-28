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
          <el-menu-item index="module" :icon="Grid">
            Module Management
          </el-menu-item>
          <el-menu-item index="menu" :icon="Menu">
            Menu Management
          </el-menu-item>
          <el-menu-item index="role" :icon="UserFilled">
            Role Management
          </el-menu-item>
          <el-menu-item index="form-design" :icon="EditPen">
            Form Design
          </el-menu-item>
          <el-menu-item index="staff-management" :icon="User">
            Staff Management
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 右侧内容 -->
      <el-main style="padding: 20px; overflow: auto;">
        <component :is="currentComponent" />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Grid, Menu, EditPen, User, UserFilled } from '@element-plus/icons-vue'
import ModuleManagement from './components/module/ModuleManagement.vue'
import MenuManagement from './components/menu/MenuManagement.vue'
import FormDesign from './components/unit/FormDesign.vue'
import StaffManagement from './components/unit/StaffManagement.vue'
import RoleManagement from './components/role/RoleManagement.vue'

const activeMenu = ref('menu')

// 组件映射
const componentMap = {
  'module': ModuleManagement,
  'menu': MenuManagement,
  'role': RoleManagement,
  'form-design': FormDesign,
  'staff-management': StaffManagement
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
