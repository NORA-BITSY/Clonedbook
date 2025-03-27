import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Import existing interfaces from the codebase
import { IChat } from '@/types/chat';
import { IComment, ICommentMap } from '@/types/comment';
import { IFriendsMap, IPublicFriendsMap, TFriendStatus } from '@/types/firend';
import { IMessage } from '@/types/message';
import { IPictureWithPlaceholders } from '@/types/picture';
import { IPost } from '@/types/post';
import { IReactionsMap, TReactionType } from '@/types/reaction';
import { ITimestamp } from '@/types/timestamp';
import {
  IContactInfo,
  IUser,
  IUserBasicInfo,
  IUserCustomAbout,
  IUserStringAbout,
  TKinship,
  TRealationshipStatus,
  TUserSex,
} from '@/types/user';
import { generateImages } from './imageGenerator';

export interface IAlgoliaSearchObject {
  objectID: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  pictureUrl?: string;
}

export interface IUserMetadata {
  popularityTier: 'low' | 'medium' | 'high';
  activityLevel: 'inactive' | 'low' | 'medium' | 'high';
}

export interface IGenerationOptions {
  userCount: number;
  maxFriendsPerUser: number;
  maxPostsPerUser: number;
  maxCommentsPerPost: number;
  maxReactionsPerPost: number;
  maxChatsPerUser: number;
  maxMessagesPerChat: number;
}

export interface IGeneratedUser extends IUser {
  popularityTier: 'low' | 'medium' | 'high';
  activityLevel: 'inactive' | 'low' | 'medium' | 'high';
}

export interface IGeneratedChat extends IChat {}

export interface IGeneratedMessage extends IMessage {
  chatId: string;
  reactions: IReactionsMap;
}

export interface IGeneratedPost extends IPost {
  privacy?: 'public' | 'friends' | 'private';
}

export interface IGeneratedComment extends IComment {}

export interface IGeneratedData {
  users: IGeneratedUser[];
  chats: IGeneratedChat[];
  posts: IGeneratedPost[];
  algoliaSearchObjects: IAlgoliaSearchObject[];
  firebase: {
    users: Record<string, IGeneratedUser>;
    chats: Record<string, IGeneratedChat>;
    posts: Record<string, IGeneratedPost>;
    usersPublicData: {
      usersBasicInfo: Record<string, IUserBasicInfo>;
      usersPublicFriends: Record<string, IPublicFriendsMap>;
    };
  };
}

// Helper functions
function msToTimestamp(ms: number): ITimestamp {
  return {
    seconds: Math.floor(ms / 1000),
    nanoseconds: (ms % 1000) * 1000000,
  };
}

function dateToTimestamp(date: Date): ITimestamp {
  return msToTimestamp(date.getTime());
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomSubset<T>(array: T[], maxCount: number): T[] {
  if (maxCount <= 0) return [];
  const count = Math.floor(Math.random() * maxCount) + 1;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

function shouldFill(probability: number): boolean {
  return Math.random() < probability;
}

function getChatId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join('_');
}

function getRandomEmoji(): string {
  const emojis = ['😀', '😊', '🥰', '😎', '🔥', '💯', '👍', '❤️', '💙', '💚', '💜', '🧡', '💛'];
  return getRandomElement(emojis);
}

function getRandomColor(): string {
  const colors = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#FF33A8',
    '#33A8FF',
    '#A833FF',
    '#FF8333',
    '#33FFC4',
  ];
  return getRandomElement(colors);
}

// User metadata generation
function assignUserPopularityTier(): 'low' | 'medium' | 'high' {
  const random = Math.random();
  if (random < 0.6) return 'low';
  if (random < 0.9) return 'medium';
  return 'high';
}

function assignUserActivityLevel(): 'inactive' | 'low' | 'medium' | 'high' {
  const random = Math.random();
  if (random < 0.2) return 'inactive';
  if (random < 0.5) return 'low';
  if (random < 0.8) return 'medium';
  return 'high';
}

