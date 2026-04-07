#!/usr/bin/env node

/**
 * Railway Deployment Script
 * Automated deployment to Railway with environment variables
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Railway Deployment Script for Stratify Backend\n');

// Environment variables for Railway
const railwayEnvVars = {
  NODE_ENV: 'production',
  PORT: '5000',
  MONGODB_URI: 'mongodb+srv://stratify-admin:Rs9826348254@stratify-cluster.7jv5xvd.mongodb.net/stratify?retryWrites=true&w=majority',
  JWT_SECRET: 'stratify-production-jwt-secret-2024-change-this',
  JWT_REFRESH_SECRET: 'stratify-production-refresh-secret-2024-change-this',
  JWT_EXPIRE: '7d',
  JWT_REFRESH_EXPIRE: '30d',
  CLIENT_URL: 'https://stratify-31.vercel.app',
  EMAIL_SERVICE: 'gmail',
  EMAIL_HOST: 'smtp.gmail.com',
  EMAIL_PORT: '587',
  EMAIL_SECURE: 'false',
  EMAIL_USER: 'roshankumarsingh021@gmail.com',
  EMAIL_PASS: 'dysmkgiupnjvehbd'
};

function runCommand(command, description) {
  console.log(`⏳ ${description}...`);
  try {
    const output = execSync(command, { 
      stdio: 'pipe',
      encoding: 'utf8',
      cwd: process.cwd()
    });
    console.log(`✅ ${description} completed`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    if (error.stdout) console.log('Output:', error.stdout);
    if (error.stderr) console.log('Error:', error.stderr);
    throw error;
  }
}

async function deployToRailway() {
  try {
    console.log('📋 Step 1: Checking Railway authentication...');
    const whoami = runCommand('npx @railway/cli whoami', 'Checking authentication');
    console.log(`   Logged in as: ${whoami.trim()}`);

    console.log('\n📋 Step 2: Checking project status...');
    try {
      const status = runCommand('npx @railway/cli status', 'Getting project status');
      console.log('   Project already linked');
    } catch (error) {
      console.log('   No project linked, this is expected for new deployments');
    }

    console.log('\n📋 Step 3: Deploying to Railway...');
    console.log('   This will create a new service and deploy your backend');
    
    // Try to deploy directly
    try {
      const deployOutput = runCommand('npx @railway/cli up --detach', 'Deploying to Railway');
      console.log('✅ Deployment initiated successfully!');
      
      // Extract service URL if available
      const lines = deployOutput.split('\n');
      const urlLine = lines.find(line => line.includes('https://') && line.includes('railway.app'));
      if (urlLine) {
        const url = urlLine.match(/https:\/\/[^\s]+/)?.[0];
        if (url) {
          console.log(`🔗 Service URL: ${url}`);
        }
      }
      
    } catch (deployError) {
      console.log('⚠️ Direct deployment failed, trying alternative method...');
      
      // Try adding service first
      console.log('\n📋 Step 4: Adding service to project...');
      try {
        runCommand('npx @railway/cli add --name stratify-backend', 'Adding service');
      } catch (addError) {
        console.log('   Service addition failed, continuing with deployment...');
      }
      
      // Try deployment again
      runCommand('npx @railway/cli up', 'Deploying with service');
    }

    console.log('\n📋 Step 4: Setting environment variables...');
    
    // Set environment variables one by one
    for (const [key, value] of Object.entries(railwayEnvVars)) {
      try {
        runCommand(`npx @railway/cli variables set ${key}="${value}"`, `Setting ${key}`);
        console.log(`   ✅ ${key} set successfully`);
      } catch (error) {
        console.log(`   ⚠️ Failed to set ${key}, you may need to set it manually`);
      }
    }

    console.log('\n📋 Step 5: Getting deployment information...');
    try {
      const status = runCommand('npx @railway/cli status', 'Getting final status');
      console.log('📊 Deployment Status:');
      console.log(status);
    } catch (error) {
      console.log('   Could not get status, but deployment may still be successful');
    }

    console.log('\n🎉 Railway Deployment Process Complete!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Check Railway dashboard: https://railway.app');
    console.log('   2. Verify your service is running');
    console.log('   3. Test the API health endpoint');
    console.log('   4. Update your frontend environment variables');
    
    console.log('\n🔧 If environment variables failed to set:');
    console.log('   Go to Railway dashboard → Your project → Variables tab');
    console.log('   Add the following variables manually:');
    Object.entries(railwayEnvVars).forEach(([key, value]) => {
      const displayValue = key.includes('SECRET') || key.includes('PASS') || key.includes('URI') 
        ? value.substring(0, 20) + '...' 
        : value;
      console.log(`   ${key}=${displayValue}`);
    });

  } catch (error) {
    console.error('\n💥 Deployment failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure you are logged in: npx @railway/cli login');
    console.log('   2. Check your internet connection');
    console.log('   3. Try deploying via Railway web interface');
    console.log('   4. See RAILWAY_DEPLOYMENT.md for manual deployment steps');
    process.exit(1);
  }
}

// Run deployment
deployToRailway();