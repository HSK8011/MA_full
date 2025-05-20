# Delivered Posts to Queue Times Connection

## Overview
This document outlines the connection between the Delivered Posts module and the Queue Times feature in the Marketing Automation Application. It describes how published posts can be reshared and scheduled for future publication using the queue management system.

## Connection Flow

```
┌─────────────────┐                 ┌──────────────────┐
│                 │  Reshare        │                  │
│  DeliveredPosts │────────────────▶│   Queue Times    │
│   Component     │                 │    Component     │
│                 │                 │                  │
└─────────────────┘                 └──────────────────┘
         │                                    │
         │ Post Data                          │ Schedule
         │                                    │
         ▼                                    ▼
┌─────────────────┐                 ┌──────────────────┐
│                 │                 │                  │
│   Post Store    │                 │  Scheduler API   │
│                 │                 │                  │
└─────────────────┘                 └──────────────────┘
```

## User Flow

1. **Viewing Delivered Posts**
   - User navigates to the Delivered Posts section
   - System displays posts that have been published across connected social media platforms

2. **Initiating Reshare**
   - User clicks "Re-Share" button on a delivered post
   - System captures the post ID and content details
   - User is redirected to Queue Times management page with URL parameter: `/publish?view=queue-times&postId={postId}`

3. **Configuring Queue Schedule**
   - Queue Times page detects the incoming postId parameter
   - System pre-loads the post content for scheduling
   - User configures or selects queue time slots for resharing

4. **Completing Reshare**
   - User confirms the scheduling action
   - System adds the post to the queue with selected time slots
   - Post appears in the Queued Posts section with scheduled publishing dates

## API Interactions

### DeliveredPosts to Queue Times Navigation
```typescript
// From DeliveredPosts component
const handleReshare = (postId: string) => {
  console.log(`Resharing post: ${postId}`);
  // Navigate to queue times view with postId parameter
  navigate(`/publish?view=queue-times&postId=${postId}`);
};
```

### Queue Times Component Detection
```typescript
// In Queue Times component
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const postId = params.get('postId');
  
  if (postId) {
    // Load the post data for resharing
    fetchPostData(postId);
  }
}, [location.search]);

const fetchPostData = async (postId) => {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch post data');
    }
    
    const postData = await response.json();
    setPostToReshare(postData);
  } catch (error) {
    console.error('Error fetching post data:', error);
    // Show error notification
  }
};
```

## Data Models

### Delivered Post Reference
When a post is passed from Delivered Posts to Queue Times, the following data is transferred:

```typescript
interface DeliveredPostReference {
  id: string;             // Original post ID
  content: string;        // Post content
  mediaUrls: string[];    // Media attachments
  platforms: string[];    // Original platforms it was posted to
  authorId: string;       // Original author
  metadata: {            
    originalPostDate: string;   // When it was originally posted
    engagement: {               // Optional - engagement metrics
      likes: number;
      comments: number;
      shares: number;
    }
  }
}
```

### Queue Time Entry
When scheduling a reshared post, the following data model is used:

```typescript
interface QueueTimeEntry {
  id?: string;            // Generated on server for new entries
  postId: string;         // Reference to the post being reshared
  accountId: string;      // Social media account
  platform: string;       // Target platform
  scheduledTime: string;  // ISO timestamp for publishing
  status: 'queued';       // Always starts as 'queued'
  reshared: true;         // Flag indicating this is a reshared post
  originalPostId: string; // Reference to the original delivered post
}
```

## Implementation Details

### URL Parameter Handling
The Queue Times component should handle URL parameters for a seamless user experience:

```typescript
// URL structure for resharing
// /publish?view=queue-times&postId=123456

// Extracting parameters in Queue Times component
const location = useLocation();
const queryParams = new URLSearchParams(location.search);

// Check if this is a reshare operation
const isReshare = queryParams.has('postId');
const postIdToReshare = queryParams.get('postId');

// If resharing, load the post data and show special UI
if (isReshare && postIdToReshare) {
  // Load post data and show reshare UI
}
```

### Reshare UI Considerations
When a user is resharing content, the Queue Times component should:

1. Show a preview of the content being reshared
2. Highlight this as a reshare operation
3. Pre-select the platforms where it was originally posted
4. Provide options for scheduling:
   - Add to existing queue slots
   - Create new queue slots specifically for this content
   - Schedule as one-time posts at specific dates/times

## Error Handling

### Common Errors
1. **Post Not Found**
   - If the original post can't be found, show appropriate error
   - Provide option to navigate back to Delivered Posts

2. **Queue Full**
   - If queue slots are full for selected times
   - Suggest alternate times or expanding queue capacity

3. **Permission Issues**
   - Check if user has permission to reschedule content
   - Verify platform connection status before allowing reshare

## Metrics & Analytics

### Tracking Reshared Content
When content is reshared, the system should track:

1. **Reshare Rate**: Percentage of delivered posts that get reshared
2. **Reshare Performance**: Comparison of engagement between original and reshared posts
3. **Time Efficiency**: How quickly users complete the reshare process
4. **Platform Preferences**: Which platforms users prefer for resharing content

## Related Documentation

- [Queue Times API](./queue-times.md)
- [Delivered Posts Module](./delivered-connections.md)
- [Post Scheduling API](../posts/scheduling.md) 