import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  budget: {
    allocated: {
      type: Number,
      default: 0
    },
    spent: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  timeline: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    actualStartDate: Date,
    actualEndDate: Date
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Project owner is required']
  },
  team: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'manager', 'developer', 'designer', 'tester', 'viewer'],
      default: 'developer'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    permissions: {
      canEdit: { type: Boolean, default: true },
      canDelete: { type: Boolean, default: false },
      canInvite: { type: Boolean, default: false },
      canManageTasks: { type: Boolean, default: true }
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  color: {
    type: String,
    default: '#6366f1',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color']
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tasks: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Task'
  }],
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  settings: {
    isPublic: {
      type: Boolean,
      default: false
    },
    allowComments: {
      type: Boolean,
      default: true
    },
    notifications: {
      taskUpdates: { type: Boolean, default: true },
      deadlines: { type: Boolean, default: true },
      teamChanges: { type: Boolean, default: true }
    }
  },
  activity: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    action: {
      type: String,
      required: true
    },
    details: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
projectSchema.index({ owner: 1 });
projectSchema.index({ 'team.user': 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ 'timeline.startDate': 1, 'timeline.endDate': 1 });
projectSchema.index({ tags: 1 });

// Virtual for task count
projectSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true
});

// Virtual for completed task count
projectSchema.virtual('completedTaskCount').get(function() {
  return this.tasks?.filter(task => task.status === 'completed').length || 0;
});

// Virtual for team member count
projectSchema.virtual('teamSize').get(function() {
  return this.team?.length || 0;
});

// Virtual for days remaining
projectSchema.virtual('daysRemaining').get(function() {
  if (!this.timeline?.endDate) return null;
  const now = new Date();
  const endDate = new Date(this.timeline.endDate);
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for project health status
projectSchema.virtual('healthStatus').get(function() {
  const daysRemaining = this.daysRemaining;
  const progress = this.progress || 0;
  
  if (this.status === 'completed') return 'completed';
  if (this.status === 'cancelled') return 'cancelled';
  if (daysRemaining < 0) return 'overdue';
  if (daysRemaining <= 7 && progress < 80) return 'at-risk';
  if (progress >= 90) return 'on-track';
  return 'healthy';
});

// Pre-save middleware to update progress based on tasks
projectSchema.pre('save', async function(next) {
  if (this.isModified('tasks') && this.tasks.length > 0) {
    try {
      const Task = mongoose.model('Task');
      const tasks = await Task.find({ _id: { $in: this.tasks } });
      const completedTasks = tasks.filter(task => task.status === 'completed');
      this.progress = Math.round((completedTasks.length / tasks.length) * 100);
    } catch (error) {
      console.error('Error calculating project progress:', error);
    }
  }
  next();
});

// Method to add team member
projectSchema.methods.addTeamMember = function(userId, role = 'developer', permissions = {}) {
  const existingMember = this.team.find(member => member.user.toString() === userId.toString());
  
  if (existingMember) {
    throw new Error('User is already a team member');
  }
  
  const defaultPermissions = {
    canEdit: true,
    canDelete: false,
    canInvite: false,
    canManageTasks: true,
    ...permissions
  };
  
  this.team.push({
    user: userId,
    role,
    permissions: defaultPermissions
  });
  
  return this.save();
};

// Method to remove team member
projectSchema.methods.removeTeamMember = function(userId) {
  this.team = this.team.filter(member => member.user.toString() !== userId.toString());
  return this.save();
};

// Method to update team member role
projectSchema.methods.updateTeamMemberRole = function(userId, newRole, newPermissions = {}) {
  const member = this.team.find(member => member.user.toString() === userId.toString());
  
  if (!member) {
    throw new Error('User is not a team member');
  }
  
  member.role = newRole;
  member.permissions = { ...member.permissions, ...newPermissions };
  
  return this.save();
};

// Method to log activity
projectSchema.methods.logActivity = function(userId, action, details = {}) {
  this.activity.unshift({
    user: userId,
    action,
    details,
    timestamp: new Date()
  });
  
  // Keep only last 100 activities
  if (this.activity.length > 100) {
    this.activity = this.activity.slice(0, 100);
  }
  
  return this.save();
};

export default mongoose.model('Project', projectSchema);