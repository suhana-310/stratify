import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Project from '../models/Project.js';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'admin@company.com',
        password: 'admin123',
        role: 'admin',
        department: 'Engineering',
        status: 'active',
        isEmailVerified: true
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@company.com',
        password: 'password123',
        role: 'manager',
        department: 'Design',
        status: 'active',
        isEmailVerified: true
      },
      {
        name: 'Mike Chen',
        email: 'mike@company.com',
        password: 'password123',
        role: 'member',
        department: 'Engineering',
        status: 'active',
        isEmailVerified: true
      },
      {
        name: 'Emily Davis',
        email: 'emily@company.com',
        password: 'password123',
        role: 'member',
        department: 'Marketing',
        status: 'active',
        isEmailVerified: true
      },
      {
        name: 'Alex Johnson',
        email: 'alex@company.com',
        password: 'password123',
        role: 'member',
        department: 'Engineering',
        status: 'active',
        isEmailVerified: true
      }
    ]);

    console.log('👥 Created sample users');

    // Create sample projects
    const projects = await Project.create([
      {
        name: 'E-commerce Platform Redesign',
        description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX and improved performance.',
        status: 'active',
        priority: 'high',
        budget: {
          allocated: 150000,
          spent: 45000,
          currency: 'USD'
        },
        timeline: {
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-06-30'),
          actualStartDate: new Date('2024-01-15')
        },
        owner: users[0]._id, // John Doe (admin)
        team: [
          {
            user: users[0]._id,
            role: 'owner',
            permissions: {
              canEdit: true,
              canDelete: true,
              canInvite: true,
              canManageTasks: true
            }
          },
          {
            user: users[1]._id, // Sarah Wilson
            role: 'manager',
            permissions: {
              canEdit: true,
              canDelete: false,
              canInvite: true,
              canManageTasks: true
            }
          },
          {
            user: users[2]._id, // Mike Chen
            role: 'developer',
            permissions: {
              canEdit: true,
              canDelete: false,
              canInvite: false,
              canManageTasks: true
            }
          }
        ],
        tags: ['e-commerce', 'redesign', 'ui/ux'],
        color: '#6366f1',
        progress: 30
      },
      {
        name: 'Mobile App Development',
        description: 'Native mobile application for iOS and Android platforms with real-time synchronization.',
        status: 'planning',
        priority: 'medium',
        budget: {
          allocated: 200000,
          spent: 15000,
          currency: 'USD'
        },
        timeline: {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-09-30')
        },
        owner: users[1]._id, // Sarah Wilson
        team: [
          {
            user: users[1]._id,
            role: 'owner',
            permissions: {
              canEdit: true,
              canDelete: true,
              canInvite: true,
              canManageTasks: true
            }
          },
          {
            user: users[2]._id, // Mike Chen
            role: 'developer',
            permissions: {
              canEdit: true,
              canDelete: false,
              canInvite: false,
              canManageTasks: true
            }
          },
          {
            user: users[4]._id, // Alex Johnson
            role: 'developer',
            permissions: {
              canEdit: true,
              canDelete: false,
              canInvite: false,
              canManageTasks: true
            }
          }
        ],
        tags: ['mobile', 'ios', 'android', 'react-native'],
        color: '#10b981',
        progress: 10
      },
      {
        name: 'Marketing Campaign Analytics',
        description: 'Advanced analytics dashboard for tracking marketing campaign performance and ROI.',
        status: 'completed',
        priority: 'low',
        budget: {
          allocated: 75000,
          spent: 72000,
          currency: 'USD'
        },
        timeline: {
          startDate: new Date('2023-10-01'),
          endDate: new Date('2024-01-31'),
          actualStartDate: new Date('2023-10-01'),
          actualEndDate: new Date('2024-01-28')
        },
        owner: users[3]._id, // Emily Davis
        team: [
          {
            user: users[3]._id,
            role: 'owner',
            permissions: {
              canEdit: true,
              canDelete: true,
              canInvite: true,
              canManageTasks: true
            }
          },
          {
            user: users[1]._id, // Sarah Wilson
            role: 'designer',
            permissions: {
              canEdit: true,
              canDelete: false,
              canInvite: false,
              canManageTasks: true
            }
          }
        ],
        tags: ['analytics', 'marketing', 'dashboard'],
        color: '#f59e0b',
        progress: 100
      }
    ]);

    console.log('📋 Created sample projects');

    // Update users with their projects
    await User.findByIdAndUpdate(users[0]._id, {
      $push: { projects: projects[0]._id }
    });

    await User.findByIdAndUpdate(users[1]._id, {
      $push: { projects: { $each: [projects[0]._id, projects[1]._id, projects[2]._id] } }
    });

    await User.findByIdAndUpdate(users[2]._id, {
      $push: { projects: { $each: [projects[0]._id, projects[1]._id] } }
    });

    await User.findByIdAndUpdate(users[3]._id, {
      $push: { projects: projects[2]._id }
    });

    await User.findByIdAndUpdate(users[4]._id, {
      $push: { projects: projects[1]._id }
    });

    console.log('🔗 Updated user-project relationships');

    // Add some activity logs
    for (const project of projects) {
      await project.logActivity(project.owner, 'project_created', {
        projectName: project.name
      });

      if (project.status === 'active') {
        await project.logActivity(project.owner, 'project_started', {
          startDate: project.timeline.actualStartDate
        });
      }

      if (project.status === 'completed') {
        await project.logActivity(project.owner, 'project_completed', {
          completedDate: project.timeline.actualEndDate
        });
      }
    }

    console.log('📝 Added activity logs');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Sample Users Created:');
    console.log('Admin: admin@company.com / admin123');
    console.log('Manager: sarah@company.com / password123');
    console.log('Member: mike@company.com / password123');
    console.log('Member: emily@company.com / password123');
    console.log('Member: alex@company.com / password123');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();