// Generate user
async function generateUser(
  userId: string,
  gender: 'male' | 'female',
  baseDir?: string,
): Promise<IGeneratedUser> {
  const firstName = faker.person.firstName(gender as any);
  const lastName = faker.person.lastName();
  const middleName = shouldFill(0.3) ? faker.person.middleName() : undefined;

  // Set default baseDir
  const outputBaseDir = baseDir || path.join(process.cwd(), 'src', 'data');

  // Ensure output directories exist
  const profileOutputDir = path.join(outputBaseDir, 'images', 'profiles');
  const backgroundOutputDir = path.join(outputBaseDir, 'images', 'backgrounds');
  if (!fs.existsSync(profileOutputDir)) fs.mkdirSync(profileOutputDir, { recursive: true });
  if (!fs.existsSync(backgroundOutputDir)) fs.mkdirSync(backgroundOutputDir, { recursive: true });

  // Generate profile picture
  const profilePictureId = uuidv4();
  const [profilePictureData] = await generateImages({
    type: 'profile',
    gender,
    count: 1,
  });

  // Save profile picture
  const profilePictureFilename = `${profilePictureId}.webp`;
  const profilePicturePath = path.join(profileOutputDir, profilePictureFilename);
  await fs.promises.writeFile(profilePicturePath, profilePictureData.webpBuffer);

  // Generate background picture (optional)
  let backgroundPictureId: string | undefined = undefined;
  let backgroundPictureData: any = undefined;
  let backgroundPicturePath: string | undefined = undefined;

  if (shouldFill(0.5)) {
    backgroundPictureId = uuidv4();
    [backgroundPictureData] = await generateImages({ type: 'background', count: 1 });
    const backgroundPictureFilename = `${backgroundPictureId}.webp`;
    backgroundPicturePath = path.join(backgroundOutputDir, backgroundPictureFilename);
    await fs.promises.writeFile(backgroundPicturePath, backgroundPictureData.webpBuffer);
  }

  const isDummy = false;
  const groups = {};
  const friends: IFriendsMap = {};
  const contact: IContactInfo = {
    email: faker.internet.email({ firstName, lastName }),
    phoneNumber: faker.phone.number(),
  };

  const birthDate = shouldFill(0.7)
    ? dateToTimestamp(faker.date.birthdate({ min: 18, max: 65, mode: 'age' }))
    : undefined;

  const about: IUserStringAbout & IUserCustomAbout = {
    bio: shouldFill(0.7) ? faker.lorem.paragraph() : undefined,
    hometown: shouldFill(0.5) ? faker.location.city() : undefined,
    city: shouldFill(0.5) ? faker.location.city() : undefined,
    workplace: shouldFill(0.5) ? faker.company.name() : undefined,
    jobTitle: shouldFill(0.3) ? faker.person.jobTitle() : undefined,
    sex: gender as TUserSex,
    intrests: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => faker.word.sample()),
    relationship: shouldFill(0.5)
      ? {
          status: getRandomElement([
            'single',
            "it's complicated",
            'engaged',
            'married',
            'in relation',
          ] as TRealationshipStatus[]),
          partnerId: undefined, // Will be set later if needed
        }
      : undefined,
    birthDate,
    relatives: {},
  };

  // Create URLs for Firebase Storage emulator
  const profilePictureUrl = `http://localhost:9199/v0/b/demo-project.appspot.com/o/images%2Fprofiles%2F${profilePictureFilename}?alt=media`;
  const backgroundPictureUrl = backgroundPicturePath
    ? `http://localhost:9199/v0/b/demo-project.appspot.com/o/images%2Fbackgrounds%2F${backgroundPictureId}.webp?alt=media`
    : undefined;

  return {
    id: userId,
    firstName,
    lastName,
    middleName,
    pictureUrl: profilePictureUrl,
    backgroundPicture: backgroundPictureUrl,
    backgroundPictureId,
    profilePictureId,
    isDummy,
    groups,
    friends,
    contact,
    about,
    popularityTier: assignUserPopularityTier(),
    activityLevel: assignUserActivityLevel(),
  };
}

