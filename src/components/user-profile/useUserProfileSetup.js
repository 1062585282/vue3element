import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 业务单元选项
export const businessUnitOptions = [
  { value: 'Sales', label: 'Sales', roles: ['Sales Manager', 'Sales Representative', 'Sales Associate'] },
  { value: 'Marketing', label: 'Marketing', roles: ['Marketing Manager', 'Marketing Specialist', 'Content Creator'] },
  { value: 'Finance', label: 'Finance', roles: ['Finance Manager', 'Accountant', 'Financial Analyst'] },
  { value: 'Human Resources', label: 'Human Resources', roles: ['HR Manager', 'HR Specialist', 'Recruiter'] },
  { value: 'IT', label: 'IT', roles: ['IT Manager', 'Developer', 'System Administrator', 'Help Desk'] },
  { value: 'Operations', label: 'Operations', roles: ['Operations Manager', 'Operations Coordinator', 'Logistics Specialist'] },
  { value: 'Customer Service', label: 'Customer Service', roles: ['CS Manager', 'CS Representative', 'Support Specialist'] },
  { value: 'Product Management', label: 'Product Management', roles: ['Product Manager', 'Product Specialist', 'UX Designer'] }
]

// 状态选项
export const statusOptions = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' }
]

// Mock数据
export const mockRequests = ref([
  { 
    id: 'REQ_001', 
    requester: 'John Doe', 
    requestDate: '2026-03-20T10:00:00', 
    status: 'Approved', 
    approverRejecter: 'Alice Smith', 
    approverRejecterDate: '2026-03-21T14:30:00',
    businessUnit: 'Sales',
    roles: ['Sales Manager', 'Sales Representative']
  },
  { 
    id: 'REQ_002', 
    requester: 'Jane Smith', 
    requestDate: '2026-03-21T09:15:00', 
    status: 'Pending', 
    approverRejecter: null, 
    approverRejecterDate: null,
    businessUnit: 'Marketing',
    roles: ['Marketing Manager', 'Content Creator']
  },
  { 
    id: 'REQ_003', 
    requester: 'Bob Johnson', 
    requestDate: '2026-03-22T11:30:00', 
    status: 'Rejected', 
    approverRejecter: 'Alice Smith', 
    approverRejecterDate: '2026-03-23T09:45:00',
    businessUnit: 'Finance',
    roles: ['Finance Manager']
  },
  { 
    id: 'REQ_004', 
    requester: 'Sarah Wilson', 
    requestDate: '2026-03-23T14:00:00', 
    status: 'Approved', 
    approverRejecter: 'Michael Brown', 
    approverRejecterDate: '2026-03-24T10:15:00',
    businessUnit: 'IT',
    roles: ['IT Manager', 'Developer']
  },
  { 
    id: 'REQ_005', 
    requester: 'David Lee', 
    requestDate: '2026-03-24T10:30:00', 
    status: 'Pending', 
    approverRejecter: null, 
    approverRejecterDate: null,
    businessUnit: 'Human Resources',
    roles: ['HR Specialist']
  },
  { 
    id: 'REQ_006', 
    requester: 'Emma Davis', 
    requestDate: '2026-03-25T08:45:00', 
    status: 'Approved', 
    approverRejecter: 'Michael Brown', 
    approverRejecterDate: '2026-03-25T11:00:00',
    businessUnit: 'Operations',
    roles: ['Operations Manager', 'Logistics Specialist']
  },
  { 
    id: 'REQ_007', 
    requester: 'Tom Wilson', 
    requestDate: '2026-03-26T10:00:00', 
    status: 'Draft', 
    approverRejecter: null, 
    approverRejecterDate: null,
    businessUnit: 'Customer Service',
    roles: ['CS Representative']
  },
  { 
    id: 'REQ_008', 
    requester: 'Lisa Chen', 
    requestDate: '2026-03-26T11:30:00', 
    status: 'Draft', 
    approverRejecter: null, 
    approverRejecterDate: null,
    businessUnit: 'Product Management',
    roles: ['Product Manager', 'UX Designer']
  }
])

