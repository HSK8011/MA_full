# Publish Module Schema

## Overview
This document defines the data models, schemas, and type definitions used throughout the Publish module of the Marketing Automation Application. These schemas are used for both frontend component props and API request/response objects.

## Core Schemas

### Post
The `Post` schema represents a social media post that can be scheduled, drafted, or published.

```typescript
interface Post {
  // Core identifiers
  id: string;                     // Unique identifier
  userId: string;                 // Creator's user ID
  teamId?: string;                // Team ID if applicable
  
  // Content
  content: string;                // Main post text/content
  mediaUrls?: string[];           // URLs to attached media
  mediaType?: MediaType;          // Type of media attached
  link?: string;                  // URL if post contains a link
  linkMetadata?: LinkMetadata;    // Metadata for link preview
  
  // Scheduling
  scheduledTime?: Date;           // When post is scheduled to publish (optional for drafts)
  timezone: string;               // User's timezone (e.g., "America/New_York")
  publishingStrategy?: 'immediate' | 'scheduled' | 'optimal'; // Publishing approach
  
  // Status
  status: PostStatus;             // Current status of the post
  approvalStatus?: ApprovalStatus; // If workflow approvals are enabled
  
  // Targeting
  platforms: SocialPlatform[];    // Platform-specific settings
  accountIds: string[];           // IDs of accounts to post to
  
  // Metadata
  tags?: string[];                // For internal organization/filtering
  utmParameters?: UtmParameters;  // For link tracking
  
  // Platform-specific content variations
  variations?: Record<string, PostVariation>; // Platform-specific variations
  
  // Timestamps
  createdAt: Date;                // When post was created
  updatedAt: Date;                // When post was last updated
  publishedAt?: Date;             // When post was published (if applicable)
  failedAt?: Date;                // When post failed to publish (if applicable)
  
  // Draft-specific fields
  draftNotes?: string;            // Notes about the draft (only relevant when status is draft)
  draftLastModifiedAt?: Date;     // Last edit time for drafts
  
  // Analytics (populated after publishing)
  analytics?: PostAnalytics;      // Performance metrics
}

// Updated Post status types to include all possible states in a single enum
type PostStatus = 
  // Pre-publish states
  | 'draft'            // Saved but not scheduled or published
  | 'queued'           // Scheduled for future publishing
  | 'pending-approval' // Waiting for approval
  | 'rejected'         // Rejected during approval process
  
  // Post-publish states
  | 'published'        // Successfully published
  | 'delivered'        // Successfully delivered and confirmed by platforms
  | 'failed'           // Failed to publish
  
  // Additional states
  | 'archived'         // No longer active but saved for reference
  | 'deleted'          // Marked for deletion but not removed from database;

// Media types
type MediaType = 'image' | 'video' | 'gif' | 'carousel' | 'none';

// Approval status if workflow approvals are enabled
type ApprovalStatus = 'pending' | 'approved' | 'rejected';
```

### SocialPlatform
The `SocialPlatform` schema represents a platform-specific configuration for a post.

```typescript
interface SocialPlatform {
  // Core information
  platform: PlatformType;         // Platform identifier (e.g., 'twitter')
  accountId: string;              // ID of the account to post to
  accountName: string;            // Display name of the account
  platformIcon: string;           // Path to platform icon
  
  // Platform-specific status
  status?: 'queued' | 'published' | 'failed'; // Per-platform status
  
  // After publishing
  postUrl?: string;               // URL to the published post
  publishedAt?: Date;             // When post was published on this platform
  error?: string;                 // Error message if publishing failed
  
  // Platform-specific content (overrides post content)
  platformSpecificContent?: {
    content?: string;             // Platform-specific text variation
    mediaUrls?: string[];         // Platform-specific media
    link?: string;                // Platform-specific link
    linkTitle?: string;           // Platform-specific link title
    linkDescription?: string;     // Platform-specific link description
    linkImage?: string;           // Platform-specific link image
  };
}

// Supported social media platforms
type PlatformType = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'pinterest' | 'tiktok';
```

### PostVariation
The `PostVariation` schema represents platform-specific variations of a post.

```typescript
interface PostVariation {
  content: string;                // Platform-specific content
  mediaUrls?: string[];           // Platform-specific media
  formattedContent?: string;      // Content with formatting tags processed
  hashtags?: string[];            // Extracted hashtags
  mentions?: string[];            // Extracted mentions
}
```

### MediaUpload
The `MediaUpload` schema represents a media file attached to a post.

