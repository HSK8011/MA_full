import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  integrationId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  platform: string;
  timeRange: string;
  date: Date;
  metrics: {
    posts: number;
    likes: number;
    followers: number;
    engagements: number;
    audienceGrowth: number;
    audienceGrowthPercentage: number;
    impressions: number;
    reach: number;
    shares: number;
    comments: number;
    clicks: number;
    profileViews: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>({
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
  timeRange: {
    type: String,
    required: true,
    enum: ['7d', '30d', '90d', '1y'],
    default: '30d'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  metrics: {
    posts: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    engagements: { type: Number, default: 0 },
    audienceGrowth: { type: Number, default: 0 },
    audienceGrowthPercentage: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
analyticsSchema.index({ userId: 1, platform: 1 });
analyticsSchema.index({ integrationId: 1, timeRange: 1 });
analyticsSchema.index({ date: -1 });

export const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema);
