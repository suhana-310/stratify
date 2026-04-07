import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Task title cannot be more than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['todo', 'progress', 'review', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: [true, 'Task must belong to a project']
  },
  assignee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
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
  comments: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  checklist: [{
    text: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    completedAt: Date
  }],
  timeTracking: {
    estimated: {
      type: Number, // in minutes
      default: 0
    },
    actual: {
      type: Number, // in minutes
      default: 0
    },
    sessions: [{
      startTime: Date,
      endTime: Date,
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      description: String
    }]
  },
  dependencies: [{
    task: {
      type: mongoose.Schema.ObjectId,
      ref: 'Task'
    },
    type: {
      type: String,
      enum: ['blocks', 'blocked_by', 'related'],
      default: 'blocks'
    }
  }],
  labels: [{
    name: String,
    color: String
  }],
  position: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignee: 1, status: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ position: 1 });

// Virtual for task completion percentage based on checklist
taskSchema.virtual('checklistProgress').get(function() {
  if (!this.checklist || this.checklist.length === 0) return 0;
  const completed = this.checklist.filter(item => item.completed).length;
  return Math.round((completed / this.checklist.length) * 100);
});

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'done') return false;
  return new Date() > this.dueDate;
});

// Virtual for time remaining
taskSchema.virtual('timeRemaining').get(function() {
  if (!this.dueDate || this.status === 'done') return null;
  const now = new Date();
  const due = new Date(this.dueDate);
  const diff = due - now;
  
  if (diff < 0) return 'Overdue';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return 'Due soon';
});

// Pre-save middleware to update progress based on status
taskSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    switch (this.status) {
      case 'todo':
        this.progress = 0;
        break;
      case 'progress':
        if (this.progress === 0) this.progress = 25;
        break;
      case 'review':
        if (this.progress < 75) this.progress = 75;
        break;
      case 'done':
        this.progress = 100;
        this.completedAt = new Date();
        break;
    }
  }
  next();
});

// Method to add comment
taskSchema.methods.addComment = function(userId, text) {
  this.comments.push({
    user: userId,
    text: text,
    createdAt: new Date()
  });
  return this.save();
};

// Method to update progress and auto-update status
taskSchema.methods.updateProgress = function(progress) {
  this.progress = Math.max(0, Math.min(100, progress));
  
  // Auto-update status based on progress
  if (this.progress === 0) {
    this.status = 'todo';
  } else if (this.progress === 100) {
    this.status = 'done';
    this.completedAt = new Date();
  } else if (this.progress >= 75) {
    this.status = 'review';
  } else {
    this.status = 'progress';
  }
  
  return this.save();
};

// Method to toggle checklist item
taskSchema.methods.toggleChecklistItem = function(itemId, userId) {
  const item = this.checklist.id(itemId);
  if (item) {
    item.completed = !item.completed;
    if (item.completed) {
      item.completedBy = userId;
      item.completedAt = new Date();
    } else {
      item.completedBy = undefined;
      item.completedAt = undefined;
    }
    
    // Update overall progress based on checklist
    if (this.checklist.length > 0) {
      const completedItems = this.checklist.filter(item => item.completed).length;
      this.progress = Math.round((completedItems / this.checklist.length) * 100);
    }
  }
  return this.save();
};

// Static method to get tasks by project with filters
taskSchema.statics.getProjectTasks = function(projectId, filters = {}) {
  const query = { project: projectId };
  
  if (filters.status) query.status = filters.status;
  if (filters.assignee) query.assignee = filters.assignee;
  if (filters.priority) query.priority = filters.priority;
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  return this.find(query)
    .populate('assignee', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('comments.user', 'name email avatar')
    .sort({ position: 1, createdAt: -1 });
};

// Static method to get user tasks
taskSchema.statics.getUserTasks = function(userId, filters = {}) {
  const query = { assignee: userId };
  
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.dueDate) {
    const date = new Date(filters.dueDate);
    query.dueDate = {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999))
    };
  }
  
  return this.find(query)
    .populate('project', 'name color')
    .populate('assignee', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .sort({ dueDate: 1, priority: -1, createdAt: -1 });
};

const Task = mongoose.model('Task', taskSchema);

export default Task;