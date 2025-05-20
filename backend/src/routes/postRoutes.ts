import express from 'express';
import * as postController from '../controllers/postController';
import auth from '../middleware/authMiddleware';

const router = express.Router();

// Apply auth middleware to all post routes
router.use(auth);

// Get all posts with pagination and filtering
router.get('/', postController.getPosts);

// Get posts by status
router.get('/delivered', postController.getDeliveredPosts);
router.get('/queued', postController.getQueuedPosts);
router.get('/drafts', postController.getDraftPosts);
router.get('/pending-approval', postController.getPendingApprovalPosts);

// Get a single post by ID
router.get('/:id', postController.getPostById);

// Create a new post
router.post('/', postController.createPost);

// Update an existing post
router.put('/:id', postController.updatePost);

// Delete a post
router.delete('/:id', postController.deletePost);

// Post actions
router.post('/:id/schedule', postController.schedulePost);
router.post('/:id/approve', postController.approvePost);
router.post('/:id/reject', postController.rejectPost);
router.post('/:id/duplicate', postController.duplicatePost);

export default router;