export function useUserProfileSetup() {
  const loading = ref(false)
  const searchQuery = ref('')
  const selectedStatus = ref('')
  const pagination = ref({
    currentPage: 1,
    pageSize: 10
  })
  
  const showAddForm = ref(false)
  
  const addForm = ref({
    id: '',
    requester: '',
    requestDate: new Date().toISOString(),
    status: 'Draft',
    approverRejecter: '',
    approverRejecterDate: null,
    selectedBusinessUnit: '',
    selectedRoles: []
  })
  
  // 过滤请求
  const filteredRequests = computed(() => {
    let result = [...mockRequests.value]
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(req => 
        req.requester.toLowerCase().includes(query) ||
        req.id.toLowerCase().includes(query)
      )
    }
    
    if (selectedStatus.value) {
      result = result.filter(req => req.status === selectedStatus.value)
    }
    
    return result
  })
  
  // 分页请求
  const paginatedRequests = computed(() => {
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    return filteredRequests.value.slice(start, end)
  })
  
  // 可用角色
  const availableRoles = computed(() => {
    if (!addForm.value.selectedBusinessUnit) {
      return []
    }
    const businessUnitOption = businessUnitOptions.find(option => option.value === addForm.value.selectedBusinessUnit)
    return businessUnitOption ? businessUnitOption.roles : []
  })
  
  // 加载请求
  const loadRequests = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      loading.value = false
    }
  }
  
  // 处理搜索
  const handleSearch = () => {
    pagination.value.currentPage = 1
    loadRequests()
  }
  
  // 处理分页大小变化
  const handleSizeChange = (size) => {
    pagination.value.pageSize = size
    pagination.value.currentPage = 1
  }
  
  // 处理页码变化
  const handleCurrentChange = (page) => {
    pagination.value.currentPage = page
  }
  
  // 获取状态标签类型
  const getStatusTag = (status) => {
    switch (status) {
      case 'Approved': return 'success'
      case 'Rejected': return 'danger'
      case 'Pending': return 'warning'
      default: return 'info'
    }
  }
  
  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // 打开添加表单
  const openAddForm = () => {
    showAddForm.value = true
    // 重置表单
    addForm.value = {
      id: '',
      requester: 'Current User',
      requestDate: new Date().toISOString(),
      status: 'Draft',
      approverRejecter: '',
      approverRejecterDate: null,
      selectedBusinessUnit: '',
      selectedRoles: []
    }
  }
  
  // 取消添加表单
  const cancelAddForm = () => {
    showAddForm.value = false
  }
  
  // 处理业务单元变化
  const handleBusinessUnitChange = () => {
    // 重置角色当业务单元变化时
    addForm.value.selectedRoles = []
  }
  
  // 提交添加表单
  const submitAddForm = async (formRef) => {
    if (!formRef) return
    
    try {
      await formRef.validate()
      
      // 创建请求对象
      const requestData = {
        ...addForm.value,
        businessUnit: addForm.value.selectedBusinessUnit,
        roles: addForm.value.selectedRoles
      }
      
      // 移除不必要的字段
      delete requestData.selectedBusinessUnit
      delete requestData.selectedRoles
      
      const index = mockRequests.value.findIndex(r => r.id === addForm.value.id)
      if (index > -1) {
        // 编辑现有请求
        mockRequests.value[index] = requestData
        ElMessage.success('Request updated successfully!')
      } else {
        // 生成新ID
        const timestamp = Date.now()
        requestData.id = `REQ_${String(timestamp).slice(-6).padStart(6, '0')}`
        
        // 添加新请求
        mockRequests.value.push(requestData)
        ElMessage.success('Request added successfully!')
      }
      
      // 重置表单并返回列表
      showAddForm.value = false
      loadRequests()
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }
  
  // 处理编辑
  const handleEdit = (row) => {
    if (row.status !== 'Draft') {
      ElMessage.warning('Only draft requests can be edited')
      return
    }
    showAddForm.value = true
    addForm.value = {
      ...row,
      selectedBusinessUnit: row.businessUnit || '',
      selectedRoles: row.roles || []
    }
  }
  
  // 处理批准
  const handleApprove = (row) => {
    const index = mockRequests.value.findIndex(r => r.id === row.id)
    if (index > -1) {
      mockRequests.value[index] = {
        ...row,
        status: 'Approved',
        approverRejecter: 'Current User',
        approverRejecterDate: new Date().toISOString()
      }
      ElMessage.success('Request approved successfully!')
      loadRequests()
    }
  }
  
  // 处理拒绝
  const handleReject = (row) => {
    const index = mockRequests.value.findIndex(r => r.id === row.id)
    if (index > -1) {
      mockRequests.value[index] = {
        ...row,
        status: 'Rejected',
        approverRejecter: 'Current User',
        approverRejecterDate: new Date().toISOString()
      }
      ElMessage.success('Request rejected successfully!')
      loadRequests()
    }
  }
  
  return {
    loading,
    searchQuery,
    selectedStatus,
    pagination,
    showAddForm,
    addForm,
    filteredRequests,
    paginatedRequests,
    availableRoles,
    businessUnitOptions,
    statusOptions,
    loadRequests,
    handleSearch,
    handleSizeChange,
    handleCurrentChange,
    getStatusTag,
    formatDate,
    openAddForm,
    cancelAddForm,
    handleBusinessUnitChange,
    submitAddForm,
    handleEdit,
    handleApprove,
    handleReject
  }
}
