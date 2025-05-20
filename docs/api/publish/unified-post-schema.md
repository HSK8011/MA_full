# Unified Post Schema Design

## Overview
This document outlines the unified schema approach for managing posts in different states throughout their lifecycle in the Marketing Automation Application. Instead of creating separate schemas for drafts, queued posts, and delivered posts, we use a single `Post` schema with a `status` field to track the post's current state.

## Benefits of Unified Schema

1. **Simplified Data Model**: A single schema reduces duplicated fields across multiple schemas
2. **Consistent API Design**: All post types share the same endpoints with filtering by status
3. **Streamlined State Transitions**: Moving posts between states requires only updating the status field
4. **Reduced Database Complexity**: One collection/table instead of multiple related tables
5. **Improved Query Performance**: Easier to query across all post types when needed
6. **Simplified Frontend Components**: Components can handle multiple post states with conditional rendering

## Post Lifecycle States

The `status` field in the `Post` schema indicates where a post is in its lifecycle:

### Pre-Publishing States
- **draft**: Content saved but not scheduled or ready for publishing
- **queued**: Scheduled for future publishing at a specific time
- **pending-approval**: Submitted and waiting for approval from a team member
- **rejected**: Reviewed and rejected during the approval process

### Post-Publishing States
- **published**: Successfully sent to the social platform(s)
- **delivered**: Confirmed as visible/active on the platform(s)
- **failed**: Failed to publish due to API errors or other issues

### Additional States
- **archived**: No longer active but saved for historical reference
- **deleted**: Marked for deletion but not removed from the database

## Schema Implementation

The unified `Post` schema includes fields relevant to all states, with some fields only populated for certain states:

```typescript
interface Post {
  // Core fields (always present)
  id: string;
  userId: string;
  teamId?: string;
  content: string;
  platforms: SocialPlatform[];
  accountIds: string[];
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  
  // Optional for drafts, required for queued posts
  scheduledTime?: Date;
  
  // Only relevant for drafts
  draftNotes?: string;
  draftLastModifiedAt?: Date;
  
  // Only populated after publishing attempt
  publishedAt?: Date;
  failedAt?: Date;
  
  // Only populated after successful publishing
  analytics?: PostAnalytics;
}
```

## API Design

The unified schema approach allows for a more consistent API design:

### Base Endpoints
- `GET /api/posts`: Get all posts (with filtering)
- `POST /api/posts`: Create a new post
- `GET /api/posts/:id`: Get a specific post
- `PUT /api/posts/:id`: Update a post
- `DELETE /api/posts/:id`: Delete a post

### Status-Based Filtering
- `GET /api/posts?status=draft`: Get all draft posts
- `GET /api/posts?status=queued`: Get all queued posts
- `GET /api/posts?status=delivered`: Get all delivered posts

### State Transitions
- `PUT /api/posts/:id/status`: Update a post's status
  ```json
  {
    "status": "queued",
    "scheduledTime": "2023-09-01T15:30:00Z"
  }
  ```

## Implementation Examples

### Creating a Draft Post
```typescript
// Create a new draft post
const createDraft = async (content) => {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content,
      status: 'draft',
      platforms: ['twitter', 'linkedin'],
      accountIds: ['acc_1', 'acc_2']
    })
  });
  
  return await response.json();
};
```

### Converting a Draft to a Queued Post
```typescript
// Schedule a draft post for publishing
const scheduleDraft = async (postId, scheduledTime) => {
  const response = await fetch(`/api/posts/${postId}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'queued',
      scheduledTime
    })
  });
  
  return await response.json();
};
```

### Filtering Posts by Status
```typescript
// Get all drafts
const getDrafts = async () => {
  const response = await fetch('/api/posts?status=draft', {
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });
  
  return await response.json();
};
```

## Frontend Implementation

The unified schema simplifies frontend components by allowing them to handle different post states through conditional rendering:

```tsx
const PostItem = ({ post }) => {
  return (
    <div className="post-card">
      <div className="post-content">{post.content}</div>
      
      {/* Status-specific UI elements */}
      {post.status === 'draft' && (
        <div className="draft-badge">Draft</div>
      )}
      
      {post.status === 'queued' && (
        <div className="scheduled-time">
          Scheduled for {formatDate(post.scheduledTime)}
        </div>
      )}
      
      {post.status === 'delivered' && (
        <div className="analytics-preview">
          {post.analytics.engagement} engagements
        </div>
      )}
      
      {/* Action buttons based on status */}
      <div className="actions">
        {post.status === 'draft' && (
          <>
            <button>Edit</button>
            <button>Schedule</button>
          </>
        )}
        
        {post.status === 'queued' && (
          <>
            <button>Reschedule</button>
            <button>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};
```

## Data Migrations

For existing systems with separate schemas, follow these migration steps:

1. Create the unified Post schema
2. Migrate data from each separate schema into the unified schema, setting the appropriate status
3. Update API endpoints to use the unified schema
4. Update frontend components to handle all post states
5. Deprecate the old separate endpoints

## Conclusion

The unified schema approach provides significant benefits in terms of simplicity, maintainability, and performance. By using a single `Post` schema with a `status` field to track lifecycle states, we can streamline the application architecture while maintaining all the functionality of separate schemas. 