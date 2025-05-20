import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Post, IPost } from '../models/Post';
import { Integration } from '../models/Integration';
import { handleAsync } from '../utils/handleAsync';

// Define a type for the post history item to ensure compatibility with the schema
type PostHistoryItem = {
  version: number;
  content: string;
  mediaUrls: string[];
  updatedAt: Date;
  updatedBy: mongoose.Types.ObjectId;
};

// Type guard to ensure user exists and has an id
function ensureUserAuthenticated(req: Request, res: Response): string | false {
  if (!req.user || !req.userId) {
    res.status(401).json({ message: 'Unauthorized - User not authenticated' });
    return false;
  }
  // Use userId from the request which is set by the auth middleware
  return req.userId;
}

/**
 * Get all posts with pagination and filtering
 * @route GET /api/posts
 */
export const getPosts = handleAsync(async (req: Request, res: Response) => {
  const {
    status,
    platform,
    integrationId,
    page = 1,
    limit = 10,
    startDate,
    endDate,
    searchTerm
  } = req.query;

  // Ensure user exists and extract id
  const userId = ensureUserAuthenticated(req, res);
  if (!userId) return;
  const skip = (Number(page) - 1) * Number(limit);

  // Build query
  const query: any = { userId: new mongoose.Types.ObjectId(userId) };

  if (status) {
    query.status = status;
  }

  if (platform) {
    query.platform = platform;
  }

  if (integrationId) {
    query.integrationId = new mongoose.Types.ObjectId(integrationId as string);
  }

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string)
    };
  }

  if (searchTerm) {
    query.$or = [
      { content: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm as string, 'i')] } }
    ];
  }

  // Execute query with pagination
  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  // Get integration details for each post
  const postsWithIntegration = await Promise.all(
    posts.map(async (post) => {
      const integration = await Integration.findById(post.integrationId)
        .select('platform username displayName profileImageUrl')
        .lean();

      return {
        ...post,
        integration
      };
    })
  );

  return res.status(200).json({
    posts: postsWithIntegration,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit))
  });
});

/**
 * Get delivered (published) posts
 * @route GET /api/posts/delivered
 */
export const getDeliveredPosts = handleAsync(async (req: Request, res: Response) => {
  const {
    platform,
    integrationId,
    page = 1,
    limit = 10,
    startDate,
    endDate,
    searchTerm
  } = req.query;

  // Ensure user exists and extract id
  const userId = ensureUserAuthenticated(req, res);
  if (!userId) return;
  const skip = (Number(page) - 1) * Number(limit);

  // Build query for published posts
  const query: any = { 
    userId: new mongoose.Types.ObjectId(userId),
    status: 'published'
  };

  if (platform) {
    query.platform = platform;
  }

  if (integrationId) {
    query.integrationId = new mongoose.Types.ObjectId(integrationId as string);
  }

  if (startDate && endDate) {
    query.publishedAt = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string)
    };
  }

  if (searchTerm) {
    query.$or = [
      { content: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm as string, 'i')] } }
    ];
  }

  // Execute query with pagination
  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  // Get integration details for each post
  const postsWithIntegration = await Promise.all(
    posts.map(async (post) => {
      const integration = await Integration.findById(post.integrationId)
        .select('platform username displayName profileImageUrl')
        .lean();

      return {
        ...post,
        integration
      };
    })
  );

  return res.status(200).json({
    posts: postsWithIntegration,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit))
  });
});

/**
 * Get queued (scheduled) posts
 * @route GET /api/posts/queued
 */
export const getQueuedPosts = handleAsync(async (req: Request, res: Response) => {
  const {
    platform,
    integrationId,
    page = 1,
    limit = 10,
    startDate,
    endDate,
    searchTerm
  } = req.query;

  // Ensure user exists and extract id
  const userId = ensureUserAuthenticated(req, res);
  if (!userId) return;
  const skip = (Number(page) - 1) * Number(limit);

  // Build query for scheduled posts
  const query: any = { 
    userId: new mongoose.Types.ObjectId(userId),
    status: 'scheduled'
  };

  if (platform) {
    query.platform = platform;
  }

  if (integrationId) {
    query.integrationId = new mongoose.Types.ObjectId(integrationId as string);
  }

  if (startDate && endDate) {
    query.scheduledAt = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string)
    };
  }

  if (searchTerm) {
    query.$or = [
      { content: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm as string, 'i')] } }
    ];
  }

  // Execute query with pagination
  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .sort({ scheduledAt: 1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  // Get integration details for each post
  const postsWithIntegration = await Promise.all(
    posts.map(async (post) => {
      const integration = await Integration.findById(post.integrationId)
        .select('platform username displayName profileImageUrl')
        .lean();

      return {
        ...post,
        integration
      };
    })
  );

  return res.status(200).json({
    posts: postsWithIntegration,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit))
  });
});

