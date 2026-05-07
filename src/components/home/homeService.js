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

export const fetchTaskStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockTaskStats
}

export const fetchApplicationStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockApplicationStats
}