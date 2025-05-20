import mongoose, { Document, Schema } from 'mongoose';

export interface INotificationPreference extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  type: string;
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'never';
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
  enabled: {
    type: Boolean,
    default: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'never'],
    default: 'daily'
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