/**
 * Get draft posts
 * @route GET /api/posts/drafts
 */
export const getDraftPosts = handleAsync(async (req: Request, res: Response) => {
  const {
    platform,
    integrationId,
    page = 1,
    limit = 10,
    searchTerm
  } = req.query;

  // Ensure user exists and extract id
  const userId = ensureUserAuthenticated(req, res);
  if (!userId) return;
  const skip = (Number(page) - 1) * Number(limit);

  // Build query for draft posts
  const query: any = { 
    userId: new mongoose.Types.ObjectId(userId),
    status: 'draft'
  };

  if (platform) {
    query.platform = platform;
  }

  if (integrationId) {
    query.integrationId = new mongoose.Types.ObjectId(integrationId as string);
  }

  if (searchTerm) {
    query.$or = [
      { content: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm as string, 'i')] } }
    ];
  }

  // Execute query with pagination
  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  // Get integration details for each post
  const postsWithIntegration = await Promise.all(
    posts.map(async (post) => {
      const integration = await Integration.findById(post.integrationId)
        .select('platform username displayName profileImageUrl')
        .lean();

      return {
        ...post,
        integration
      };
    })
  );

  return res.status(200).json({
    posts: postsWithIntegration,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit))
  });
});

/**
 * Get pending approval posts
 * @route GET /api/posts/pending-approval
 */
export const getPendingApprovalPosts = handleAsync(async (req: Request, res: Response) => {
  const {
    platform,
    integrationId,
    page = 1,
    limit = 10,
    searchTerm
  } = req.query;

  // Ensure user exists and extract id
  const userId = ensureUserAuthenticated(req, res);
  if (!userId) return;
  const skip = (Number(page) - 1) * Number(limit);

  // Build query for pending approval posts
  const query: any = { 
    userId: new mongoose.Types.ObjectId(userId),
    status: 'pending-approval'
  };

  if (platform) {
    query.platform = platform;
  }

  if (integrationId) {
    query.integrationId = new mongoose.Types.ObjectId(integrationId as string);
  }

  if (searchTerm) {
    query.$or = [
      { content: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm as string, 'i')] } }
    ];
  }

  // Execute query with pagination
  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  // Get integration details for each post
  const postsWithIntegration = await Promise.all(
    posts.map(async (post) => {
      const integration = await Integration.findById(post.integrationId)
        .select('platform username displayName profileImageUrl')
        .lean();

      return {
        ...post,
        integration
      };
    })
  );

  return res.status(200).json({
    posts: postsWithIntegration,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit))
  });
});

/**
 * Get a single post by ID
 * @route GET /api/posts/:id
 */
export const getPostById = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Ensure user exists and extract id
  const userId = ensureUserAuthenticated(req, res);
  if (!userId) return;

  const post = await Post.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId)
  }).lean();

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Get integration details
  const integration = await Integration.findById(post.integrationId)
    .select('platform username displayName profileImageUrl')
    .lean();

  const postWithIntegration = {
    ...post,
    integration
  };

  return res.status(200).json(postWithIntegration);
});

/**
 * Create a new post
 * @route POST /api/posts
 */
export const createPost = handleAsync(async (req: Request, res: Response) => {
  const postData = req.body;
  // Ensure user exists and extract id
  const userId = ensureUserAuthenticated(req, res);
  if (!userId) return;

  // Set user ID for the post
  postData.userId = new mongoose.Types.ObjectId(userId);
  
  // Initialize post history
  if (!postData.postHistory) {
    postData.postHistory = [{
      version: 1,
      content: postData.content,
      mediaUrls: postData.mediaUrls || [],
      updatedAt: new Date(),
      updatedBy: new mongoose.Types.ObjectId(userId)
    }];
  }

  // Create new post
  const newPost = new Post(postData);
  await newPost.save();

  return res.status(201).json(newPost);
});

