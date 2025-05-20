# API Types and Interfaces

This document outlines the TypeScript interfaces and types used throughout the Marketing Automation API.

## Post Types

### Post Interface
```typescript
interface Post {
  _id: string;
  integrationId: string;
  userId: string;
  platform: SocialMediaPlatform;
  postId: string;
  content: string;
  mediaUrls: string[];
  type: PostType;
  status: PostStatus;
  publishedAt?: Date;
  scheduledAt?: Date;
  metrics: PostMetrics;
  platformSpecific: Record<string, any>;
  link?: string;
  tags: string[];
  location?: PostLocation;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  postHistory: PostHistoryItem[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Post Related Types
```typescript
type SocialMediaPlatform = 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'pinterest';

type PostType = 'text' | 'image' | 'video' | 'carousel' | 'link';

type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed' | 'pending-approval';

type ApprovalStatus = 'approved' | 'rejected' | 'pending';

interface PostMetrics {
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  reach: number;
  engagement: number;
  lastUpdated: Date;
}

interface PostLocation {
  name: string;
  latitude: number;
  longitude: number;
}

interface PostHistoryItem {
  version: number;
  content: string;
  mediaUrls: string[];
  updatedAt: Date;
  updatedBy: string;
}
```

## Integration Types

### Integration Interface
```typescript
interface Integration {
  _id: string;
  userId: string;
  platform: SocialMediaPlatform;
  serviceType: 'socialMedia';
  serviceName: string;
  username: string;
  displayName: string;
  profileImageUrl: string;
  status: IntegrationStatus;
  credentials: Record<string, any>;
  apiKey?: string;
  dailyLimit: number;
  postsToday: number;
  resetAt: Date;
  defaultApprovalRequired: boolean;
  lastConnected: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Integration Related Types
```typescript
type IntegrationStatus = 'active' | 'inactive' | 'error' | 'pending';
```

## Queue Settings Types

### QueueSetting Interface
```typescript
interface QueueSetting {
  _id: string;
  userId: string;
  integrationId: string;
  weekdaySettings: WeekdaySettings;
  defaultContent: DefaultContent;
  createdAt: Date;
  updatedAt: Date;
}

interface WeekdaySettings {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

interface TimeSlot {
  hour: number;
  minute: number;
  enabled: boolean;
}

interface DefaultContent {
  hashtags: string[];
  mentions: string[];
  templates: ContentTemplate[];
}

interface ContentTemplate {
  name: string;
  content: string;
  type: PostType;
  platform: SocialMediaPlatform;
}
```

## API Response Types

### Pagination Response
```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
```

### Error Response
```typescript
interface ErrorResponse {
  message: string;
  code: string;
  details?: Record<string, any>;
}
```

## Query Parameter Types

### Post Query Parameters
```typescript
interface PostQueryParams {
  page?: number;
  limit?: number;
  platform?: SocialMediaPlatform;
  integrationId?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  status?: PostStatus;
}
```

These types and interfaces are used consistently throughout the application to ensure type safety and provide proper documentation for API consumers.