// Handle user relationships
function handleUserRelationships(users: IGeneratedUser[]): void {
  for (const user of users) {
    // Partnership (based on popularity)
    if (shouldFill(0.5)) {
      const partnerStatusOptions: TRealationshipStatus[] = [
        'single',
        "it's complicated",
        'engaged',
        'married',
        'in relation',
      ];
      const status = getRandomElement(partnerStatusOptions);

      user.about.relationship = { status };

      // Assign partner if not single
      if (status !== 'single') {
        const potentialPartners = users.filter(
          (p) =>
            p.id !== user.id && (!p.about.relationship || p.about.relationship.status === 'single'),
        );

        if (potentialPartners.length > 0) {
          const partner = getRandomElement(potentialPartners);
          if (user.about.relationship) {
            user.about.relationship.partnerId = partner.id;
          }

          // Update partner's status too
          partner.about.relationship = {
            status: user.about.relationship?.status || 'single',
            partnerId: user.id,
          };
        }
      }
    }

    // Add relatives
    if (shouldFill(0.3)) {
      const potentialRelatives = users.filter((p) => p.id !== user.id);
      const relativeCount = Math.floor(Math.random() * 3) + 1;
      const relatives = getRandomSubset(potentialRelatives, relativeCount);

      const relationTypes: TKinship[] = ['parent', 'child', 'sibling', 'cousin'];

      for (const relative of relatives) {
        const relation = getRandomElement(relationTypes);
        user.about.relatives[relative.id] = relation;

        // Add reciprocal relationship
        let reciprocalRelation: TKinship;

        if (relation === 'parent') {
          reciprocalRelation = 'child';
        } else if (relation === 'child') {
          reciprocalRelation = 'parent';
        } else {
          // sibling and cousin remain the same
          reciprocalRelation = relation;
        }

        relative.about.relatives[user.id] = reciprocalRelation;
      }
    }
  }
}

// Handle friendships
function handleFriendships(users: IGeneratedUser[], maxFriendsPerUser: number): void {
  for (const user of users) {
    const { popularityTier, activityLevel } = user;

    // Determine friend count based on popularity and activity
    let maxFriends = maxFriendsPerUser;
    if (popularityTier === 'high') {
      maxFriends =
        Math.floor(maxFriendsPerUser * 0.8) + Math.floor(Math.random() * (maxFriendsPerUser * 0.2));
    } else if (popularityTier === 'medium') {
      maxFriends =
        Math.floor(maxFriendsPerUser * 0.4) + Math.floor(Math.random() * (maxFriendsPerUser * 0.4));
    } else {
      maxFriends = Math.floor(Math.random() * (maxFriendsPerUser * 0.4));
    }

    // Further adjust based on activity level
    if (activityLevel === 'inactive') maxFriends = Math.floor(maxFriends * 0.3);
    else if (activityLevel === 'low') maxFriends = Math.floor(maxFriends * 0.6);
    else if (activityLevel === 'medium') maxFriends = Math.floor(maxFriends * 0.8);

    // Find potential friends
    const potentialFriends = users.filter((p) => p.id !== user.id && !(p.id in user.friends));
    if (!potentialFriends.length) continue;

    // Create friends
    const friendCount = Math.floor(Math.random() * maxFriends) + 1;
    const selectedFriends = getRandomSubset(potentialFriends, friendCount);

    for (const friend of selectedFriends) {
      // Skip if already friends
      if (friend.id in user.friends) continue;

      // Determine friendship status
      let status: TFriendStatus;
      const acceptanceRate =
        popularityTier === 'high' ? 0.9 : popularityTier === 'medium' ? 0.7 : 0.5;

      if (Math.random() < acceptanceRate) {
        status = 'accepted';
      } else {
        status = Math.random() > 0.5 ? 'req_sent' : 'req_received';
      }

      // Create chat ID for accepted friends
      let chatId = '';
      let acceptedAt: ITimestamp | undefined;

      if (status === 'accepted') {
        chatId = getChatId(user.id, friend.id);
        // Create timestamp from 1-12 months ago
        const monthsAgo = Math.floor(Math.random() * 12) + 1;
        const acceptedAtDate = new Date();
        acceptedAtDate.setMonth(acceptedAtDate.getMonth() - monthsAgo);
        acceptedAt = dateToTimestamp(acceptedAtDate);
      }

      // Add friendship to user
      user.friends[friend.id] = {
        id: friend.id,
        chatId,
        status,
        acceptedAt: acceptedAt || msToTimestamp(0),
      };

      // Add reciprocal friendship to friend if not already friends
      if (!(user.id in friend.friends)) {
        const reciprocalStatus: TFriendStatus =
          status === 'accepted' ? 'accepted' : status === 'req_sent' ? 'req_received' : 'req_sent';

        friend.friends[user.id] = {
          id: user.id,
          chatId,
          status: reciprocalStatus,
          acceptedAt: acceptedAt || msToTimestamp(0),
        };
      }
    }
  }
}

