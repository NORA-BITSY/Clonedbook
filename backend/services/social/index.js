const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { z } = require('zod');
const { problemHandler, makeProblem } = require('../../utils/problemDetails');

const app = express();
const port = 3011; // Assuming a port for social service

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'social_db';
const COLLECTION_NAME = 'posts';

let db;

async function connectToMongo() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');

    // Ensure indexes
    await db.collection(COLLECTION_NAME).createIndex({ createdAt: 1 });
    await db.collection(COLLECTION_NAME).createIndex({ userId: 1 });
    console.log('MongoDB indexes ensured.');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Basic profanity filter stub
function containsProfanity(text) {
  const profanities = ['badword1', 'badword2']; // Example profanities
  return profanities.some(word => text.toLowerCase().includes(word));
}

// Zod schema for post creation
const createPostSchema = z.object({
  userId: z.string().min(1),
  content: z.string().min(1).max(500), // Max length limit
});

app.use(express.json({ limit: '10kb' })); // Body limits

app.post('/api/social/posts', async (req, res, next) => {
  try {
    const { userId, content } = createPostSchema.parse(req.body);

    if (containsProfanity(content)) {
      throw makeProblem(400, 'Content Policy Violation', 'Post contains prohibited language.', 'https://boatable.app/problems/content-policy');
    }

    const newPost = {
      userId,
      content,
      createdAt: new Date(),
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newPost);
    res.status(201).json({ message: 'Post created', postId: result.insertedId });
  } catch (error) {
    next(error);
  }
});

app.get('/api/social/posts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      throw makeProblem(400, 'Bad Request', 'Invalid Post ID format.', 'https://boatable.app/problems/invalid-id');
    }

    const post = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });

    if (!post) {
      throw makeProblem(404, 'Not Found', 'Post not found.', 'https://boatable.app/problems/post-not-found');
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
});

app.use(problemHandler);

connectToMongo(); // Connect to MongoDB on startup

app.listen(port, () => {
  console.log(`Social service listening on port ${port}`);
});