```typescript
interface MediaUpload {
  // Core identifiers
  id: string;                     // Unique identifier
  userId: string;                 // Uploader's user ID
  postId?: string;                // Post ID if associated with a post
  
  // File information
  type: MediaType;                // Type of media
  url: string;                    // Public URL to the file
  thumbnailUrl: string;           // URL to thumbnail version
  originalFilename: string;       // Original filename
  size: number;                   // File size in bytes
  mimeType: string;               // MIME type (e.g., "image/jpeg")
  
  // Dimensions (for images/videos)
  dimensions?: {
    width: number;
    height: number;
  };
  
  // Video-specific fields
  duration?: number;              // Video duration in seconds
  videoProvider?: string;         // For external videos (e.g., "youtube")
  
  // Platform-specific versions (e.g., cropped for Instagram)
  platformSpecificVersions?: {
    platform: PlatformType;
    url: string;
    dimensions: {
      width: number;
      height: number;
    };
  }[];
  
  // Metadata
  altText?: string;               // Accessibility description
  caption?: string;               // Media caption
  
  // Timestamps
  uploadedAt: Date;               // When media was uploaded
}
```

### LinkMetadata
The `LinkMetadata` schema represents metadata extracted from a link in a post.

```typescript
interface LinkMetadata {
  url: string;                    // Original URL
  title?: string;                 // Page title
  description?: string;           // Page description/excerpt
  imageUrl?: string;              // URL to feature image
  domain?: string;                // Domain name (e.g., "example.com")
  favicon?: string;               // URL to site favicon
}
```

### UtmParameters
The `UtmParameters` schema represents UTM tracking parameters for links.

```typescript
interface UtmParameters {
  source?: string;                // Traffic source (e.g., "twitter")
  medium?: string;                // Marketing medium (e.g., "social")
  campaign?: string;              // Campaign name
  term?: string;                  // Paid keywords
  content?: string;               // Version/variation identifier
}
```

### PostAnalytics
The `PostAnalytics` schema represents performance metrics for a published post.

```typescript
interface PostAnalytics {
  // Engagement metrics
  impressions?: number;           // Number of times post was displayed
  reach?: number;                 // Unique users who saw the post
  engagement?: number;            // Total engagement count
  engagementRate?: number;        // Engagement as percentage of impressions
  
  // Interaction breakdown
  likes?: number;                 // Like/favorite count
  comments?: number;              // Comment count
  shares?: number;                // Share/retweet count
  clicks?: number;                // Link click count
  saves?: number;                 // Save/bookmark count
  
  // Video-specific metrics
  videoViews?: number;            // Number of video views
  videoCompletionRate?: number;   // Percentage of complete video views
  
  // Audience demographics
  demographicData?: {
    ageGroups?: Record<string, number>;         // Age distribution
    genders?: Record<string, number>;           // Gender distribution
    locations?: Array<{name: string, count: number}>; // Geographic distribution
  };
  
  // Timestamps
  lastUpdated: Date;              // When analytics were last updated
}
```

### ScheduleSettings
The `ScheduleSettings` schema represents posting schedule configuration.

```typescript
interface ScheduleSettings {
  // Basic scheduling
  scheduledTime: Date;            // Date and time for posting
  timezone: string;               // User's timezone
  
  // Recurring schedule
  isRecurring: boolean;           // Whether this is a recurring post
  recurringSchedule?: {
    frequency: 'daily' | 'weekly' | 'monthly'; // How often to recur
    interval: number;              // Every X days/weeks/months
    endDate?: Date;                // When to stop recurring
    endAfterOccurrences?: number;  // Stop after X occurrences
    daysOfWeek?: number[];         // Days of week (for weekly recurrence)
    daysOfMonth?: number[];        // Days of month (for monthly recurrence)
  };
  
  // Queue settings
  useOptimalTiming: boolean;      // Use platform's optimal time suggestion
  queuePosition?: number;         // Position in posting queue
  
  // Advanced
  bufferTime?: number;            // Minutes between multiple posts
  quietHours?: {
    start: string;                 // Start of quiet hours (24h format)
    end: string;                   // End of quiet hours (24h format)
    daysOfWeek?: number[];         // Days when quiet hours apply
  };
}
```

## Request/Response Schemas

### List Posts Request
```typescript
interface ListPostsRequest {
  status?: PostStatus | PostStatus[];  // Filter by status
  startDate?: string;                  // ISO8601 date
  endDate?: string;                    // ISO8601 date
  platform?: PlatformType;             // Filter by platform
  accountId?: string;                  // Filter by account
  tag?: string;                        // Filter by tag
  search?: string;                     // Search in content
  page?: number;                       // Pagination page, starting at 1
  pageSize?: number;                   // Items per page
  sortBy?: 'scheduledTime' | 'createdAt' | 'engagement'; // Sort field
  sortOrder?: 'asc' | 'desc';          // Sort direction
}
```

