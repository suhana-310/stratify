// Mock Data for Stratify System
export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    avatar: 'https://randomuser.me/api/portraits/men/16.jpg',
    role: 'admin',
    department: 'Engineering',
    status: 'active',
    joinedAt: '2024-01-15',
    lastActive: '2024-03-17T10:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    role: 'manager',
    department: 'Design',
    status: 'active',
    joinedAt: '2024-02-01',
    lastActive: '2024-03-17T09:15:00Z'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@company.com',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    role: 'member',
    department: 'Engineering',
    status: 'active',
    joinedAt: '2024-02-15',
    lastActive: '2024-03-17T11:45:00Z'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@company.com',
    avatar: 'https://randomuser.me/api/portraits/women/19.jpg',
    role: 'member',
    department: 'Marketing',
    status: 'active',
    joinedAt: '2024-03-01',
    lastActive: '2024-03-17T08:20:00Z'
  }
];

export const mockProjects = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js',
    status: 'active',
    priority: 'high',
    progress: 75,
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    budget: 50000,
    spent: 37500,
    teamMembers: ['1', '2', '3'],
    tags: ['React', 'Node.js', 'E-commerce'],
    color: '#E6A520',
    createdBy: '1',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-03-17T10:30:00Z'
  },
  {
    id: '2',
    name: 'Mobile App Redesign',
    description: 'Complete UI/UX redesign of the mobile application',
    status: 'active',
    priority: 'medium',
    progress: 45,
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    budget: 30000,
    spent: 13500,
    teamMembers: ['2', '4'],
    tags: ['UI/UX', 'Mobile', 'Design'],
    color: '#7A4A00',
    createdBy: '2',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-03-17T09:15:00Z'
  },
  {
    id: '3',
    name: 'API Integration',
    description: 'Integrate third-party APIs for enhanced functionality',
    status: 'completed',
    priority: 'low',
    progress: 100,
    startDate: '2024-01-01',
    endDate: '2024-02-28',
    budget: 15000,
    spent: 14200,
    teamMembers: ['1', '3'],
    tags: ['API', 'Integration', 'Backend'],
    color: '#FFD77A',
    createdBy: '1',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-02-28T17:00:00Z'
  }
];

export const mockTasks = [
  {
    id: '1',
    title: 'Setup project structure',
    description: 'Initialize the project with proper folder structure and dependencies',
    status: 'completed',
    priority: 'high',
    projectId: '1',
    assignedTo: ['1'],
    createdBy: '1',
    dueDate: '2024-01-20',
    completedAt: '2024-01-18T15:30:00Z',
    tags: ['Setup', 'Infrastructure'],
    checklist: [
      { id: '1', text: 'Create folder structure', completed: true },
      { id: '2', text: 'Install dependencies', completed: true },
      { id: '3', text: 'Setup linting', completed: true }
    ],
    attachments: [],
    comments: 2,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-18T15:30:00Z'
  },
  {
    id: '2',
    title: 'Design user authentication flow',
    description: 'Create wireframes and mockups for the authentication system',
    status: 'in-progress',
    priority: 'high',
    projectId: '1',
    assignedTo: ['2'],
    createdBy: '1',
    dueDate: '2024-03-25',
    tags: ['Design', 'Authentication'],
    checklist: [
      { id: '1', text: 'Research best practices', completed: true },
      { id: '2', text: 'Create wireframes', completed: true },
      { id: '3', text: 'Design mockups', completed: false },
      { id: '4', text: 'Get stakeholder approval', completed: false }
    ],
    attachments: [
      { id: '1', name: 'auth-wireframes.pdf', size: '2.4 MB', type: 'pdf' }
    ],
    comments: 5,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-17T11:20:00Z'
  },
  {
    id: '3',
    title: 'Implement shopping cart',
    description: 'Build the shopping cart functionality with add/remove items',
    status: 'todo',
    priority: 'medium',
    projectId: '1',
    assignedTo: ['3'],
    createdBy: '1',
    dueDate: '2024-04-01',
    tags: ['Frontend', 'E-commerce'],
    checklist: [
      { id: '1', text: 'Design cart component', completed: false },
      { id: '2', text: 'Implement add to cart', completed: false },
      { id: '3', text: 'Implement remove from cart', completed: false },
      { id: '4', text: 'Add quantity controls', completed: false }
    ],
    attachments: [],
    comments: 1,
    createdAt: '2024-03-10T14:00:00Z',
    updatedAt: '2024-03-10T14:00:00Z'
  },
  {
    id: '4',
    title: 'Mobile app wireframes',
    description: 'Create detailed wireframes for all mobile app screens',
    status: 'review',
    priority: 'high',
    projectId: '2',
    assignedTo: ['2'],
    createdBy: '2',
    dueDate: '2024-03-20',
    tags: ['Design', 'Mobile', 'Wireframes'],
    checklist: [
      { id: '1', text: 'Home screen wireframe', completed: true },
      { id: '2', text: 'Profile screen wireframe', completed: true },
      { id: '3', text: 'Settings screen wireframe', completed: true },
      { id: '4', text: 'Navigation flow', completed: false }
    ],
    attachments: [
      { id: '1', name: 'mobile-wireframes.sketch', size: '15.2 MB', type: 'sketch' }
    ],
    comments: 8,
    createdAt: '2024-02-15T09:30:00Z',
    updatedAt: '2024-03-17T16:45:00Z'
  }
];

export const mockNotifications = [
  {
    id: '1',
    type: 'task_assigned',
    title: 'New task assigned',
    message: 'You have been assigned to "Design user authentication flow"',
    userId: '2',
    read: false,
    actionUrl: '/tasks/2',
    createdAt: '2024-03-17T09:00:00Z'
  },
  {
    id: '2',
    type: 'deadline_approaching',
    title: 'Deadline approaching',
    message: 'Task "Mobile app wireframes" is due in 3 days',
    userId: '2',
    read: false,
    actionUrl: '/tasks/4',
    createdAt: '2024-03-17T10:30:00Z'
  }
];