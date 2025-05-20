import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeSlot {
  time: string; // 24-hour format "HH:MM"
}

export interface IWeekdaySetting {
  day: string;
  enabled: boolean;
  timeSlots: ITimeSlot[];
}

export interface IDefaultContent {
  hashtags?: string[];
  mentions?: string[];
  templates?: {
    [platform: string]: string;
  };
}

export interface IQueueSetting extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  accountId: string;
  weekdaySettings: IWeekdaySetting[];
  defaultContent?: IDefaultContent;
}

const timeSlotSchema = new Schema<ITimeSlot>({
  time: {
    type: String,
    required: true,
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in 24-hour format (HH:MM)']
  }
}, { _id: true });

const weekdaySettingSchema = new Schema<IWeekdaySetting>({
  day: {
    type: String,
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },
  enabled: {
    type: Boolean,
    default: true
  },
  timeSlots: [timeSlotSchema]
});

const queueSettingSchema = new Schema<IQueueSetting>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountId: {
    type: String,
    required: true
  },
  weekdaySettings: [weekdaySettingSchema],
  defaultContent: {
    hashtags: [{ type: String }],
    mentions: [{ type: String }],
    templates: {
      type: Map,
      of: String,
      default: {}
    }
  }
}, {
  timestamps: true
});

// Compound index to ensure a user doesn't have duplicate settings for the same account
queueSettingSchema.index({ userId: 1, accountId: 1 }, { unique: true });

export const QueueSetting = mongoose.model<IQueueSetting>('QueueSetting', queueSettingSchema); 