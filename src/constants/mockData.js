export const DEFAULT_MENUS = [
  {
    id: 'menu_001',
    parent_id: null,
    name: 'Dashboard',
    module: 'dashboard',
    text: 'Dashboard Overview',
    link: '/dashboard',
    active: true,
    seq: 1,
    icon: 'Odometer',
    children: [
      {
        id: 'menu_002',
        parent_id: 'menu_001',
        name: 'Overview',
        module: 'dashboard',
        text: 'Dashboard Overview',
        link: '/dashboard/overview',
        active: true,
        seq: 1,
        icon: 'DataLine'
      },
      {
        id: 'menu_003',
        parent_id: 'menu_001',
        name: 'Statistics',
        module: 'dashboard',
        text: 'Dashboard Statistics',
        link: '/dashboard/statistics',
        active: true,
        seq: 2,
        icon: 'TrendCharts'
      }
    ]
  },
  {
    id: 'menu_004',
    parent_id: null,
    name: 'System',
    module: 'system',
    text: 'System Management',
    link: '/system',
    active: true,
    seq: 2,
    icon: 'Setting',
    children: [
      {
        id: 'menu_005',
        parent_id: 'menu_004',
        name: 'User Management',
        module: 'system',
        text: 'User Management',
        link: '/system/users',
        active: true,
        seq: 1,
        icon: 'User'
      },
      {
        id: 'menu_006',
        parent_id: 'menu_004',
        name: 'Role Management',
        module: 'system',
        text: 'Role Management',
        link: '/system/roles',
        active: true,
        seq: 2,
        icon: 'UserFilled'
      }
    ]
  },
  {
    id: 'menu_007',
    parent_id: null,
    name: 'Settings',
    module: 'settings',
    text: 'Settings',
    link: '/settings',
    active: true,
    seq: 3,
    icon: 'Tools',
    children: [
      {
        id: 'menu_008',
        parent_id: 'menu_007',
        name: 'General',
        module: 'settings',
        text: 'General Settings',
        link: '/settings/general',
        active: true,
        seq: 1,
        icon: 'Operation'
      },
      {
        id: 'menu_009',
        parent_id: 'menu_007',
        name: 'Security',
        module: 'settings',
        text: 'Security Settings',
        link: '/settings/security',
        active: true,
        seq: 2,
        icon: 'Lock'
      }
    ]
  }
]

export const DEFAULT_MODULES = [
  {
    id: 'module_001',
    name: 'User Management',
    category: 'portal',
    version: '1.0.0',
    file: 'user-management.js',
    type: 'component',
    tab: 'portal',
    entry: false,
    created_at: '2024-01-01 10:00:00',
    created_by: 'admin',
    updated_at: '2024-01-01 10:00:00',
    updated_by: 'admin'
  },
  {
    id: 'module_002',
    name: 'Statistics',
    category: 'portal',
    version: '1.2.0',
    file: 'statistics.js',
    type: 'lib',
    tab: 'portal',
    entry: false,
    created_at: '2024-01-02 14:30:00',
    created_by: 'admin',
    updated_at: '2024-01-05 09:15:00',
    updated_by: 'admin'
  },
  {
    id: 'module_003',
    name: 'System Configuration',
    category: 'admin_center',
    version: '2.0.0',
    file: 'system-config.js',
    type: 'component',
    tab: 'admin_center',
    entry: true,
    created_at: '2024-01-03 11:20:00',
    created_by: 'admin',
    updated_at: '2024-01-10 16:45:00',
    updated_by: 'admin'
  },
  {
    id: 'module_004',
    name: 'Permission Management',
    category: 'admin_center',
    version: '1.5.0',
    file: 'permission.js',
    type: 'lib',
    tab: 'admin_center',
    entry: false,
    created_at: '2024-01-04 08:00:00',
    created_by: 'admin',
    updated_at: '2024-01-08 13:20:00',
    updated_by: 'admin'
  },
  {
    id: 'module_005',
    name: 'Workstation',
    category: 'workstation',
    version: '1.0.0',
    file: 'workstation.js',
    type: 'component',
    tab: 'workstation',
    entry: true,
    created_at: '2024-01-05 15:30:00',
    created_by: 'admin',
    updated_at: '2024-01-05 15:30:00',
    updated_by: 'admin'
  },
  {
    id: 'module_006',
    name: 'Utility Functions',
    category: 'workstation',
    version: '1.3.0',
    file: 'utils.js',
    type: 'lib',
    tab: 'workstation',
    entry: false,
    created_at: '2024-01-06 09:00:00',
    created_by: 'admin',
    updated_at: '2024-01-12 10:30:00',
    updated_by: 'admin'
  }
]
