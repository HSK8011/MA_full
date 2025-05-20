# ManageQueueTimesPage Documentation

## Overview
The ManageQueueTimesPage serves as the central interface for creating, editing, and scheduling social media posts. It provides a comprehensive post editor with support for multimedia content, platform-specific customizations, and scheduling options. This page is used both for creating new posts and editing existing scheduled posts, with intelligent defaults based on user-selected dates or pre-existing content.

## File Location
- **Component Path**: `src/pages/Publish.tsx` (with active view='queue-times')
- **Related Components**:
  - ManageQueueTimes (`src/components/organisms/Publish/ManageQueueTimes.tsx`)
  - PublishContent (`src/components/organisms/Publish/PublishContent.tsx`)
  - PostEditor (`src/components/molecules/PostEditor/PostEditor.tsx`)
  - MediaUploader (`src/components/molecules/MediaUploader/MediaUploader.tsx`)
  - PlatformSelector (`src/components/molecules/PlatformSelector/PlatformSelector.tsx`)
  - ScheduleSelector (`src/components/molecules/ScheduleSelector/ScheduleSelector.tsx`)

## Page Structure
```
ManageQueueTimesPage
├── Header (Navigation + User Menu)
└── Main Content
    └── PublishContent
        └── ManageQueueTimes
            ├── Page Title + Save/Cancel Buttons
            ├── Post Content Section
            │   ├── Content Editor
            │   ├── Media Uploader
            │   └── Character Count / Limitations
            ├── Publishing Options
            │   ├── Platform Selection
            │   └── Platform-specific Customizations
            ├── Scheduling Options
            │   ├── Date/Time Selection
            │   ├── Time Slots Suggestions
            │   └── Recurring Options
            └── Preview Section
                └── Platform-specific Post Previews
```

## Component Details

### ManageQueueTimes Component
- **Purpose**: Create, edit, and schedule social media posts
- **Key Features**:
  - Rich text editor for post content
  - Media upload and preview
  - Multi-platform publishing
  - Flexible scheduling options
  - Platform-specific previews
- **Key Sections**:
  1. **Header Section**
     - Title: "Schedule Post" or "Edit Post"
     - Save button (publishes or schedules the post)
     - Cancel button (returns to QueuedPosts view)
  
  2. **Post Content Section**
     - Rich text editor with formatting options
     - Support for emoji insertion
     - Hashtag and mention suggestions
     - Media upload area (images, videos, links)
     - Character counter with platform-specific limits
  
  3. **Platform Selection**
     - List of connected social media accounts
     - Ability to select multiple platforms for cross-posting
     - Platform-specific options (e.g., image cropping ratios)
     - Warning indicators for content that may not work well on specific platforms
  
  4. **Scheduling Options**
     - Date picker for selecting posting date
     - Time picker for selecting posting time
     - Optimal time suggestions based on audience analytics
     - Option to save as draft instead of scheduling
     - Queue time slot management for bulk scheduling
  
  5. **Preview Section**
     - Real-time preview of how the post will appear on each selected platform
     - Device-specific previews (mobile vs desktop)
     - Warning indicators for potential issues

### Post Creation and Editing
- **New Post Creation**:
  - Empty content editor with platform-specific placeholders
  - Default to current date/time or user-selected time from calendar
  - Default platform selections based on user preferences
  
- **Post Editing**:
  - Pre-populated content from existing post
  - Current scheduling settings loaded automatically
  - All media and customizations preserved
  - Visual indication that this is an edit rather than a new post

## Data Schema Requirements

### Post Schema
```typescript
interface Post {
  id: string;
  content: string;
  scheduledTime: Date;
  createdAt: Date;
  updatedAt: Date;
  status: 'queued' | 'pending-approval' | 'draft' | 'delivered' | 'failed';
  platforms: SocialPlatform[];
  accountIds: string[]; // IDs of accounts to post to
  mediaUrls?: string[]; // Image/video URLs
  mediaType?: 'image' | 'video' | 'carousel' | 'none';
  tags?: string[]; // For internal organization
  userId: string; // Creator
  teamId?: string; // Team if applicable
  analytics?: PostAnalytics; // If already published
  utmParameters?: UtmParameters; // For link tracking
}

interface SocialPlatform {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'pinterest';
  accountId: string;
  accountName: string;
  platformIcon: string;
  status?: 'queued' | 'published' | 'failed';
  postUrl?: string; // If published
  error?: string; // If failed
  platformSpecificContent?: {
    content?: string; // Platform-specific content variation
    mediaUrls?: string[]; // Platform-specific media
    link?: string; // Platform-specific link
    linkTitle?: string;
    linkDescription?: string;
    linkImage?: string;
  };
}

interface ScheduleSettings {
  scheduledTime: Date;
  timezone: string;
  isRecurring: boolean;
  recurringSchedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number; // Every X days/weeks/months
    endDate?: Date;
    endAfterOccurrences?: number;
  };
  useOptimalTiming: boolean;
  queuePosition?: number; // For sequential posting
}
```

