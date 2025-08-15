#!/usr/bin/env bun

import { generateDummyData } from './dataGenerator';

async function main() {
  console.log('🚀 Starting Boatable data generation...');
  
  try {
    // Generate mock data with smaller numbers for testing
    console.log('📊 Generating mock data...');
    const data = await generateDummyData({
      userCount: 5,
      maxFriendsPerUser: 3,
      maxPostsPerUser: 2,
      maxCommentsPerPost: 3,
      maxReactionsPerPost: 5,
      maxChatsPerUser: 2,
      maxMessagesPerChat: 10,
      maxImagesPerPost: 1
    });
    
    console.log(`✅ Generated ${data.users.length} users`);
    console.log(`✅ Generated ${data.posts.length} posts`);
    console.log(`✅ Generated ${data.chats.length} chats`);
    
    // Save data to files for Firebase import
    console.log('💾 Saving Firebase data to files...');
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Save Firebase structured data
    const dataDir = path.join(process.cwd(), 'src', 'data');
    
    await fs.writeFile(
      path.join(dataDir, 'firebase-users.json'),
      JSON.stringify(data.firebase.users, null, 2)
    );
    
    await fs.writeFile(
      path.join(dataDir, 'firebase-chats.json'),
      JSON.stringify(data.firebase.chats, null, 2)
    );
    
    await fs.writeFile(
      path.join(dataDir, 'firebase-posts.json'),
      JSON.stringify(data.firebase.posts, null, 2)
    );
    
    await fs.writeFile(
      path.join(dataDir, 'firebase-usersPublicData.json'),
      JSON.stringify(data.firebase.usersPublicData, null, 2)
    );
    
    await fs.writeFile(
      path.join(dataDir, 'algolia-search.json'),
      JSON.stringify(data.algoliaSearchObjects, null, 2)
    );
    
    console.log('✅ Data saved to src/data/ directory');
    
    console.log('🎉 Data generation complete!');
  } catch (error) {
    console.error('❌ Error generating data:', error);
    process.exit(1);
  }
}

main();