/**
 * Update an existing post
 * @route PUT /api/posts/:id
 */
export const updatePost = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  // Ensure user exists and extract id
  const userId = ensureUserAuthenticated(req, res);
  if (!userId) return;

  // Find post by ID
  const post = await Post.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId)
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Update post fields
  Object.keys(updates).forEach(key => {
    if (key !== 'userId' && key !== '_id' && key !== 'postHistory') {
      (post as any)[key] = updates[key];
    }
  });

  // Add entry to post history if content changed
  if (updates.content && updates.content !== post.content) {
    // Initialize postHistory array if it doesn't exist
    if (!post.postHistory) {
      post.postHistory = [];
    }
    
    // Get the latest version number
    const latestVersion = post.postHistory.length > 0 
      ? Math.max(...post.postHistory.map(h => h.version)) 
      : 0;
    
    // Add new history entry
    post.postHistory.push({
      version: latestVersion + 1,
      content: updates.content,
      mediaUrls: updates.mediaUrls || post.mediaUrls || [],
      updatedAt: new Date(),
      updatedBy: new mongoose.Types.ObjectId(userId)
    });
  }

  await post.save();

  return res.status(200).json(post);
});

/**
 * Delete a post
 * @route DELETE /api/posts/:id
 */
export const deletePost = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Ensure user exists and extract id
  const userId = ensureUserAuthenticated(req, res);
  if (!userId) return;
  
  // Find and delete post
  const post = await Post.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId)
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  return res.status(200).json({ message: 'Post deleted successfully' });
});

/**
 * Schedule a post
 * @route POST /api/posts/:id/schedule
 */
export const schedulePost = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { scheduledAt } = req.body;
  // Ensure user exists and extract id
  const userId = ensureUserAuthenticated(req, res);
  if (!userId) return;

  // Find post by ID
  const post = await Post.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId)
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Update post status and scheduled time
  post.status = 'scheduled';
  post.scheduledAt = new Date(scheduledAt);

  await post.save();

  return res.status(200).json(post);
});

/**
 * Approve a post
 * @route POST /api/posts/:id/approve
 */
export const approvePost = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Ensure user exists and extract id
  const userId = ensureUserAuthenticated(req, res);
  if (!userId) return;

  // Find post by ID
  const post = await Post.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId)
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Update post approval status
  post.approvalStatus = 'approved';
  // Use type assertion to avoid ObjectId compatibility issues
  post.approvedBy = new mongoose.Types.ObjectId(userId) as any;
  post.approvedAt = new Date();

  // If post was pending approval, update status to scheduled if it has scheduledAt
  if (post.status === 'pending-approval') {
    post.status = post.scheduledAt ? 'scheduled' : 'draft';
  }

  await post.save();

  return res.status(200).json(post);
});

/**
 * Reject a post
 * @route POST /api/posts/:id/reject
 */
export const rejectPost = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Ensure user exists and extract id
  const userId = ensureUserAuthenticated(req, res);
  if (!userId) return;

  // Find post by ID
  const post = await Post.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId)
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Update post approval status
  post.approvalStatus = 'rejected';
  post.status = 'draft'; // Move back to draft status

  await post.save();

  return res.status(200).json(post);
});

/**
 * Duplicate a post (for resharing)
 * @route POST /api/posts/:id/duplicate
 */
export const duplicatePost = handleAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Ensure user exists and extract id
  const userId = ensureUserAuthenticated(req, res);
  if (!userId) return;

  // Find original post
  const originalPost = await Post.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId)
  });

  if (!originalPost) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Create new post as a duplicate
  const duplicatedPost = new Post({
    userId: new mongoose.Types.ObjectId(userId),
    integrationId: originalPost.integrationId,
    platform: originalPost.platform,
    content: originalPost.content,
    mediaUrls: originalPost.mediaUrls,
    type: originalPost.type,
    status: 'draft',
    tags: originalPost.tags,
    location: originalPost.location,
    postHistory: [{
      version: 1,
      content: originalPost.content,
      mediaUrls: originalPost.mediaUrls || [],
      updatedAt: new Date(),
      updatedBy: new mongoose.Types.ObjectId(userId)
    }]
  });

  await duplicatedPost.save();

  return res.status(201).json(duplicatedPost);
});