### Media Upload Schema
```typescript
interface MediaUpload {
  id: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnailUrl: string;
  originalFilename: string;
  size: number; // In bytes
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // For videos, in seconds
  uploadedAt: Date;
  userId: string;
  postId?: string; // If associated with a post
  platformSpecificVersions?: {
    platform: string;
    url: string;
    dimensions: {
      width: number;
      height: number;
    };
  }[];
}
```

## API Integration & Data Flow

### Publish API Endpoints

#### Create Post
- **Method**: POST
- **Path**: `/api/publish/posts`
- **Request Body**:
  ```json
  {
    "content": "string",
    "scheduledTime": "ISO8601 string",
    "accountIds": ["string"],
    "mediaUrls": ["string"],
    "mediaType": "string",
    "tags": ["string"],
    "status": "string", // 'queued' or 'draft'
    "platformSpecificContent": {
      "platformId": {
        "content": "string",
        "mediaUrls": ["string"]
      }
    }
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "content": "string",
    "scheduledTime": "ISO8601 string",
    "status": "string",
    "platforms": [...],
    "createdAt": "ISO8601 string"
  }
  ```

#### Update Post
- **Method**: PUT
- **Path**: `/api/publish/posts/:postId`
- **Request Body**: Same as Create Post
- **Response**: Same as Create Post

#### Upload Media
- **Method**: POST
- **Path**: `/api/publish/media`
- **Request Body**: Form data with 'file' field
- **Response**:
  ```json
  {
    "id": "string",
    "url": "string",
    "thumbnailUrl": "string",
    "type": "string",
    "size": 0,
    "dimensions": {
      "width": 0,
      "height": 0
    }
  }
  ```

#### Get Optimal Posting Times
- **Method**: GET
- **Path**: `/api/publish/optimal-times`
- **Query Parameters**:
  - `accountId`: Social account ID
  - `date`: Target date for suggestions
- **Response**:
  ```json
  {
    "optimalTimes": [
      {
        "time": "ISO8601 string",
        "score": 0.95, // 0-1 engagement likelihood
        "reason": "string" // E.g., "Based on your audience activity patterns"
      }
    ]
  }
  ```

## User Interactions & Workflows

### Creating a New Post
1. **Initiating Post Creation**
   - User navigates from QueuedPosts page via "Schedule Post" button
   - System displays empty post creation interface
   - If a specific date was selected, it is pre-filled in the scheduler

2. **Composing Content**
   - User enters post text in the editor
   - Content is validated against platform-specific requirements
   - Character counter updates in real-time
   - User can add formatting, emojis, hashtags, and mentions

3. **Adding Media**
   - User uploads images or videos via drag-and-drop or file picker
   - Media previews appear below the text editor
   - System generates appropriate crops for different platforms
   - User can rearrange or remove media items

4. **Setting Publishing Options**
   - User selects target social media platforms
   - Platform-specific options appear based on selection
   - System validates content against each platform's requirements
   - Preview updates to show platform-specific appearance

5. **Scheduling the Post**
   - User selects date and time for publishing
   - System offers optimal time suggestions
   - User can opt for immediate publishing or draft status
   - Calendar shows existing scheduled posts for context

6. **Saving the Post**
   - User clicks "Schedule Post" or "Save as Draft"
   - System validates all inputs and shows errors if present
   - On success, system redirects to QueuedPosts page
   - New post appears in the calendar at the scheduled time

### Editing an Existing Post
1. **Initiating Post Edit**
   - User clicks a post in the QueuedPosts calendar
   - System loads the ManageQueueTimes page with post data
   - All fields are pre-populated with existing content

2. **Modifying Content**
   - User makes desired changes to text, media, or scheduling
   - Platform-specific previews update in real-time
   - System validates changes against platform requirements

3. **Saving Changes**
   - User clicks "Update Post"
   - System saves changes and updates the scheduled post
   - User is redirected back to QueuedPosts page
   - Updated post appears in the calendar

## Performance Considerations
- Media uploads should be optimized and compressed
- Large media files should use chunked uploading
- Real-time previews should be efficient and avoid unnecessary re-renders
- Platform-specific validation should run asynchronously
- Autosave functionality should prevent data loss

## Accessibility Features
- Rich text editor is fully accessible with keyboard controls
- Media uploads have keyboard and screen reader support
- Error messages are associated with their respective fields
- Date and time pickers are accessible and support keyboard input
- Platform selection uses proper ARIA attributes

## Routes
- **Path**: `/publish/queue-times`
- **Access**: Protected (authentication required)
- **Query Parameters**:
  - `postId`: ID of post to edit (if editing existing post)
  - `date`: Pre-selected date (ISO8601) for new posts
  - `time`: Pre-selected time for new posts
  - `accountId`: Pre-selected account for cross-posting

## Related Pages
- **QueuedPosts Page**: Calendar view of scheduled posts
- **Pending Approval Page**: For posts awaiting approval
- **Drafts Page**: For saved but not scheduled posts
- **Delivered Page**: For viewing published posts

## User Permissions
- **Create Post**: Requires 'publish:create' permission
- **Edit Own Post**: Requires 'publish:edit_own' permission
- **Edit Any Post**: Requires 'publish:edit_any' permission
- **Schedule Post**: Requires 'publish:schedule' permission 