// Calculate post virality
function calculateViralityScore(post: IGeneratedPost, user: IGeneratedUser): number {
  let score = 0;

  // User popularity
  if (user.popularityTier === 'high') score += 0.4;
  else if (user.popularityTier === 'medium') score += 0.2;

  // Content type
  if (post.pictures && post.pictures.length > 0) score += 0.3;
  if (post.text) {
    // Check for viral keywords
    const viralKeywords = ['amazing', 'incredible', 'awesome', 'wow', 'omg', 'viral', 'breaking'];
    const textLower = post.text.toLowerCase();
    score += viralKeywords.filter((keyword) => textLower.includes(keyword)).length * 0.1;

    // Optimal text length
    const wordCount = post.text.split(' ').length;
    if (wordCount >= 20 && wordCount <= 100) score += 0.2;
  }

  // Time of day
  const hour = new Date(post.createdAt.seconds * 1000).getHours();
  if (hour >= 8 && hour <= 22) score += 0.2; // Active hours

  return Math.min(score, 1); // Normalize to 0-1
}

// Generate reactions for a post
function generateReactionsForViralPost(
  post: IGeneratedPost,
  users: IGeneratedUser[],
  viralityScore: number,
): IReactionsMap {
  const reactions: IReactionsMap = {};

  // Calculate number of reactions based on virality score
  const baseReactions = Math.floor(users.length * viralityScore * 0.7);
  const actualReactions = Math.min(
    baseReactions + Math.floor(Math.random() * baseReactions * 0.3),
    users.length - 1,
  );

  const reactors = getRandomSubset(
    users.filter((u) => u.id !== post.ownerId),
    actualReactions,
  );

  for (const reactor of reactors) {
    // Viral posts tend to get more positive reactions
    const reactionTypes: TReactionType[] = ['like', 'love', 'wow'];
    if (viralityScore > 0.8) {
      // Highly viral posts get more varied reactions
      reactionTypes.push('haha', 'care');
    }
    reactions[reactor.id] = getRandomElement(reactionTypes);
  }

  return reactions;
}

// Generate comments for a post
function generateCommentsForViralPost(
  post: IGeneratedPost,
  users: IGeneratedUser[],
  viralityScore: number,
  maxComments: number,
): ICommentMap {
  const comments: ICommentMap = {};

  // Calculate number of comments based on virality score
  const baseComments = Math.floor(maxComments * viralityScore);
  const actualComments = Math.min(
    baseComments + Math.floor(Math.random() * baseComments * 0.3),
    users.length - 1,
  );

  const commenters = getRandomSubset(
    users.filter((u) => u.id !== post.ownerId),
    actualComments,
  );

  for (const commenter of commenters) {
    const commentId = uuidv4();

    // Generate more engaging comments for viral posts
    const viralComments = [
      'This is absolutely phenomenal! The world needs to see this! 🔥✨',
      'I am utterly speechless! This deserves all the recognition! 👏💯',
      'My jaw literally dropped to the floor! Extraordinary content! 😮🤩',
      'Mind = completely and utterly blown into another dimension! 🧠💥',
      'This single-handedly transformed my entire day from ordinary to exceptional! ❤️💖',
      'I have already shared this with my entire contact list! Pure brilliance! 🙌🌟',
      "If this doesn't go viral, I've lost all faith in humanity! Magnificent! 🚀🌍",
      'Without a doubt the most spectacular thing I have encountered all week! ⭐💎',
    ];

    const comment: IComment = {
      id: commentId,
      ownerId: commenter.id,
      commentText:
        viralityScore > 0.7 && Math.random() > 0.5
          ? getRandomElement(viralComments)
          : faker.lorem.sentences(Math.floor(Math.random() * 2) + 1),
      createdAt: dateToTimestamp(
        new Date(post.createdAt.seconds * 1000 + Math.random() * 86400000 * 3),
      ), // Within 3 days
      responses: {},
      reactions: {},
    };

    // Add reactions to comments on viral posts
    if (viralityScore > 0.6) {
      const reactionCount = Math.floor(Math.random() * 10 * viralityScore) + 1;
      const reactors = getRandomSubset(
        users.filter((u) => u.id !== commenter.id),
        reactionCount,
      );

      const reactions: IReactionsMap = {};
      for (const reactor of reactors) {
        reactions[reactor.id] = getRandomElement(['like', 'love', 'haha']);
      }
      comment.reactions = reactions;
    }

    comments[commentId] = comment;
  }

  return comments;
}

