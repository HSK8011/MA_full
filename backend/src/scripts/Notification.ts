import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  read: boolean;
  emailSent: boolean;
  desktopShown: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  desktopShown: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Compound index for faster queries on userId + read status
notificationSchema.index({ userId: 1, read: 1 });

// Compound index for faster queries on userId + type
notificationSchema.index({ userId: 1, type: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
