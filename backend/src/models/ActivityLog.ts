import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'password_change',
      'profile_update',
      'security_setting_change',
      'two_factor_enabled',
      'two_factor_disabled',
      'login_failed',
      'account_locked',
      'account_unlocked',
      'api_key_created',
      'api_key_revoked',
      'settings_changed',
      'integration_connected',
      'integration_disconnected'
    ]
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  metadata: {
    type: Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false // We'll use the timestamp field instead
});

// Create a TTL index to automatically delete logs older than X days (e.g. 90 days)
activityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema); 