# Frontend Components Documentation

This document outlines the key frontend components used in the Analytics/Analyze section of the application.

## Analytics Components

### AnalyzeContent

The main component for displaying analytics content, including account metrics and posts with their respective statuses.

**File Path:** `/src/components/organisms/Analyze/AnalyzeContent.tsx`

**Key Features:**
- Displays analytics data for selected social media accounts
- Filters posts by status (published, scheduled, draft)
- Shows metrics for each post based on its status
- Handles time range selection for analytics data

**State Management:**
```typescript
// Main state variables
const [activeTab, setActiveTab] = useState<'overview' | 'posts'>('overview');
const [timeRange, setTimeRange] = useState<string>('30d');
const [analyticsData, setAnalyticsData] = useState<AccountAnalytics | null>(null);
const [allPosts, setAllPosts] = useState<TopPost[]>([]);
const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all');
```

**Post Filtering Logic:**
```typescript
// Filtered posts based on status
const filteredPosts = allPosts.filter(post => {
  // Handle posts without status
  if (!post.status) {
    return statusFilter === 'all' || statusFilter === 'published';
  }
  
  // Handle normal filtering
  if (statusFilter === 'all') return true;
  return post.status === statusFilter;
});
```

**API Integration:**
- Uses `analyticsService.getAccountAnalytics()` to fetch data for a specific account
- Uses `analyticsService.getAnalyticsOverview()` to fetch aggregated data across all accounts

### PostStatusBadge

A component that displays the status of a post with appropriate styling.

**File Path:** `/src/components/molecules/PostStatusBadge.tsx`

**Props:**
```typescript
interface PostStatusBadgeProps {
  status: 'published' | 'scheduled' | 'draft' | 'failed';
}
```

**Usage:**
```tsx
<PostStatusBadge status={post.status} />
```

**Styling:**
- Published: Green badge
- Scheduled: Blue badge
- Draft: Gray badge
- Failed: Red badge

### PostMetrics

A component that displays metrics for a post based on its status.

**File Path:** `/src/components/molecules/PostStatusBadge.tsx` (included in the same file)

**Props:**
```typescript
interface PostMetricsProps {
  post: TopPost;
}
```

**Behavior:**
- For published posts: Shows actual metrics (likes, comments, shares)
- For scheduled posts: Shows scheduled date and explanatory text
- For draft posts: Shows explanatory text about the draft status

**Usage:**
```tsx
<PostMetrics post={post} />
```

## Data Flow

1. User selects an account in the Analyze page
2. `AnalyzeContent` component fetches data using `analyticsService.getAccountAnalytics()`
3. Posts are processed and stored in state with proper status handling
4. User can filter posts by status using the dropdown
5. Each post is displayed with its `PostStatusBadge` and `PostMetrics`

## Status Handling

The application handles three post statuses:

1. **Published** - Posts that have been published to social media platforms
   - Have metrics (likes, comments, shares)
   - Display actual publication date

2. **Scheduled** - Posts that are scheduled for future publication
   - No metrics (all set to 0)
   - Display scheduled publication date
   - Sorted by scheduled date in the posts list

3. **Draft** - Posts that are saved but not yet published or scheduled
   - No metrics (all set to 0)
   - No publication date
   - Display explanatory text about draft status
