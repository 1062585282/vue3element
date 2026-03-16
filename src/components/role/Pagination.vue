<template>
  <div class="pagination-section">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @update:current-page="$emit('update:current-page', $event)"
      @update:page-size="$emit('update:page-size', $event)"
    />
  </div>
</template>

<script setup>
defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0
  }
})

defineEmits(['update:current-page', 'update:page-size'])
</script>

<style scoped>
.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
