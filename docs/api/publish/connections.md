# Publish Module Connections

## Overview
This document outlines the connections, data flow, and interactions between components in the Publish module, specifically focusing on how the QueuedPosts and ManageQueueTimes pages communicate and share data with each other and other parts of the application.

## Key Components
- **QueuedPosts**: Calendar-based view of scheduled posts
- **ManageQueueTimes**: Post creation and editing interface
- **PublishContent**: Container component that manages active view in the Publish section
- **Post Editor**: Rich text editor for composing post content
- **Platform Selector**: UI for selecting target social platforms
- **Schedule Selector**: Date/time picker for post scheduling

## Data Flow Diagram
```
┌─────────────────┐          ┌──────────────────┐
│                 │  Create  │                  │
│   QueuedPosts   │─────────▶│ ManageQueueTimes │
│   (Calendar)    │◀─────────│  (Post Editor)   │
│                 │  Update  │                  │
└────────┬────────┘          └────────┬─────────┘
         │                            │
         │                            │
         ▼                            ▼
┌─────────────────┐          ┌──────────────────┐
│                 │          │                  │
│ Publish API     │◀────────▶│ Connected        │
│ Endpoints       │          │ Social Accounts  │
│                 │          │                  │
└─────────────────┘          └──────────────────┘
```

## Navigation Flows

### QueuedPosts to ManageQueueTimes
1. **Creating a New Post**
   - User clicks "Schedule Post" button in QueuedPosts header
   - Navigate to: `/publish/queue-times`
   - No parameters passed

2. **Creating a Post for Specific Day**
   - User clicks "Create a Post" button on a specific day in calendar
   - Navigate to: `/publish/queue-times?date=2022-08-08`
   - Pre-selects the date in the scheduling interface

3. **Editing an Existing Post**
   - User clicks on a post card in the calendar
   - Navigate to: `/publish/queue-times?postId=post_123`
   - Loads the existing post data for editing

4. **Viewing All Posts for a Day**
   - User clicks "View all X posts" on a day with many posts
   - Navigate to: `/publish/queue-times?date=2022-08-08&view=list`
   - Shows a list view of all posts for that date

### ManageQueueTimes to QueuedPosts
1. **After Successful Post Creation**
   - User completes post creation and clicks "Schedule"
   - System creates the post via API
   - Navigate to: `/publish/queued`
   - Calendar focuses on the date of the newly created post

2. **After Post Update**
   - User edits a post and saves changes
   - System updates the post via API
   - Navigate to: `/publish/queued`
   - Calendar focuses on the date of the updated post

3. **After Cancellation**
   - User clicks "Cancel" during post creation/editing
   - Navigate to: `/publish/queued` without saving changes
   - Optional: Prompt for confirmation if there are unsaved changes

## State Management

### URL Parameters
The application uses URL parameters to pass state between components:

| Parameter   | Description                               | Example                    |
|-------------|-------------------------------------------|-----------------------------|
| `view`      | Current view in the PublishContent        | `queued`, `queue-times`     |
| `postId`    | ID of post being edited                   | `post_123`                  |
| `date`      | Pre-selected date for new post            | `2022-08-08`                |
| `accountId` | Pre-selected social account for posting   | `acc_456`                   |
| `platform`  | Pre-selected platform type                | `twitter`                   |

### LocalStorage Usage
Some state is persisted in LocalStorage to improve user experience:

| Key                          | Purpose                                 | Expiration |
|------------------------------|----------------------------------------|------------|
| `publish_draft_content`      | Autosave for post content              | 7 days     |
| `publish_selected_accounts`  | Remember user's platform selections    | 30 days    |
| `publish_default_time`       | User's preferred posting time          | Persistent |

## Component Communication

### PublishContent Component
The PublishContent component serves as a container that conditionally renders either QueuedPosts or ManageQueueTimes based on the `activeView` prop. This component:

1. Receives the `activeView` from the parent Publish page
2. Handles switching between different views
3. Passes any URL parameters to the appropriate child component

### QueuedPosts Component
QueuedPosts needs to pass information to ManageQueueTimes when:

1. Creating a new post on a specific date
2. Editing an existing post

It accomplishes this through navigation with parameters:

```typescript
// Example: Navigate to create post on a specific date
navigate(`/publish/queue-times?date=${selectedDate}`);

// Example: Navigate to edit an existing post
navigate(`/publish/queue-times?postId=${post.id}`);
```

### ManageQueueTimes Component
ManageQueueTimes receives information through URL parameters and API calls:

1. On mount, it checks for URL parameters like `postId` or `date`
2. If `postId` is present, it loads the existing post data from the API
3. If `date` is present, it pre-selects that date in the scheduler
4. After successful create/update, it navigates back to QueuedPosts

```typescript
// Example: Check for postId parameter on component mount
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const postId = params.get('postId');
  
  if (postId) {
    // Load existing post data for editing
    fetchPostDetails(postId);
  } else {
    // Initialize new post form
    const date = params.get('date');
    if (date) {
      setSelectedDate(new Date(date));
    }
  }
}, [location.search]);
```

## Error Handling

### Network Errors
- Failed API requests show appropriate error notifications
- Form data is preserved when network errors occur
- Retry mechanisms are implemented for critical operations

### Validation Errors
- Client-side validation prevents submission of invalid data
- Server-side validation errors are displayed next to relevant fields
- Platform-specific limitations are checked before submission

## Performance Optimizations

### Lazy Loading
- The ManageQueueTimes component is lazy-loaded to improve initial load time
- Media preview generation happens asynchronously
- Platform-specific validations run in separate workers

### Caching Strategy
- Post list data is cached for 60 seconds to reduce API calls
- Connected accounts list is cached for 5 minutes
- Media uploads use resumable upload protocols for large files

## Future Enhancements

### Planned Connections
1. **Integrate with Analytics Module**
   - Show post performance predictions based on historical data
   - Suggest optimal posting times based on engagement analytics

2. **Workflow Approvals**
   - Add ability to send posts for approval before scheduling
   - Connect with notification system for approval requests

3. **AI Content Suggestions**
   - Integrate with AI module for content enhancement suggestions
   - Smart hashtag recommendations based on content analysis

## API Endpoints

See the following API documentation for detailed endpoint specifications:
- [List Queued Posts](./posts/list-posts.md)
- [Create Post](./posts/create-post.md)
- [Update Post](./posts/update-post.md)
- [Delete Post](./posts/delete-post.md)
- [Upload Media](./media/upload-media.md)
- [Get Optimal Times](./scheduling/optimal-times.md) 