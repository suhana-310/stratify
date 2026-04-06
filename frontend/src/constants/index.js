/*
 * Stratify 2026 - Advanced 3D Project Management System
 * Copyright (c) 2026 Stratify. All rights reserved.
 */

// Application Constants

// App Information
export const APP_INFO = {
  NAME: 'Stratify 2026',
  VERSION: '1.0.0',
  DESCRIPTION: 'Advanced 3D Project Management System',
  COPYRIGHT: '© 2026 Stratify. All rights reserved.',
  AUTHOR: 'Stratify Team',
  WEBSITE: 'https://stratify2026.com'
};

// Task Status
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  REVIEW: 'review',
  COMPLETED: 'completed'
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.REVIEW]: 'Review',
  [TASK_STATUS.COMPLETED]: 'Completed'
};

// Priority Levels
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const PRIORITY_LABELS = {
  [PRIORITY.LOW]: 'Low',
  [PRIORITY.MEDIUM]: 'Medium',
  [PRIORITY.HIGH]: 'High'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member'
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.MANAGER]: 'Manager',
  [USER_ROLES.MEMBER]: 'Member'
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#E6A520',
  SECONDARY: '#FFD77A',
  ACCENT: '#7A4A00',
  BACKGROUND: '#FFF8E7',
  CARD: '#FFFFFF'
};