### List Posts Response
```typescript
interface ListPostsResponse {
  posts: Post[];                   // Array of posts
  pagination: {
    total: number;                 // Total matching posts
    page: number;                  // Current page
    pageSize: number;              // Items per page
    totalPages: number;            // Total number of pages
  };
}
```

### Create Post Request
```typescript
interface CreatePostRequest {
  content: string;                 // Post content
  scheduledTime: string;           // ISO8601 datetime
  accountIds: string[];            // Social accounts to post to
  mediaUrls?: string[];            // Media URLs from previous uploads
  mediaType?: MediaType;           // Type of attached media
  link?: string;                   // Link URL if any
  tags?: string[];                 // Organization tags
  status: 'draft' | 'queued';      // Initial status
  platformSpecificContent?: Record<string, { // Platform-specific variations
    content?: string;
    mediaUrls?: string[];
  }>;
  utmParameters?: UtmParameters;   // Link tracking parameters
}
```

### Create Post Response
```typescript
interface CreatePostResponse {
  post: Post;                      // Created post
  success: boolean;                // Whether operation succeeded
  message?: string;                // Success/error message
}
```

### Upload Media Request
This is a multipart form request with:
- `file`: The media file (image/video)
- `postId`: Optional post ID to associate with
- `altText`: Optional accessibility description
- `caption`: Optional media caption

### Upload Media Response
```typescript
interface UploadMediaResponse {
  media: MediaUpload;              // Uploaded media details
  success: boolean;                // Whether upload succeeded
  message?: string;                // Success/error message
}
```

### Get Optimal Times Request
```typescript
interface OptimalTimesRequest {
  accountId: string;               // Social account ID
  date: string;                    // ISO8601 date
  count?: number;                  // Number of suggestions to return
}
```

### Get Optimal Times Response
```typescript
interface OptimalTimesResponse {
  optimalTimes: Array<{
    time: string;                  // ISO8601 datetime
    score: number;                 // 0-1 engagement likelihood
    reason: string;                // Explanation
  }>;
}
```

## Validation Rules

### Content Validation
- **Twitter**: Maximum 280 characters
- **LinkedIn**: Maximum 3,000 characters
- **Facebook**: Maximum 63,206 characters
- **Instagram**: Maximum 2,200 characters
- **Pinterest**: Maximum 500 characters

### Media Validation
- **Twitter**: 
  - Images: up to 4 images, max 5MB each, JPG/PNG/GIF
  - Videos: up to 140 seconds, max 512MB, MP4
- **Instagram**: 
  - Images: aspect ratio between 4:5 and 1.91:1, JPG/PNG
  - Videos: up to 60 seconds, MP4
- **Facebook**:
  - Images: JPG/PNG/GIF, recommended 1200x630px
  - Videos: Various formats, max 240 minutes
- **LinkedIn**:
  - Images: up to 9 images, JPG/PNG, max 5MB each
  - Videos: up to 10 minutes, various formats
- **Pinterest**:
  - Images: 2:3 aspect ratio recommended, JPG/PNG
  - Videos: up to 15 minutes, MP4

### Scheduling Validation
- Scheduled time must be in the future
- Recurring schedules must have valid frequency and interval
- Posts cannot be scheduled during account-specific quiet hours

## Example Usage

### Creating a Simple Post
```typescript
const newPost: CreatePostRequest = {
  content: "Excited to announce our new product launch! #ProductLaunch",
  scheduledTime: "2023-06-15T14:30:00Z",
  accountIds: ["acc_123456", "acc_789012"],
  status: "queued"
};
```

### Creating a Post with Media and Platform-Specific Content
```typescript
const newPostWithMedia: CreatePostRequest = {
  content: "Check out our new office space! #NewBeginnings",
  scheduledTime: "2023-06-20T09:00:00Z",
  accountIds: ["acc_123456", "acc_789012"],
  mediaUrls: ["https://example.com/uploads/image1.jpg"],
  mediaType: "image",
  status: "queued",
  platformSpecificContent: {
    twitter: {
      content: "Our new HQ is amazing! #NewBeginnings (shorter for Twitter)"
    },
    instagram: {
      content: "Our team is loving the new office space! 🏢✨\n\n#NewBeginnings #OfficeGoals #WorkLife",
      mediaUrls: ["https://example.com/uploads/image1-instagram-crop.jpg"]
    }
  }
};
``` 