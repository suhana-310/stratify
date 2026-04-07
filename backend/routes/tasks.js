import express from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all tasks for user or project
// @route   GET /api/tasks
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { 
      project, 
      assignee, 
      status, 
      priority, 
      search, 
      dueDate,
      page = 1, 
      limit = 50 
    } = req.query;

    let query = {};

    // If project specified, check if user has access
    if (project) {
      const projectDoc = await Project.findById(project);
      if (!projectDoc) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // Check if user has access to project
      const hasAccess = projectDoc.owner.toString() === req.user.id ||
                       projectDoc.team.some(member => member.user.toString() === req.user.id) ||
                       req.user.role === 'admin';

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      query.project = project;
    } else {
      // Get tasks from projects user has access to
      const userProjects = await Project.find({
        $or: [
          { owner: req.user.id },
          { 'team.user': req.user.id }
        ]
      }).select('_id');

      query.project = { $in: userProjects.map(p => p._id) };
    }

    // Add filters
    if (assignee) query.assignee = assignee;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (dueDate) {
      const date = new Date(dueDate);
      query.dueDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      };
    }

    const tasks = await Task.find(query)
      .populate('project', 'name color')
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar')
      .sort({ position: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      count: tasks.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      tasks
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name color')
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name email avatar')
      .populate('dependencies.task', 'title status');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);
    const hasAccess = project.owner.toString() === req.user.id ||
                     project.team.some(member => member.user.toString() === req.user.id) ||
                     req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this task'
      });
    }

    res.json({
      success: true,
      task
    });

  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task'
    });
  }
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignee,
      priority,
      dueDate,
      tags,
      checklist,
      labels,
      position
    } = req.body;

    // Check if project exists and user has access
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const hasAccess = projectDoc.owner.toString() === req.user.id ||
                     projectDoc.team.some(member => 
                       member.user.toString() === req.user.id && 
                       member.permissions.canManageTasks
                     ) ||
                     req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to create tasks in this project'
      });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      project,
      assignee,
      priority,
      dueDate,
      tags,
      checklist,
      labels,
      position,
      createdBy: req.user.id
    });

    // Populate the created task
    await task.populate([
      { path: 'project', select: 'name color' },
      { path: 'assignee', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' }
    ]);

    // Add task to project's tasks array
    projectDoc.tasks.push(task._id);
    await projectDoc.save();

    // Log activity
    await projectDoc.logActivity(req.user.id, 'task_created', {
      taskTitle: task.title,
      taskId: task._id
    });

    // Emit real-time event
    req.io?.emit('task_created', {
      task: task,
      project: projectDoc,
      createdBy: req.user,
      timestamp: new Date()
    });

    // Notify assignee if different from creator
    if (assignee && assignee !== req.user.id) {
      req.io?.to(`user_${assignee}`).emit('task_assigned', {
        task: task,
        project: projectDoc,
        assignedBy: req.user,
        timestamp: new Date()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to update task
    const project = await Project.findById(task.project);
    const hasAccess = project.owner.toString() === req.user.id ||
                     project.team.some(member => 
                       member.user.toString() === req.user.id && 
                       member.permissions.canManageTasks
                     ) ||
                     task.assignee?.toString() === req.user.id ||
                     req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to update this task'
      });
    }

    // Store old values for activity logging
    const oldStatus = task.status;
    const oldAssignee = task.assignee;

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'project', select: 'name color' },
      { path: 'assignee', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'comments.user', select: 'name email avatar' }
    ]);

    // Log activity for status change
    if (oldStatus !== updatedTask.status) {
      await project.logActivity(req.user.id, 'task_status_changed', {
        taskTitle: updatedTask.title,
        taskId: updatedTask._id,
        oldStatus,
        newStatus: updatedTask.status
      });
    }

    // Log activity for assignee change
    if (oldAssignee?.toString() !== updatedTask.assignee?.toString()) {
      await project.logActivity(req.user.id, 'task_reassigned', {
        taskTitle: updatedTask.title,
        taskId: updatedTask._id,
        newAssignee: updatedTask.assignee
      });
    }

    // Emit real-time event
    req.io?.emit('task_updated', {
      task: updatedTask,
      project: project,
      updatedBy: req.user,
      changes: req.body,
      timestamp: new Date()
    });

    // Notify new assignee if changed
    if (req.body.assignee && req.body.assignee !== oldAssignee?.toString()) {
      req.io?.to(`user_${req.body.assignee}`).emit('task_assigned', {
        task: updatedTask,
        project: project,
        assignedBy: req.user,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to delete task
    const project = await Project.findById(task.project);
    const hasAccess = project.owner.toString() === req.user.id ||
                     project.team.some(member => 
                       member.user.toString() === req.user.id && 
                       member.permissions.canManageTasks
                     ) ||
                     req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to delete this task'
      });
    }

    // Remove task from project's tasks array
    project.tasks.pull(task._id);
    await project.save();

    // Delete the task
    await Task.findByIdAndDelete(req.params.id);

    // Log activity
    await project.logActivity(req.user.id, 'task_deleted', {
      taskTitle: task.title,
      taskId: task._id
    });

    // Emit real-time event
    req.io?.emit('task_deleted', {
      taskId: task._id,
      project: project,
      deletedBy: req.user,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
router.post('/:id/comments', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);
    const hasAccess = project.owner.toString() === req.user.id ||
                     project.team.some(member => member.user.toString() === req.user.id) ||
                     req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to comment on this task'
      });
    }

    // Add comment
    await task.addComment(req.user.id, text.trim());

    // Populate the updated task
    await task.populate([
      { path: 'comments.user', select: 'name email avatar' }
    ]);

    // Get the new comment
    const newComment = task.comments[task.comments.length - 1];

    // Emit real-time event
    req.io?.emit('task_comment_added', {
      taskId: task._id,
      comment: newComment,
      project: project,
      addedBy: req.user,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
});

