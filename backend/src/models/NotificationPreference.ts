import mongoose, { Document, Schema } from 'mongoose';

export interface INotificationPreference extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  type: string;
  emailEnabled: boolean;
  emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  desktopEnabled: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationPreferenceSchema = new Schema<INotificationPreference>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  emailEnabled: {
    type: Boolean,
    default: true
  },
  emailFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'never'],
    default: 'daily'
  },
  desktopEnabled: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure a user doesn't have duplicate notification types
notificationPreferenceSchema.index({ userId: 1, type: 1 }, { unique: true });

export const NotificationPreference = mongoose.model<INotificationPreference>(
  'NotificationPreference',
  notificationPreferenceSchema
); 