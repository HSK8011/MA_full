import mongoose, { Document, Schema } from 'mongoose';

// Define the post history item interface
interface PostHistoryItem {
  version: number;
  content: string;
  mediaUrls: string[];
  updatedAt: Date;
  updatedBy: mongoose.Types.ObjectId;
}

export interface IPost extends Document {
  integrationId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  platform: string;
  postId: string;  // Platform-specific post ID
  content: string;
  mediaUrls: string[];
  type: 'text' | 'image' | 'video' | 'link' | 'carousel';
  status: 'published' | 'scheduled' | 'draft' | 'failed' | 'pending-approval';
  publishedAt: Date;
  scheduledAt?: Date;
  // Approval workflow fields
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  // Post history for tracking changes
  postHistory: PostHistoryItem[];
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
    reach: number;
    engagement: number;
    lastUpdated: Date;
  };
  platformSpecific: {
    // Platform-specific data (e.g., tweet thread ID, Instagram carousel, etc.)
    [key: string]: any;
  };
  link?: string;
  tags: string[];
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  integrationId: {
    type: Schema.Types.ObjectId,
    ref: 'Integration',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['twitter', 'facebook', 'linkedin', 'instagram', 'pinterest']
  },
  postId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  mediaUrls: [{
    type: String
  }],
  type: {
    type: String,
    required: true,
    enum: ['text', 'image', 'video', 'link', 'carousel'],
    default: 'text'
  },
  status: {
    type: String,
    required: true,
    enum: ['published', 'scheduled', 'draft', 'failed', 'pending-approval'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  scheduledAt: {
    type: Date
  },
  // Approval workflow fields
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  // Post history for tracking changes
  postHistory: [{
    version: { type: Number, required: true },
    content: { type: String, required: true },
    mediaUrls: [{ type: String }],
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  }],
  metrics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  platformSpecific: {
    type: Schema.Types.Mixed,
    default: {}
  },
  link: {
    type: String
  },
  tags: [{
    type: String
  }],
  location: {
    name: { type: String },
    latitude: { type: Number },
    longitude: { type: Number }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
postSchema.index({ userId: 1, platform: 1 });
postSchema.index({ integrationId: 1, postId: 1 }, { unique: true });
postSchema.index({ userId: 1, status: 1 });
postSchema.index({ scheduledAt: 1 }, { sparse: true });
postSchema.index({ publishedAt: -1 });

export const Post = mongoose.model<IPost>('Post', postSchema); 