// @desc    Update task progress
// @route   PUT /api/tasks/:id/progress
// @access  Private
router.put('/:id/progress', async (req, res) => {
  try {
    const { progress } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }

    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to update task
    const project = await Project.findById(task.project);
    const hasAccess = project.owner.toString() === req.user.id ||
                     project.team.some(member => member.user.toString() === req.user.id) ||
                     task.assignee?.toString() === req.user.id ||
                     req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to update this task'
      });
    }

    // Update progress
    await task.updateProgress(progress);

    // Populate the updated task
    await task.populate([
      { path: 'project', select: 'name color' },
      { path: 'assignee', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' }
    ]);

    // Emit real-time event
    req.io?.emit('task_progress_updated', {
      task: task,
      project: project,
      updatedBy: req.user,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Task progress updated successfully',
      task
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task progress'
    });
  }
});

// @desc    Toggle checklist item
// @route   PUT /api/tasks/:id/checklist/:itemId
// @access  Private
router.put('/:id/checklist/:itemId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access to update task
    const project = await Project.findById(task.project);
    const hasAccess = project.owner.toString() === req.user.id ||
                     project.team.some(member => member.user.toString() === req.user.id) ||
                     task.assignee?.toString() === req.user.id ||
                     req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to update this task'
      });
    }

    // Toggle checklist item
    await task.toggleChecklistItem(req.params.itemId, req.user.id);

    // Populate the updated task
    await task.populate([
      { path: 'project', select: 'name color' },
      { path: 'assignee', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' }
    ]);

    // Emit real-time event
    req.io?.emit('task_checklist_updated', {
      task: task,
      project: project,
      updatedBy: req.user,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Checklist item updated successfully',
      task
    });

  } catch (error) {
    console.error('Update checklist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update checklist item'
    });
  }
});

// @desc    Bulk update task positions (for drag & drop)
// @route   PUT /api/tasks/bulk/positions
// @access  Private
router.put('/bulk/positions', async (req, res) => {
  try {
    const { tasks } = req.body; // Array of { id, position, status }

    if (!Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        message: 'Tasks array is required'
      });
    }

    // Update all tasks in parallel
    const updatePromises = tasks.map(({ id, position, status }) => 
      Task.findByIdAndUpdate(id, { position, status }, { new: true })
    );

    const updatedTasks = await Promise.all(updatePromises);

    // Emit real-time event
    req.io?.emit('tasks_reordered', {
      tasks: updatedTasks,
      updatedBy: req.user,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Task positions updated successfully',
      tasks: updatedTasks
    });

  } catch (error) {
    console.error('Bulk update positions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task positions'
    });
  }
});

export default router;