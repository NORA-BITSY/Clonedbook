#!/usr/bin/env bun

import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';

interface SimpleUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl?: string;
}

interface SimplePost {
  id: string;
  ownerId: string;
  text: string;
  createdAt: string;
  likes: number;
}

interface SimpleData {
  users: SimpleUser[];
  posts: SimplePost[];
  friendships: Array<{ userId1: string; userId2: string }>;
}

function getRandomExistingImage(type: 'profiles' | 'backgrounds' | 'posts'): string | undefined {
  const imageDir = path.join(process.cwd(), 'src', 'data', 'images', type);
  try {
    const files = require('fs').readdirSync(imageDir);
    if (files.length === 0) return undefined;
    const randomFile = files[Math.floor(Math.random() * files.length)];
    return `/src/data/images/${type}/${randomFile}`;
  } catch {
    return undefined;
  }
}

async function generateSimpleData(options: {
  userCount: number;
  postsPerUser: number;
  friendConnectionsPerUser: number;
}): Promise<SimpleData> {
  
  console.log('📊 Generating users...');
  const users: SimpleUser[] = [];
  
  // Generate users
  for (let i = 0; i < options.userCount; i++) {
    const user: SimpleUser = {
      id: uuidv4(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      pictureUrl: getRandomExistingImage('profiles')
    };
    users.push(user);
  }
  
  console.log('📝 Generating posts...');
  const posts: SimplePost[] = [];
  
  // Generate posts
  for (const user of users) {
    for (let i = 0; i < options.postsPerUser; i++) {
      const post: SimplePost = {
        id: uuidv4(),
        ownerId: user.id,
        text: faker.lorem.paragraph(),
        createdAt: faker.date.past().toISOString(),
        likes: Math.floor(Math.random() * 100)
      };
      posts.push(post);
    }
  }
  
  console.log('🤝 Generating friendships...');
  const friendships: Array<{ userId1: string; userId2: string }> = [];
  
  // Generate friendships
  for (const user of users) {
    const potentialFriends = users.filter(u => u.id !== user.id);
    const friendCount = Math.min(
      options.friendConnectionsPerUser, 
      potentialFriends.length
    );
    
    for (let i = 0; i < friendCount; i++) {
      const friend = potentialFriends[Math.floor(Math.random() * potentialFriends.length)];
      
      // Avoid duplicate friendships
      const existing = friendships.find(f => 
        (f.userId1 === user.id && f.userId2 === friend.id) ||
        (f.userId1 === friend.id && f.userId2 === user.id)
      );
      
      if (!existing) {
        friendships.push({
          userId1: user.id,
          userId2: friend.id
        });
      }
    }
  }
  
  return { users, posts, friendships };
}

async function main() {
  console.log('🚀 Starting simple Boatable data generation...');
  
  try {
    const data = await generateSimpleData({
      userCount: 10,
      postsPerUser: 5,
      friendConnectionsPerUser: 3
    });
    
    console.log(`✅ Generated ${data.users.length} users`);
    console.log(`✅ Generated ${data.posts.length} posts`);
    console.log(`✅ Generated ${data.friendships.length} friendships`);
    
    // Save to file
    const outputPath = path.join(process.cwd(), 'generated-simple-data.json');
    await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`💾 Data saved to ${outputPath}`);
    console.log('🎉 Simple data generation complete!');
    
  } catch (error) {
    console.error('❌ Error generating data:', error);
    process.exit(1);
  }
}

main();