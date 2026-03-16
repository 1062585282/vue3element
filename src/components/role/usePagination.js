import { ref } from 'vue'

export function usePagination(defaultPageSize = 10) {
  const currentPage = ref(1)
  const pageSize = ref(defaultPageSize)

  const reset = () => {
    currentPage.value = 1
    pageSize.value = defaultPageSize
  }

  const paginate = (data) => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return data.slice(start, end)
  }

  return {
    currentPage,
    pageSize,
    reset,
    paginate
  }
}
