import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, priority } = req.query;

    // Build query based on user role
    let query = {};
    
    if (req.user.role === 'admin') {
      // Admin can see all projects
    } else {
      // Others can only see projects they're part of
      query = {
        $or: [
          { owner: req.user.id },
          { 'team.user': req.user.id }
        ]
      };
    }

    // Add filters
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Execute query with pagination
    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('team.user', 'name email avatar')
      .populate('tasks', 'title status priority')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar role')
      .populate('team.user', 'name email avatar role department')
      .populate('tasks', 'title description status priority assignee dueDate')
      .populate('activity.user', 'name avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has access to this project
    const hasAccess = req.user.role === 'admin' || 
                     project.owner._id.toString() === req.user.id ||
                     project.team.some(member => member.user._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    res.json({
      success: true,
      project
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      status = 'planning',
      priority = 'medium',
      budget,
      timeline,
      tags,
      color,
      team = []
    } = req.body;

    // Validate required fields
    if (!name || !timeline?.startDate || !timeline?.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Name, start date, and end date are required'
      });
    }

    // Create project
    const project = await Project.create({
      name,
      description,
      status,
      priority,
      budget,
      timeline,
      tags,
      color,
      owner: req.user.id,
      team: [
        {
          user: req.user.id,
          role: 'owner',
          permissions: {
            canEdit: true,
            canDelete: true,
            canInvite: true,
            canManageTasks: true
          }
        },
        ...team.map(member => ({
          user: member.userId,
          role: member.role || 'developer',
          permissions: member.permissions || {
            canEdit: true,
            canDelete: false,
            canInvite: false,
            canManageTasks: true
          }
        }))
      ]
    });

    // Add project to user's projects
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { projects: project._id }
    });

    // Add project to team members' projects
    for (const member of team) {
      await User.findByIdAndUpdate(member.userId, {
        $addToSet: { projects: project._id }
      });
    }

    // Log activity
    await project.logActivity(req.user.id, 'project_created', {
      projectName: name
    });

    // Populate the created project
    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('team.user', 'name email avatar');

    // Emit real-time event
    req.io?.emit('project_created', {
      project: populatedProject,
      createdBy: req.user.id,
      timestamp: new Date()
    });

    // Notify team members
    team.forEach(member => {
      req.io?.to(`user_${member.userId}`).emit('project_invitation', {
        project: populatedProject,
        invitedBy: req.user.profile,
        timestamp: new Date()
      });
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: populatedProject
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const userTeamMember = project.team.find(member => 
      member.user.toString() === req.user.id
    );

    const canEdit = req.user.role === 'admin' ||
                   project.owner.toString() === req.user.id ||
                   (userTeamMember && userTeamMember.permissions.canEdit);

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this project'
      });
    }

    // Update fields
    const allowedFields = [
      'name', 'description', 'status', 'priority', 
      'budget', 'timeline', 'tags', 'color', 'settings'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    // Log activity
    await project.logActivity(req.user.id, 'project_updated', {
      changes: Object.keys(req.body)
    });

    // Populate updated project
    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('team.user', 'name email avatar');

    // Emit real-time event to project members
    req.io?.to(`project_${project._id}`).emit('project_updated', {
      project: updatedProject,
      updatedBy: req.user.id,
      changes: Object.keys(req.body),
      timestamp: new Date()
    });

    // Also emit globally for testing and dashboard updates
    req.io?.emit('project_updated', {
      project: updatedProject,
      updatedBy: req.user.id,
      changes: Object.keys(req.body),
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions (only owner or admin can delete)
    const canDelete = req.user.role === 'admin' ||
                     project.owner.toString() === req.user.id;

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    // Remove project from all team members' projects
    await User.updateMany(
      { projects: project._id },
      { $pull: { projects: project._id } }
    );

    // Delete the project
    await Project.findByIdAndDelete(req.params.id);

    // Emit real-time event
    req.io?.to(`project_${project._id}`).emit('project_deleted', {
      projectId: project._id,
      projectName: project.name,
      deletedBy: req.user.id,
      timestamp: new Date()
    });

    // Also emit globally for testing and dashboard updates
    req.io?.emit('project_deleted', {
      projectId: project._id,
      projectName: project.name,
      deletedBy: req.user.id,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
});

// @desc    Add team member to project
// @route   POST /api/projects/:id/team
// @access  Private
router.post('/:id/team', async (req, res) => {
  try {
    const { userId, role = 'developer', permissions } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const userTeamMember = project.team.find(member => 
      member.user.toString() === req.user.id
    );

    const canInvite = req.user.role === 'admin' ||
                     project.owner.toString() === req.user.id ||
                     (userTeamMember && userTeamMember.permissions.canInvite);

    if (!canInvite) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add team members'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add team member
    await project.addTeamMember(userId, role, permissions);

    // Add project to user's projects
    await User.findByIdAndUpdate(userId, {
      $addToSet: { projects: project._id }
    });

    // Log activity
    await project.logActivity(req.user.id, 'team_member_added', {
      addedUser: user.name,
      role
    });

    // Populate updated project
    const updatedProject = await Project.findById(project._id)
      .populate('team.user', 'name email avatar');

    // Emit real-time events
    req.io?.to(`project_${project._id}`).emit('team_member_added', {
      project: updatedProject,
      newMember: user.profile,
      addedBy: req.user.id,
      timestamp: new Date()
    });

    // Also emit globally for testing and dashboard updates
    req.io?.emit('team_member_added', {
      project: updatedProject,
      newMember: user.profile,
      addedBy: req.user.id,
      timestamp: new Date()
    });

    req.io?.to(`user_${userId}`).emit('project_invitation', {
      project: updatedProject,
      invitedBy: req.user.profile,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Team member added successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Add team member error:', error);
    
    if (error.message === 'User is already a team member') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add team member'
    });
  }
});

// @desc    Remove team member from project
// @route   DELETE /api/projects/:id/team/:userId
// @access  Private
router.delete('/:id/team/:userId', async (req, res) => {
  try {
    const { id, userId } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const userTeamMember = project.team.find(member => 
      member.user.toString() === req.user.id
    );

    const canRemove = req.user.role === 'admin' ||
                     project.owner.toString() === req.user.id ||
                     (userTeamMember && userTeamMember.permissions.canInvite);

    if (!canRemove) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove team members'
      });
    }

    // Cannot remove project owner
    if (project.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove project owner'
      });
    }

    // Check if user is a team member
    const memberIndex = project.team.findIndex(member => 
      member.user.toString() === userId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User is not a team member'
      });
    }

    // Get user info before removal
    const user = await User.findById(userId);
    const removedMember = project.team[memberIndex];

    // Remove team member
    project.team.splice(memberIndex, 1);
    await project.save();

    // Remove project from user's projects
    await User.findByIdAndUpdate(userId, {
      $pull: { projects: project._id }
    });

    // Log activity
    await project.logActivity(req.user.id, 'team_member_removed', {
      removedUser: user.name,
      role: removedMember.role
    });

    // Populate updated project
    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('team.user', 'name email avatar');

    // Emit real-time events
    req.io?.to(`project_${project._id}`).emit('team_member_removed', {
      project: updatedProject,
      removedMember: user.profile,
      removedBy: req.user,
      timestamp: new Date()
    });

    // Also emit globally for testing and dashboard updates
    req.io?.emit('team_member_removed', {
      project: updatedProject,
      removedMember: user.profile,
      removedBy: req.user,
      timestamp: new Date()
    });

    // Notify removed user
    req.io?.to(`user_${userId}`).emit('removed_from_project', {
      project: updatedProject,
      removedBy: req.user,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Team member removed successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove team member'
    });
  }
});

