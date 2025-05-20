import mongoose, { Document, Schema } from 'mongoose';

export interface IIntegration extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  serviceId: string;
  serviceName: string;
  serviceType: 'urlShortener' | 'socialMedia' | 'analytics' | 'email' | 'other';
  apiKey?: string;
  isConnected: boolean;
  status: 'active' | 'inactive' | 'error';
  settings: Record<string, any>;
  credentials: Record<string, any>;
  // Social Media specific fields
  platform?: string;
  username?: string;
  displayName?: string;
  profileImageUrl?: string;
  metadata: {
    icon?: string;
    description?: string;
    website?: string;
    apiDocumentation?: string;
    pageId?: string;           // For Facebook pages
    pageAccessToken?: string;  // For Facebook pages
    accountType?: 'personal' | 'business' | 'creator';
    scopes?: string[];
    [key: string]: any;
  };
  lastConnectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const integrationSchema = new Schema<IIntegration>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceId: {
    type: String,
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['urlShortener', 'socialMedia', 'analytics', 'email', 'other']
  },
  apiKey: {
    type: String,
    select: false // Protect sensitive API keys from default queries
  },
  isConnected: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'error'],
    default: 'inactive'
  },
  settings: {
    type: Schema.Types.Mixed,
    default: {}
  },
  credentials: {
    type: Schema.Types.Mixed,
    default: {},
    select: false // Protect sensitive credentials
  },
  // Social Media specific fields
  platform: {
    type: String,
    enum: ['twitter', 'facebook', 'linkedin', 'instagram', 'pinterest'],
    sparse: true
  },
  username: {
    type: String,
    sparse: true
  },
  displayName: {
    type: String,
    sparse: true
  },
  profileImageUrl: {
    type: String,
    sparse: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {
      icon: '',
      description: '',
      website: '',
      apiDocumentation: '',
      accountType: 'personal',
      scopes: []
    }
  },
  lastConnectedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to ensure a user doesn't have duplicate service integrations
integrationSchema.index({ userId: 1, serviceId: 1 }, { unique: true });
// Index for social media accounts
integrationSchema.index({ userId: 1, platform: 1, username: 1 }, { sparse: true });

export const Integration = mongoose.model<IIntegration>('Integration', integrationSchema); 