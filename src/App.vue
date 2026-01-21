<template>
  <div id="app">
    <el-tabs v-model="activeTab" class="main-tabs">
      <el-tab-pane label="Module Management" name="module">
        <ModuleManagement />
      </el-tab-pane>
      <el-tab-pane label="Menu Management" name="menu">
        <MenuManagement />
      </el-tab-pane>
      <el-tab-pane label="Form Design" name="form-design">
        <FormDesign />
      </el-tab-pane>
      <el-tab-pane label="Staff Management" name="staff-management">
        <StaffManagement />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModuleManagement from './components/module/ModuleManagement.vue'
import MenuManagement from './components/menu/MenuManagement.vue'
import FormDesign from './components/unit/FormDesign.vue'
import StaffManagement from './components/unit/StaffManagement.vue'

const activeTab = ref('menu')
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

.main-tabs {
  padding: 20px;
}

:deep(.el-tabs__content) {
  height: calc(100% - 55px);
  overflow: auto;
}

:deep(.el-tabs__content)::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

:deep(.el-tabs__content)::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 4px;
}

:deep(.el-tabs__content)::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

:deep(.el-tabs__content)::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 4px;
}

:deep(.el-tabs__content) {
  scrollbar-width: 8px;
  scrollbar-color: #dcdfe6 #f5f7fa;
  scrollbar-track-color: #f5f7fa;
}

:deep(.el-tabs__content)::-ms-overflow-style {
  scrollbar-width: 8px;
  scrollbar-color: #dcdfe6 #f5f7fa;
  scrollbar-track-color: #f5f7fa;
}
</style>
