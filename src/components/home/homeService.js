export const colorMap = {
  'Todo': '#95a5a6',
  'Claimable': '#e67e22',
  'Completed Today': '#27ae60',
  'In Progress': '#e67e22',
  'Ended': '#27ae60'
}

export const getColor = (status) => colorMap[status] || '#95a5a6'

const mockTaskStats = [
  { status: 'Todo', count: 5 },
  { status: 'Claimable', count: 12 },
  { status: 'Completed Today', count: 28 }
]

const mockApplicationStats = [
  { status: 'In Progress', count: 23 },
  { status: 'Ended', count: 12 }
]

const mockTaskDetails = [
  { id: 1, taskName: 'Task 1', functionUnitName: 'Unit A', initiator: 'John Doe', createTime: '2024-01-15 10:30' },
  { id: 2, taskName: 'Task 2', functionUnitName: 'Unit B', initiator: 'Jane Smith', createTime: '2024-01-15 11:00' },
  { id: 3, taskName: 'Task 3', functionUnitName: 'Unit A', initiator: 'Bob Johnson', createTime: '2024-01-14 09:15' },
  { id: 4, taskName: 'Task 4', functionUnitName: 'Unit C', initiator: 'Alice Williams', createTime: '2024-01-14 14:20' },
  { id: 5, taskName: 'Task 5', functionUnitName: 'Unit B', initiator: 'Charlie Brown', createTime: '2024-01-13 16:45' }
]

export const fetchTaskStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockTaskStats
}

export const fetchApplicationStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockApplicationStats
}

export const fetchTaskDetails = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockTaskDetails
}
