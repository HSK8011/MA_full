# Drafts Posts Page

## Overview
The Drafts Posts page displays all saved draft posts from the user's connected social media accounts. This page serves as a storage for ideas and partially completed posts that the user intends to publish at a later date. Drafts provide a way for users to save post content when they have an idea but aren't ready to schedule or publish it yet.

## User Journey
1. User has a content idea but isn't sure when to publish it
2. User creates content and saves it as a draft
3. The post appears in the Drafts section
4. Later, the user can return to:
   - Edit the draft content
   - Delete the draft
   - View the draft details
   - Publish the draft or schedule it for future publishing

## Component Structure
The DraftsPosts component is structured as an organism in our Atomic Design pattern and includes the following elements:

### Main Components
- **Account Selector Dropdown**: Allows filtering drafts by social media account
- **Draft Post List**: Displays all draft posts matching the selected account filter
- **Draft Post Cards**: Displays individual draft information
- **Action Menu**: Context menu with actions for each draft (Edit, Delete, View, Publish)

### Parent Components
- **PublishContent**: Container component that manages active view in the Publish section
- **PublishPage**: Parent page component that includes navigation between different Publish views

### Child Components
- **SocialMediaFilters**: Molecular component for filtering by platform
- **DraftPostCard**: Molecular component representing a single draft post
- **EmptyState**: Atom component shown when no drafts are available

## Component Props

```typescript
interface DraftsPostsProps {
  className?: string;  // Optional CSS class for styling
}
```

## Data Models

### SocialAccount
```typescript
interface SocialAccount {
  id: string;  // Unique identifier for the account
  name: string;  // Display name of the account
  platform: 'twitter' | 'linkedin' | 'facebook' | 'pinterest' | 'instagram' | 'all';  // Social platform
  icon: string;  // Path to the platform icon
}
```

### DraftPost
```typescript
interface DraftPost {
  id: string;  // Unique identifier for the draft
  author: string;  // Name of the author
  authorHandle: string;  // Social media handle of the author
  date: string;  // Creation date of the draft
  time: string;  // Creation time of the draft
  content: string;  // Main content of the draft
  socialIcons: string[];  // Platforms where this draft will be posted
  accountId: string;  // ID of the associated social account
  type: string;  // Type of post (e.g., "Draft Post")
}
```

## Component State
- **Selected Account**: Currently selected account for filtering drafts
- **Account Dropdown**: Open/closed state of the account selection dropdown
- **Draft Posts**: List of all draft posts
- **Filtered Drafts**: Draft posts filtered by the selected account
- **Action Menu**: Open/closed state of the action menu for each draft

## User Interactions

### Account Selection
- User can click on the account dropdown to view all connected accounts
- Selecting an account filters the drafts list to show only drafts for that account
- Selecting "All Accounts" shows drafts from all connected accounts

### Draft Actions
- **Edit**: Opens the post editor with the draft content for editing
- **Delete**: Removes the draft after confirmation
- **View**: Navigates to the queue times management page to view detailed information
- **Publish**: Opens the publishing interface to immediately publish or schedule the draft

## API Connections

### Draft Management Endpoints
The component will interact with the following API endpoints:

#### GET /api/posts/drafts
- Fetches all draft posts for the current user
- Optional query parameter: `accountId` to filter by specific account

#### DELETE /api/posts/drafts/:id
- Deletes a specific draft post by ID

#### GET /api/posts/drafts/:id
- Fetches a specific draft post by ID

#### GET /api/accounts
- Fetches all connected social media accounts for filtering

## Navigation Flows

### From Drafts to Other Pages
- **Edit Draft** → Navigate to `/publish/editor?draftId={draftId}`
- **View Draft** → Navigate to `/publish/queue-times?draftId={draftId}`
- **Publish Draft** → Navigate to `/publish/editor?draftId={draftId}&action=publish`

### To Drafts from Other Pages
- From **Navigation Menu** → `/publish/drafts`
- From **Post Editor** (after saving draft) → `/publish/drafts`

## Responsive Design
The component adapts to different screen sizes with the following considerations:

### Desktop (> 1024px)
- Full view with multiple drafts displayed in a grid layout
- Account selection dropdown at full width
- Action menu opens as a dropdown next to the draft card

### Tablet (768px - 1024px)
- Slightly condensed view with fewer columns in the grid
- Account selection dropdown remains at the top
- Action menu behavior remains the same

### Mobile (< 768px)
- Single column layout for drafts
- Account selection dropdown takes full width
- Simplified draft cards with essential information
- Action menu opens as a bottom sheet

## Accessibility Considerations
- Account dropdown is keyboard navigable
- Action menus are accessible via keyboard
- Draft cards provide proper focus indicators
- Draft content is readable by screen readers
- Color contrast meets WCAG AA standards

## Error Handling
- Error state when draft posts cannot be loaded
- Empty state when no drafts are available
- Error message when a draft cannot be deleted
- Graceful degradation when account information is unavailable

## Technical Implementation Notes
- Draft posts are fetched when the component mounts
- Account selection changes trigger a re-filtering of the drafts list
- Action menu closes when clicking outside its boundaries
- Drafts are sorted by creation date (newest first)
- Account filter preference is remembered between sessions

## Schema Relationships

```
┌─────────────────┐          ┌──────────────────┐
│                 │          │                  │
│   DraftsPosts   │─────────▶│    Post Editor   │
│    Component    │◀─────────│     Component    │
│                 │          │                  │
└────────┬────────┘          └────────┬─────────┘
         │                            │
         │                            │
         ▼                            ▼
┌─────────────────┐          ┌──────────────────┐
│                 │          │                  │
│ Draft Post API  │◀────────▶│ Connected        │
│ Endpoints       │          │ Social Accounts  │
│                 │          │                  │
└─────────────────┘          └──────────────────┘
```

## Data Schema Extensions

To support the Drafts Posts functionality, the core Post schema is extended with:

```typescript
// Extension to the Post schema for drafts
interface DraftPostExtension {
  isDraft: boolean;                // Flag indicating this is a draft
  draftCreatedAt: Date;            // When the draft was first created
  draftLastModifiedAt: Date;       // When the draft was last edited
  draftNotes?: string;             // Optional notes about the draft
  contentProgress?: number;        // Estimated completion percentage
  autoSavedVersion?: {             // Auto-saved version if available
    content: string;
    timestamp: Date;
  };
}
```

## Future Enhancements
- **Content Templates**: Save drafts as reusable templates
- **Draft Categories**: Organize drafts by custom categories
- **Bulk Actions**: Select multiple drafts for batch operations
- **Collaboration**: Share drafts with team members for input
- **Version History**: View and restore previous versions of a draft
- **AI Suggestions**: Get content improvement suggestions for drafts
- **Draft Analytics**: See potential reach/impact predictions for draft content 