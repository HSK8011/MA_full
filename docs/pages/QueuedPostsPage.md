# QueuedPostsPage Documentation

## Overview
The QueuedPostsPage serves as the primary interface for viewing and managing scheduled social media posts. It displays a calendar-based view of all queued posts across connected social media accounts, allowing users to easily visualize their content schedule and make adjustments as needed. The page supports different viewing modes (day, week, month) to provide flexibility in content management.

## File Location
- **Component Path**: `src/pages/Publish.tsx`
- **Related Components**:
  - QueuedPosts (`src/components/organisms/Publish/QueuedPosts.tsx`)
  - PublishContent (`src/components/organisms/Publish/PublishContent.tsx`)

## Page Structure
```
QueuedPostsPage
├── Header (Navigation + User Menu)
└── Main Content
    └── PublishContent
        └── QueuedPosts
            ├── Page Title + Schedule Post Button
            ├── View Modes (Day/Week/Month)
            ├── Search Filters
            ├── Date Navigation
            └── Calendar Views
                ├── Day View (Hourly Timeline)
                ├── Week View (7-Day Grid)
                └── Month View (Monthly Calendar)
```

## Component Details

### QueuedPosts Component
- **Purpose**: Displays scheduled posts in a calendar format
- **Key Features**:
  - Multiple view modes (day, week, month)
  - Interactive calendar with post details
  - Quick navigation to post creation/editing
  - Visual differentiation of posts by platform
- **Key Sections**:
  1. **Header Section**
     - Title: "Queued Posts"
     - Schedule Post button (links to `/publish/queue-times`)
  
  2. **View Controls**
     - Day/Week/Month toggle
     - Date range display
     - Previous/Next navigation buttons
     - Search filters (by social profile, by tags)
  
  3. **Calendar Views**
     - **Day View**: Hour-by-hour timeline with post details
     - **Week View**: 7-day grid with daily posts
     - **Month View**: Monthly calendar with posts per day
       - Post cards are scrollable when many posts exist for a day
       - "View all X posts" button appears when there are many posts
       - Each post card shows platform icon, time, and content preview

### Post Card Interaction
- Posts are clickable to view/edit details
- Clicking a post navigates to ManageQueueTimes page with that post pre-selected
- Each post card displays:
  - Platform icon (Facebook, Twitter, Instagram, etc.)
  - Scheduled time
  - Content preview (truncated if needed)
  - Media preview (if applicable)

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
}

interface PostAnalytics {
  reach?: number;
  impressions?: number;
  engagement?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  clicks?: number;
}

interface UtmParameters {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}
```

## API Integration & Data Flow

### Publish API Endpoints

#### List Queued Posts
- **Method**: GET
- **Path**: `/api/publish/posts`
- **Query Parameters**:
  - `status`: Filter by post status (default: 'queued')
  - `startDate`: Start date for fetching posts
  - `endDate`: End date for fetching posts
  - `platform`: Filter by specific platform
  - `accountId`: Filter by specific account
  - `tag`: Filter by tag
- **Response**:
  ```json
  {
    "posts": [
      {
        "id": "string",
        "content": "string",
        "scheduledTime": "ISO8601 string",
        "status": "string",
        "platforms": [
          {
            "platform": "string",
            "accountId": "string",
            "accountName": "string",
            "platformIcon": "string"
          }
        ],
        "mediaUrls": ["string"],
        "mediaType": "string"
      }
    ],
    "pagination": {
      "total": 0,
      "page": 1,
      "pageSize": 50,
      "hasMore": false
    }
  }
  ```

#### Get Post Details
- **Method**: GET
- **Path**: `/api/publish/posts/:postId`
- **Response**:
  ```json
  {
    "id": "string",
    "content": "string",
    "scheduledTime": "ISO8601 string",
    "createdAt": "ISO8601 string",
    "updatedAt": "ISO8601 string",
    "status": "string",
    "platforms": [...],
    "accountIds": ["string"],
    "mediaUrls": ["string"],
    "mediaType": "string",
    "tags": ["string"],
    "userId": "string",
    "teamId": "string"
  }
  ```

## User Interactions & Workflows

### Viewing Scheduled Posts
1. **Selecting View Mode**
   - User chooses between day, week, or month view
   - Calendar updates to show appropriate time scale
   - Posts are displayed in their scheduled time slots

2. **Navigating Between Dates**
   - User can navigate forward/backward using arrow buttons
   - Date range header updates to show current view period
   - Posts load for the new date range automatically

3. **Filtering Posts**
   - User can filter by social profile or tags
   - Calendar updates to show only matching posts
   - Empty state displayed when no posts match filters

4. **Viewing Post Details**
   - User clicks on a post card
   - System navigates to ManageQueueTimes page with that post pre-selected
   - Full post details and editing interface appear

### Creating New Posts
1. **Initiating Post Creation**
   - User clicks "Schedule Post" button in header, or
   - User clicks "Create a Post" button on a specific day
   - System navigates to ManageQueueTimes page with date pre-selected
   - Post creation interface appears

## Performance Considerations
- Calendar views should efficiently render large numbers of posts
- Month view implements virtual scrolling for days with many posts
- API requests should be paginated and cached where appropriate
- Date navigation should minimize unnecessary data fetching by using date ranges
- Media previews should use optimized thumbnails rather than full-size images

## Accessibility Features
- All calendar views are keyboard navigable
- Posts have appropriate ARIA attributes for screen readers
- Color is not the only indicator of platform type (icons are also used)
- Interactive elements have sufficient contrast and focus states
- Screen readers announce date changes and filtering actions

## Routes
- **Path**: `/publish/queued`
- **Access**: Protected (authentication required)
- **Query Parameters**:
  - `view`: initial view mode ('day', 'week', 'month')
  - `date`: initial date to display (ISO8601)
  
## Related Pages
- **ManageQueueTimes Page**: For creating and editing posts
- **Pending Approval Page**: For reviewing posts requiring approval
- **Drafts Page**: For managing post drafts
- **Delivered Page**: For viewing published posts 