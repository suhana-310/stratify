import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function checkUsers() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📋 Checking existing users...');
    const users = await User.find({}).select('name email status createdAt');
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      
      console.log('\n🔧 Creating test user...');
      const testUser = await User.create({
        name: 'Roshan Kumar Singh',
        email: 'roshankumarsingh021@gmail.com',
        password: 'password123',
        department: 'Development',
        status: 'active',
        isEmailVerified: true
      });
      
      console.log('✅ Test user created successfully');
      console.log(`   Name: ${testUser.name}`);
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Status: ${testUser.status}`);
    } else {
      console.log(`✅ Found ${users.length} users:`);
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.status}`);
      });
      
      // Check if our test user exists
      const testUser = await User.findOne({ email: 'roshankumarsingh021@gmail.com' });
      if (!testUser) {
        console.log('\n🔧 Creating test user...');
        const newTestUser = await User.create({
          name: 'Roshan Kumar Singh',
          email: 'roshankumarsingh021@gmail.com',
          password: 'password123',
          department: 'Development',
          status: 'active',
          isEmailVerified: true
        });
        console.log('✅ Test user created successfully');
      } else {
        console.log('\n✅ Test user already exists');
        console.log(`   Status: ${testUser.status}`);
        console.log(`   Email Verified: ${testUser.isEmailVerified}`);
      }
    }

    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

checkUsers().catch(console.error);