// @desc    Update team member role and permissions
// @route   PUT /api/projects/:id/team/:userId
// @access  Private
router.put('/:id/team/:userId', async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { role, permissions } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const userTeamMember = project.team.find(member => 
      member.user.toString() === req.user.id
    );

    const canUpdate = req.user.role === 'admin' ||
                     project.owner.toString() === req.user.id ||
                     (userTeamMember && userTeamMember.permissions.canInvite);

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update team members'
      });
    }

    // Cannot update project owner role
    if (project.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update project owner role'
      });
    }

    // Find team member
    const memberIndex = project.team.findIndex(member => 
      member.user.toString() === userId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User is not a team member'
      });
    }

    // Get user info
    const user = await User.findById(userId);
    const oldRole = project.team[memberIndex].role;

    // Update team member
    if (role) project.team[memberIndex].role = role;
    if (permissions) project.team[memberIndex].permissions = { ...project.team[memberIndex].permissions, ...permissions };

    await project.save();

    // Log activity
    await project.logActivity(req.user.id, 'team_member_updated', {
      updatedUser: user.name,
      oldRole,
      newRole: role || oldRole
    });

    // Populate updated project
    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('team.user', 'name email avatar');

    // Emit real-time events
    req.io?.to(`project_${project._id}`).emit('team_member_updated', {
      project: updatedProject,
      updatedMember: user.profile,
      updatedBy: req.user,
      changes: { role, permissions },
      timestamp: new Date()
    });

    // Also emit globally for testing and dashboard updates
    req.io?.emit('team_member_updated', {
      project: updatedProject,
      updatedMember: user.profile,
      updatedBy: req.user,
      changes: { role, permissions },
      timestamp: new Date()
    });

    // Notify updated user
    req.io?.to(`user_${userId}`).emit('role_updated', {
      project: updatedProject,
      newRole: role || oldRole,
      updatedBy: req.user,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Team member updated successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update team member'
    });
  }
});

