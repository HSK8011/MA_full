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
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  createdAt: string;
  updatedAt: string;
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