# Delivered Posts Module Connections

## Overview
This document outlines the connections, data flow, and interactions between the Delivered Posts module and other components in the Marketing Automation Application. It describes how published posts are displayed, analyzed, and reshared within the system.

## Key Components
- **DeliveredPosts Component**: UI for viewing and managing successfully delivered posts
- **Post Analytics**: Interface for viewing performance metrics of delivered posts
- **Post Editor**: Rich text editor for resharing/reusing delivered post content
- **PublishContent**: Container component that manages active view in the Publish section

## Data Flow Diagram
```
┌─────────────────┐          ┌──────────────────┐
│                 │  Reshare │                  │
│  DeliveredPosts │─────────▶│    Post Editor   │
│   Component     │          │    Component     │
│                 │          │                  │
└────────┬────────┘          └──────────────────┘
         │                            
         │ View Analytics            
         ▼                            
┌─────────────────┐          
│                 │          
│ Post Analytics  │          
│   Component     │          
│                 │          
└─────────────────┘          
         ▲
         │
         │ Performance Data
┌────────┴────────┐
│                 │
│  Social Media   │
│    APIs         │
│                 │
└─────────────────┘
```

## Navigation Flows

### DeliveredPosts to Analytics
1. **Viewing Post Analytics**
   - User clicks "View Analytics" in post actions menu
   - Navigate to: `/analyze/post/{postId}`
   - Analytics component loads with performance data for the specific post

### DeliveredPosts to Editor
1. **Resharing a Post**
   - User clicks "Re-Share" button or action
   - Navigate to: `/publish/editor?copyFrom={postId}`
   - Editor loads with content from the delivered post for editing and resharing

## State Management

### URL Parameters
The application uses URL parameters to pass state between components:

| Parameter   | Description                               | Example                     |
|-------------|-------------------------------------------|----------------------------|
| `postId`    | ID of delivered post                      | `post_123456`              |
| `copyFrom`  | ID of post to copy content from           | `post_123456`              |
| `accountId` | Pre-selected social account for filtering | `acc_456`                  |

### LocalStorage Usage
Some state is persisted in LocalStorage:

| Key                          | Purpose                                    | Expiration |
|------------------------------|-------------------------------------------|------------|
| `delivered_last_filter`      | Remember last account filter selection     | 30 days    |
| `analytics_last_viewed_post` | ID of last viewed post in analytics        | 1 day      |

## Component Communication

### DeliveredPosts Component
The DeliveredPosts component interacts with other parts of the system:

1. **Retrieves delivered post data from API**
   ```typescript
   // Example: Fetch all delivered posts on component mount
   useEffect(() => {
     const fetchDeliveredPosts = async () => {
       const response = await fetch('/api/posts?status=delivered', {
         headers: { 'Authorization': `Bearer ${userToken}` }
       });
       const data = await response.json();
       setDeliveredPosts(data.posts);
     };
     
     fetchDeliveredPosts();
   }, []);
   ```

2. **Passes post data to other components through navigation**
   ```typescript
   // Example: Navigate to analytics for a post
   const handleView = (postId) => {
     navigate(`/analyze/post/${postId}`);
   };
   
   // Example: Navigate to editor with post content
   const handleReshare = (postId) => {
     navigate(`/publish/editor?copyFrom=${postId}`);
   };
   ```

### Analytics Component
When viewing analytics for a delivered post:

```typescript
// Example: Load analytics data for a post
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const postId = params.get('postId');
  
  if (postId) {
    const loadPostAnalytics = async () => {
      const response = await fetch(`/api/analytics/post/${postId}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const analyticsData = await response.json();
      setPostAnalytics(analyticsData);
    };
    
    loadPostAnalytics();
  }
}, [location.search]);
```

### Post Editor Component
When resharing a delivered post:

```typescript
// Example: Load delivered post content into editor for resharing
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const copyFromId = params.get('copyFrom');
  
  if (copyFromId) {
    const loadPostForReshare = async () => {
      const response = await fetch(`/api/posts/${copyFromId}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const postData = await response.json();
      
      // Populate editor with existing content but as a new post
      setEditorContent(postData.content);
      setPlatformSelections(postData.platforms);
      setMediaUrls(postData.mediaUrls || []);
      // Note: don't copy the ID - this will be a new post
    };
    
    loadPostForReshare();
  }
}, [location.search]);
```

## Data Transfer Objects

### Delivered Post to Analytics Transfer
When a delivered post is viewed in analytics, the following data is transferred:

```typescript
interface DeliveredPostAnalyticsData {
  postId: string;              // Original post ID for analytics lookup
  content: string;             // Post content (for reference)
  platforms: string[];         // Platforms where it was posted
  accountIds: string[];        // Accounts it was posted from
  publishedAt: Date;           // When the post was published
}
```

### Delivered Post to Editor Transfer
When resharing a delivered post, the following data is transferred:

```typescript
interface DeliveredPostToEditorData {
  content: string;             // Original post content
  mediaUrls: string[];         // Media attachments
  mediaType: string;           // Type of media 
  platforms: string[];         // Original platforms (for reference)
  // Note: No ID is transferred as this will be a new post
}
```

## API Connections

### Delivered Post Management Endpoints
The component will interact with the following API endpoints:

#### GET /api/posts?status=delivered
- Fetches all delivered posts for the current user
- Optional query parameter: `accountId` to filter by specific account

#### GET /api/posts/:id
- Fetches a specific post by ID (for both delivered and other post types)

#### GET /api/analytics/post/:id
- Fetches analytics data for a specific post

## Performance Considerations

### Delivered Posts List Optimization
- Pagination is implemented for long lists of delivered posts
- Posts are loaded in chunks of 20 with infinite scroll
- Analytics metrics summary is cached for quick display
- Full analytics data is loaded only when a user views detailed analytics

### Data Caching
- Delivered post list is cached for 5 minutes
- Basic engagement metrics are cached with the post data
- Full analytics data is cached separately with a shorter TTL (1 minute)

## Future Enhancements

### Planned Connections
1. **Enhanced Analytics Integration**
   - Inline preview of key performance metrics on delivered posts list
   - Visual indicators for high/low performing posts
   - Comparative analysis between original and reshared posts

2. **Social Media Feedback**
   - Display comments and engagement directly in the delivered posts view
   - Ability to respond to comments from within the application

3. **Campaign Tracking**
   - Associate delivered posts with marketing campaigns
   - Campaign-level analytics and performance tracking
   - Compare performance across related posts

4. **AI-Powered Insights**
   - Performance prediction for reshared content
   - Content optimization suggestions based on past performance
   - Best time to reshare recommendations

## Related Documentation

See the following API documentation for detailed endpoint specifications:
- [List Posts](./posts/list-posts.md)
- [Get Post Analytics](../analytics/post-analytics.md)
- [Create Post](./posts/create-post.md)
- [Update Post](./posts/update-post.md) 