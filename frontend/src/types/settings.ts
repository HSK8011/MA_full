export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  timezone: string;
  isTwoFactorEnabled: boolean;
  isActivityLoggingEnabled: boolean;
  lastPasswordChange?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreference {
  _id: string;
  userId: string;
  type: string;
  emailEnabled: boolean;
  emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  desktopEnabled: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Used for partial updates to notification preferences
export interface NotificationPreferenceUpdate {
  _id: string;
  emailEnabled?: boolean;
  emailFrequency?: 'daily' | 'weekly' | 'monthly' | 'never';
  desktopEnabled?: boolean;
}

export interface Integration {
  _id: string;
  userId: string;
  type: string;
  status: 'active' | 'inactive';
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileData {
  name: string;
  phone?: string;
  timezone: string;
}

export interface SecurityData {
  isTwoFactorEnabled: boolean;
  isActivityLoggingEnabled: boolean;
  lastPasswordChange?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface QueueTime {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // Format: HH:mm
  endTime: string; // Format: HH:mm
}

export interface Settings {
  user: User;
  notificationPreferences: NotificationPreference[];
  integrations: Integration[];
  queueTimes: QueueTime[];
} 