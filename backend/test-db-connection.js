#!/usr/bin/env node

/**
 * MongoDB Atlas Connection Test
 * Tests the database connection and basic operations
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Testing MongoDB Atlas Connection...\n');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable not found');
  console.log('📋 Please set MONGODB_URI in your .env file');
  console.log('   Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stratify?retryWrites=true&w=majority');
  process.exit(1);
}

// Hide password in logs
const safeUri = MONGODB_URI.replace(/:([^:@]{8})[^:@]*@/, ':$1***@');
console.log('🔗 Connecting to:', safeUri);

async function testConnection() {
  try {
    // Connect to MongoDB
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully!');

    // Test database operations
    console.log('\n🧪 Testing database operations...');

    // Get database info
    const db = mongoose.connection.db;
    const admin = db.admin();
    
    // Test 1: Check database stats
    try {
      const stats = await db.stats();
      console.log('✅ Database stats retrieved');
      console.log(`   Database: ${stats.db}`);
      console.log(`   Collections: ${stats.collections}`);
      console.log(`   Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    } catch (error) {
      console.log('⚠️ Could not retrieve database stats (this is normal for new databases)');
    }

    // Test 2: List collections
    try {
      const collections = await db.listCollections().toArray();
      console.log('✅ Collections list retrieved');
      if (collections.length > 0) {
        console.log('   Existing collections:');
        collections.forEach(col => console.log(`   - ${col.name}`));
      } else {
        console.log('   No collections yet (this is normal for new databases)');
      }
    } catch (error) {
      console.log('⚠️ Could not list collections:', error.message);
    }

    // Test 3: Create a test document
    console.log('\n🧪 Testing document operations...');
    
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('ConnectionTest', TestSchema);

    // Insert test document
    const testDoc = new TestModel({ name: 'Connection Test' });
    await testDoc.save();
    console.log('✅ Test document created successfully');

    // Read test document
    const foundDoc = await TestModel.findOne({ name: 'Connection Test' });
    if (foundDoc) {
      console.log('✅ Test document retrieved successfully');
      console.log(`   ID: ${foundDoc._id}`);
      console.log(`   Created: ${foundDoc.createdAt}`);
    }

    // Update test document
    await TestModel.updateOne({ _id: foundDoc._id }, { name: 'Connection Test Updated' });
    console.log('✅ Test document updated successfully');

    // Delete test document
    await TestModel.deleteOne({ _id: foundDoc._id });
    console.log('✅ Test document deleted successfully');

    // Clean up test collection
    await TestModel.collection.drop();
    console.log('✅ Test collection cleaned up');

    console.log('\n🎉 All database tests passed!');
    console.log('\n📋 Connection Summary:');
    console.log('   ✅ Connection: Working');
    console.log('   ✅ Authentication: Valid');
    console.log('   ✅ Read Operations: Working');
    console.log('   ✅ Write Operations: Working');
    console.log('   ✅ Update Operations: Working');
    console.log('   ✅ Delete Operations: Working');
    
    console.log('\n🚀 Your MongoDB Atlas database is ready for Stratify!');

  } catch (error) {
    console.error('\n❌ Database connection test failed:');
    console.error('   Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Troubleshooting Authentication:');
      console.log('   1. Check your username and password in the connection string');
      console.log('   2. Ensure the database user exists in Atlas');
      console.log('   3. Verify the user has proper permissions');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
      console.log('\n🔧 Troubleshooting Network:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify IP address is whitelisted in Atlas (0.0.0.0/0 for all)');
      console.log('   3. Check if firewall is blocking the connection');
    } else if (error.message.includes('MongoServerError')) {
      console.log('\n🔧 Troubleshooting Server:');
      console.log('   1. Check if the cluster is running in Atlas dashboard');
      console.log('   2. Verify the connection string format');
      console.log('   3. Ensure the database name is correct');
    }
    
    console.log('\n📖 For more help, see: MONGODB_ATLAS_SETUP.md');
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Test interrupted by user');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('uncaughtException', async (error) => {
  console.error('\n💥 Uncaught exception:', error.message);
  await mongoose.connection.close();
  process.exit(1);
});

// Run the test
testConnection();