// @desc    Add project link
// @route   POST /api/projects/:id/links
// @access  Private
router.post('/:id/links', async (req, res) => {
  try {
    const { title, url, description, type } = req.body;

    if (!title || !url) {
      return res.status(400).json({
        success: false,
        message: 'Title and URL are required'
      });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const userTeamMember = project.team.find(member => 
      member.user.toString() === req.user.id
    );

    const canEdit = req.user.role === 'admin' ||
                   project.owner.toString() === req.user.id ||
                   (userTeamMember && userTeamMember.permissions.canEdit);

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add links to this project'
      });
    }

    // Add link
    await project.addLink({ title, url, description, type }, req.user.id);

    // Log activity
    await project.logActivity(req.user.id, 'link_added', {
      linkTitle: title,
      linkUrl: url,
      linkType: type
    });

    // Populate updated project
    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('team.user', 'name email avatar')
      .populate('links.addedBy', 'name email avatar');

    // Emit real-time event
    req.io?.to(`project_${project._id}`).emit('project_link_added', {
      project: updatedProject,
      link: updatedProject.links[updatedProject.links.length - 1],
      addedBy: req.user,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Link added successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Add project link error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add project link'
    });
  }
});

// @desc    Update project link
// @route   PUT /api/projects/:id/links/:linkId
// @access  Private
router.put('/:id/links/:linkId', async (req, res) => {
  try {
    const { title, url, description, type } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const userTeamMember = project.team.find(member => 
      member.user.toString() === req.user.id
    );

    const canEdit = req.user.role === 'admin' ||
                   project.owner.toString() === req.user.id ||
                   (userTeamMember && userTeamMember.permissions.canEdit);

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update links in this project'
      });
    }

    // Update link
    await project.updateLink(req.params.linkId, { title, url, description, type });

    // Log activity
    await project.logActivity(req.user.id, 'link_updated', {
      linkTitle: title,
      linkUrl: url,
      linkType: type
    });

    // Populate updated project
    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('team.user', 'name email avatar')
      .populate('links.addedBy', 'name email avatar');

    // Emit real-time event
    req.io?.to(`project_${project._id}`).emit('project_link_updated', {
      project: updatedProject,
      linkId: req.params.linkId,
      updatedBy: req.user,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Link updated successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Update project link error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project link'
    });
  }
});

// @desc    Remove project link
// @route   DELETE /api/projects/:id/links/:linkId
// @access  Private
router.delete('/:id/links/:linkId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const userTeamMember = project.team.find(member => 
      member.user.toString() === req.user.id
    );

    const canEdit = req.user.role === 'admin' ||
                   project.owner.toString() === req.user.id ||
                   (userTeamMember && userTeamMember.permissions.canEdit);

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove links from this project'
      });
    }

    // Get link info before removal
    const link = project.links.id(req.params.linkId);
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    // Remove link
    await project.removeLink(req.params.linkId);

    // Log activity
    await project.logActivity(req.user.id, 'link_removed', {
      linkTitle: link.title,
      linkUrl: link.url
    });

    // Populate updated project
    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('team.user', 'name email avatar')
      .populate('links.addedBy', 'name email avatar');

    // Emit real-time event
    req.io?.to(`project_${project._id}`).emit('project_link_removed', {
      project: updatedProject,
      linkId: req.params.linkId,
      removedBy: req.user,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Link removed successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Remove project link error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove project link'
    });
  }
});

export default router;