# Drafts Module Connections

## Overview
This document outlines the connections, data flow, and interactions between the Drafts module and other components in the Marketing Automation Application. It describes how draft posts are created, managed, and transitioned to published content.

## Key Components
- **DraftsPost Component**: UI for viewing and managing draft posts
- **Post Editor**: Rich text editor for composing and editing draft content
- **PublishContent**: Container component that manages active view in the Publish section
- **Queue Times Manager**: Interface for scheduling when posts will be published

## Data Flow Diagram
```
┌─────────────────┐          ┌──────────────────┐
│                 │  Create  │                  │
│   DraftsPosts   │─────────▶│    Post Editor   │
│    Component    │◀─────────│    Component     │
│                 │  Update  │                  │
└────────┬────────┘          └────────┬─────────┘
         │                            │
         │ View                       │ Save
         ▼                            ▼
┌─────────────────┐          ┌──────────────────┐
│                 │  Schedule│                  │
│   Queue Times   │◀─────────│  Draft API       │
│    Manager      │          │  Endpoints       │
│                 │          │                  │
└─────────────────┘          └────────┬─────────┘
                                      │
                                      │ Publish
                                      ▼
                             ┌──────────────────┐
                             │                  │
                             │  Published       │
                             │  Content         │
                             │                  │
                             └──────────────────┘
```

## Navigation Flows

### Editor to Drafts
1. **Creating a New Draft**
   - User creates content in Post Editor
   - Clicks "Save as Draft" button
   - System creates draft via API
   - Navigate to: `/publish/drafts`

2. **Updating an Existing Draft**
   - User edits draft content in Post Editor
   - Clicks "Save Draft" button
   - System updates draft via API
   - Navigate to: `/publish/drafts`

### Drafts to Other Components
1. **Draft to Editor (Edit Action)**
   - User clicks "Edit" in draft actions menu
   - Navigate to: `/publish/editor?draftId={draftId}`
   - Editor loads existing draft content

2. **Draft to Queue Times (View Action)**
   - User clicks "View" in draft actions menu
   - Navigate to: `/publish/queue-times?draftId={draftId}`
   - Queue Times manager loads with draft details

3. **Draft to Publishing (Publish Action)**
   - User clicks "Publish" in draft actions menu
   - Navigate to: `/publish/editor?draftId={draftId}&action=publish`
   - Editor loads with publishing options pre-selected

## State Management

### URL Parameters
The application uses URL parameters to pass state between components:

| Parameter   | Description                               | Example                           |
|-------------|-------------------------------------------|-----------------------------------|
| `draftId`   | ID of draft being accessed                | `draft_123456`                    |
| `action`    | Action to perform on the draft            | `edit`, `publish`, `view`         |
| `accountId` | Pre-selected social account for posting   | `acc_456`                         |

### LocalStorage Usage
Some state is persisted in LocalStorage:

| Key                          | Purpose                                 | Expiration |
|------------------------------|----------------------------------------|------------|
| `drafts_last_filter`         | Remember last account filter selection  | 30 days    |
| `drafts_unsaved_content`     | Autosave for draft being edited         | 7 days     |
| `selected_social_platforms`  | Remember last selected social platforms | 30 days    |

## Component Communication

### DraftsPosts Component
The DraftsPosts component interacts with other parts of the system:

1. **Retrieves draft data from API**
   ```typescript
   // Example: Fetch all drafts on component mount
   useEffect(() => {
     const fetchDrafts = async () => {
       const response = await fetch('/api/posts/drafts', {
         headers: { 'Authorization': `Bearer ${userToken}` }
       });
       const data = await response.json();
       setDrafts(data.drafts);
     };
     
     fetchDrafts();
   }, []);
   ```

2. **Passes draft data to other components through navigation**
   ```typescript
   // Example: Navigate to edit a draft
   const handleEdit = (draftId) => {
     navigate(`/publish/editor?draftId=${draftId}`);
   };
   
   // Example: Navigate to view a draft in queue times
   const handleView = (draftId) => {
     navigate(`/publish/queue-times?draftId=${draftId}`);
   };
   ```

### Post Editor Component
The Post Editor receives draft information and can save back to drafts:

```typescript
// Example: Load draft data in editor
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const draftId = params.get('draftId');
  
  if (draftId) {
    // Load existing draft data for editing
    const loadDraft = async () => {
      const response = await fetch(`/api/posts/drafts/${draftId}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const draftData = await response.json();
      setEditorContent(draftData.content);
      setPlatformSelections(draftData.socialPlatforms);
      // Load other draft data into editor state
    };
    
    loadDraft();
  }
}, [location.search]);
```

## Data Transfer Objects

### Draft to Editor Transfer
When a draft is sent to the editor, the following data is transferred:

```typescript
interface DraftToEditorData {
  id: string;                  // Draft ID for updates
  content: string;             // Main post content
  mediaUrls: string[];         // Media attachments
  mediaType: string;           // Type of media 
  socialPlatforms: string[];   // Selected platforms
  accountIds: string[];        // Selected accounts
  variations: Record<string, { content: string }>; // Platform-specific variations
  link?: string;               // Optional link
  tags?: string[];             // Optional tags
}
```

### Draft to Queue Times Transfer
When a draft is sent to the queue times manager, the following data is transferred:

```typescript
interface DraftToQueueTimesData {
  id: string;                  // Draft ID
  content: string;             // Content preview
  mediaUrls: string[];         // Media preview
  socialPlatforms: string[];   // Selected platforms
  accountIds: string[];        // Selected accounts
  // No scheduling information yet (to be added in Queue Times)
}
```

## Error Handling and Recovery

### Autosave Functionality
- Draft content is automatically saved to localStorage while editing
- If browser crashes during editing, content can be recovered
- User is prompted to recover unsaved changes when returning to editor

### Conflict Resolution
- If multiple users edit the same draft (team scenario), last-save wins
- Timestamp tracking enables conflict detection
- Users are notified when opening a draft that was modified by someone else

## Data Lifecycle

### Draft Creation
1. User composes content in editor
2. Saves as draft via API
3. Draft is stored in database with isDraft=true
4. Draft appears in Drafts list

### Draft Updates
1. User selects draft for editing
2. Draft data loaded into editor
3. User modifies content
4. Updated draft saved via API
5. Updated draft appears in Drafts list

### Draft to Published Content
1. User selects draft for publishing
2. Draft data loaded into editor with publish intent
3. User adds scheduling information
4. System creates a new scheduled post based on draft
5. Original draft can be:
   - Deleted automatically
   - Kept as reference
   - Marked as "published" but retained

## Future Enhancements

### Planned Connections
1. **Integrate with Analytics Module**
   - Draft performance predictions based on content analysis
   - Suggestions to improve draft engagement potential

2. **Integrate with Content AI**
   - AI-powered content suggestions for drafts
   - Automated draft improvements
   - Platform-specific variation generation

3. **Team Collaboration Features**
   - Draft sharing with team members
   - Collaborative editing of drafts
   - Draft approval workflows

4. **Draft Categorization**
   - Tag-based organization of drafts
   - Draft collections and grouping
   - Campaign association for drafts

## API Endpoints

See the following API documentation for detailed endpoint specifications:
- [Create Draft](./create-draft.md)
- [List Drafts](./list-drafts.md)
- [Get Draft](./get-draft.md)
- [Update Draft](./update-draft.md)
- [Delete Draft](./delete-draft.md)
- [Publish Draft](./publish-draft.md) 