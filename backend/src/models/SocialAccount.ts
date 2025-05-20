import mongoose, { Document, Schema } from 'mongoose';

export interface ISocialAccount extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  platform: string;
  accountId: string;
  username: string;
  displayName: string;
  profileImageUrl: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt?: Date;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const socialAccountSchema = new Schema<ISocialAccount>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['facebook', 'twitter', 'instagram', 'linkedin', 'pinterest'],
    index: true
  },
  accountId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  profileImageUrl: {
    type: String,
    default: ''
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    default: ''
  },
  tokenExpiresAt: {
    type: Date
  },
  lastSyncedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index for userId + platform for faster queries
socialAccountSchema.index({ userId: 1, platform: 1 });

// Ensure accountId is unique per platform
socialAccountSchema.index({ platform: 1, accountId: 1 }, { unique: true });

export const SocialAccount = mongoose.model<ISocialAccount>('SocialAccount', socialAccountSchema);