// Main data generation function
export async function generateDummyData(
  options: IGenerationOptions,
  dataDir?: string,
): Promise<IGeneratedData> {
  const {
    userCount,
    maxFriendsPerUser,
    maxPostsPerUser,
    maxCommentsPerPost,
    maxReactionsPerPost,
    maxChatsPerUser,
    maxMessagesPerChat,
  } = options;

  // Default data directory is now src/data
  const baseDir = dataDir || path.join(process.cwd(), 'src', 'data');

  // Data containers
  const users: IGeneratedUser[] = [];
  const chats: IGeneratedChat[] = [];
  const posts: IGeneratedPost[] = [];
  const algoliaSearchObjects: IAlgoliaSearchObject[] = [];

  // 1. Generate users with metadata
  console.log('Generating users...');
  for (let i = 0; i < userCount; i++) {
    const userId = uuidv4();
    const gender = Math.random() > 0.5 ? 'male' : 'female';

    // Generate user
    const generatedUser = await generateUser(userId, gender, baseDir);
    users.push(generatedUser);

    // Create Algolia search object
    algoliaSearchObjects.push({
      objectID: userId,
      firstName: generatedUser.firstName,
      lastName: generatedUser.lastName,
      middleName: generatedUser.middleName,
      ...(generatedUser.pictureUrl ? { pictureUrl: generatedUser.pictureUrl } : {}),
    });
  }

  // Handle user relationships
  handleUserRelationships(users);

  // Handle friendships
  handleFriendships(users, maxFriendsPerUser);

  // 2. Generate chats
  console.log('Generating chats...');
  const chatIds = new Set<string>();

  // Find all unique chat IDs from friendships
  for (const user of users) {
    for (const friendId in user.friends) {
      const friend = user.friends[friendId];
      if (friend.status === 'accepted' && friend.chatId) {
        chatIds.add(friend.chatId);
      }
    }
  }

  // Create chat objects
  for (const chatId of Array.from(chatIds)) {
    const [userId1, userId2] = chatId.split('_');

    // Create chat
    const chat: IGeneratedChat = {
      id: chatId,
      users: [userId1, userId2],
      messages: [],
      chatEmoji: Math.random() > 0.7 ? getRandomEmoji() : undefined,
      chatColor: Math.random() > 0.7 ? getRandomColor() : undefined,
    };

    // Generate messages
    const messageCount = Math.floor(Math.random() * maxMessagesPerChat) + 1;
    const chatCreatedAt = new Date();
    chatCreatedAt.setMonth(chatCreatedAt.getMonth() - Math.floor(Math.random() * 12));

    for (let i = 0; i < messageCount; i++) {
      const messageDate = new Date(chatCreatedAt);
      messageDate.setMinutes(messageDate.getMinutes() + i * Math.floor(Math.random() * 60));

      const message: IMessage = {
        id: uuidv4(),
        senderId: Math.random() > 0.5 ? userId1 : userId2,
        text: faker.lorem.sentences(Math.floor(Math.random() * 3) + 1),
        createdAt: dateToTimestamp(messageDate),
        pictures: Math.random() > 0.8 ? [] : undefined, // Usually no pictures
      };

      chat.messages.push(message);
    }

    chats.push(chat);
  }

  // 3. Generate posts
  console.log('Generating posts...');
  for (const user of users) {
    const { popularityTier, activityLevel } = user;

    // Adjust post count based on activity level
    let userPostCount = 0;
    if (activityLevel === 'inactive') {
      userPostCount = Math.floor(Math.random() * 2); // 0-1 posts
    } else if (activityLevel === 'low') {
      userPostCount = Math.floor(Math.random() * 3) + 1; // 1-3 posts
    } else if (activityLevel === 'medium') {
      userPostCount = Math.floor(Math.random() * 5) + 3; // 3-7 posts
    } else {
      // high
      userPostCount = Math.floor(Math.random() * 8) + 5; // 5-12 posts
    }

    // Create posts
    for (let i = 0; i < userPostCount; i++) {
      // Create a post date sometime in the last year
      const creationDate = new Date();
      creationDate.setDate(creationDate.getDate() - Math.floor(Math.random() * 365));
      const creationTimestamp = dateToTimestamp(creationDate);

      // Sometimes posts are updated
      const updateDate = new Date(creationDate);
      if (Math.random() > 0.8) {
        updateDate.setDate(updateDate.getDate() + Math.floor(Math.random() * 7)); // Update within a week
      }
      const updateTimestamp = dateToTimestamp(updateDate);

      const hasPictures = Math.random() > 0.5;
      const hasText = Math.random() > 0.2 || !hasPictures;

      // Determine post privacy based on user popularity
      let privacy: 'public' | 'friends' | 'private';
      if (popularityTier === 'high') {
        privacy = Math.random() > 0.7 ? 'public' : 'friends';
      } else if (popularityTier === 'medium') {
        privacy = Math.random() > 0.5 ? 'public' : Math.random() > 0.7 ? 'private' : 'friends';
      } else {
        privacy = Math.random() > 0.3 ? 'friends' : Math.random() > 0.5 ? 'private' : 'public';
      }

      // Generate pictures with placeholders if needed
      const pictures: IPictureWithPlaceholders[] = [];

      if (hasPictures) {
        // Ensure post images directory exists
        const postImagesOutputDir = path.join(baseDir, 'images', 'posts');
        if (!fs.existsSync(postImagesOutputDir))
          fs.mkdirSync(postImagesOutputDir, { recursive: true });

        // Generate 1-3 images
        const imageCount = Math.floor(Math.random() * 3) + 1;
        const generatedImages = await generateImages({
          type: 'post',
          count: imageCount,
        });

        // Save each image
        for (let imgIndex = 0; imgIndex < generatedImages.length; imgIndex++) {
          const imgData = generatedImages[imgIndex];
          const imgId = uuidv4();
          const imgFilename = `${imgId}.webp`;
          const imgPath = path.join(postImagesOutputDir, imgFilename);
          await fs.promises.writeFile(imgPath, imgData.webpBuffer);

          // Create storage URL for database
          const storageUrl = `http://localhost:9199/v0/b/demo-project.appspot.com/o/images%2Fposts%2F${imgFilename}?alt=media`;

          pictures.push({
            url: storageUrl,
            blurDataUrl: imgData.blurDataUrl,
            dominantHex: imgData.dominantHex,
          });
        }
      }

      const post: IGeneratedPost = {
        id: uuidv4(),
        ownerId: user.id,
        wallOwnerId: user.id,
        text: hasText ? faker.lorem.paragraphs(Math.floor(Math.random() * 3) + 1) : undefined,
        pictures: hasPictures ? pictures : undefined,
        createdAt: creationTimestamp,
        shareCount: 0, // Will be set after calculating virality
        elementType: 'post',
        comments: {},
        reactions: {},
        privacy,
      };

      // Calculate post virality
      const viralityScore = calculateViralityScore(post, user);

      // Generate share count based on virality
      if (privacy === 'public') {
        if (viralityScore > 0.8) {
          post.shareCount = Math.floor(Math.random() * 200) + 100; // Viral post
        } else if (viralityScore > 0.6) {
          post.shareCount = Math.floor(Math.random() * 50) + 20; // Popular post
        } else if (viralityScore > 0.4) {
          post.shareCount = Math.floor(Math.random() * 20) + 5; // Moderately shared
        } else {
          post.shareCount = Math.floor(Math.random() * 5); // Normal post
        }
      }

      // Generate reactions and comments based on virality
      post.reactions = generateReactionsForViralPost(post, users, viralityScore);
      post.comments = generateCommentsForViralPost(post, users, viralityScore, maxCommentsPerPost);

      posts.push(post);
    }
  }

  // 4. Create Firebase data structure
  console.log('Creating Firebase data structure...');
  const firebase: {
    users: Record<string, IGeneratedUser>;
    chats: Record<string, IGeneratedChat>;
    posts: Record<string, IGeneratedPost>;
    usersPublicData: {
      usersBasicInfo: Record<string, IUserBasicInfo>;
      usersPublicFriends: Record<string, IPublicFriendsMap>;
    };
  } = {
    users: {},
    chats: {},
    posts: {},
    usersPublicData: {
      usersBasicInfo: {},
      usersPublicFriends: {},
    },
  };

  // Populate Firebase collections
  for (const user of users) {
    firebase.users[user.id] = user;

    // Add user basic info to usersPublicData collection
    firebase.usersPublicData.usersBasicInfo[user.id] = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      pictureUrl: user.pictureUrl,
    };

    // Add public friends to usersPublicData collection
    firebase.usersPublicData.usersPublicFriends[user.id] = {};

    // Add accepted friends to public friends map
    for (const friendId in user.friends) {
      const friend = user.friends[friendId];
      if (friend.status === 'accepted' && friend.acceptedAt) {
        firebase.usersPublicData.usersPublicFriends[user.id][friendId] = friend.acceptedAt;
      }
    }
  }

  // Add chats and posts
  for (const chat of chats) {
    firebase.chats[chat.id] = chat;
  }
  for (const post of posts) {
    firebase.posts[post.id] = post;
  }

  return {
    users,
    chats,
    posts,
    algoliaSearchObjects,
    firebase,
  };
}
