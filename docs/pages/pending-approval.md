# Pending Approval Page

## Overview

The Pending Approval page is a dedicated interface for managing posts that require admin approval before publishing. It serves as a moderation layer to ensure all content meets company standards before being published across social media platforms.

## Business Logic

### Approval Workflow

1. **Post Creation**: 
   - When a team member (employee) creates a post, it is automatically sent to the Pending Approval queue
   - When an admin creates a post, it bypasses the approval process and goes directly to the scheduled queue

2. **Approval Process**:
   - Admins can view all posts pending approval
   - Admins can approve posts (moves them to the scheduled queue)
   - Admins can reject posts (removes them from the queue)
   - Admins can view, edit, or delete posts before making an approval decision

3. **Automatic Handling**:
   - If an admin doesn't take action on a post before its scheduled time, it will be automatically rejected
   - Approved posts will be published at their scheduled time

4. **Access Control**:
   - Admins have full access to view, approve, reject, edit, and delete pending posts
   - Regular employees can only view the pending approval page to check status of their submissions
   - Employees cannot take approval actions on this page

## User Interface

### For Admins:

- Post cards display with social media account details, date/time, content, and social platforms
- Status badges show "Needs Approval", "Approved", or "Rejected" states
- Action buttons for Approve and Reject
- Three-dot menu with options to View, Edit, or Delete posts
- Social media account selector to filter posts by account

### For Employees:

- Read-only view of their pending posts
- Status badges to show current approval state
- No action buttons or menus available
- Can only observe the approval process

## Component Schema

### Data Models

#### Post

```typescript
interface Post {
  id: string;
  authorId: string;         // ID of user who created the post
  authorName: string;       // Name of user who created the post
  authorHandle: string;     // Social handle of user who created the post
  content: string;          // Post content/message
  socialMediaAccounts: {    // Which social accounts this post targets
    id: string;
    platform: string;       // facebook, twitter, instagram, etc.
  }[];
  mediaAttachments?: {      // Optional media files
    id: string;
    type: 'image' | 'video' | 'gif';
    url: string;
  }[];
  scheduledTime: Date;      // When post is scheduled to be published
  createdAt: Date;          // When post was created
  approvalStatus: 'needs_approval' | 'approved' | 'rejected';
  approvedBy?: string;      // ID of admin who approved/rejected
  approvedAt?: Date;        // When admin approved/rejected
  rejectionReason?: string; // Optional reason for rejection
}
```

#### User Role Permissions

```typescript
interface UserRolePermissions {
  canCreatePosts: boolean;
  canApprovePosts: boolean;
  canRejectPosts: boolean;
  canEditPosts: boolean;
  canDeletePosts: boolean;
  bypassApproval: boolean;  // True for admins, false for employees
}

interface UserRole {
  id: string;
  name: string;            // "Admin", "Employee", etc.
  permissions: UserRolePermissions;
}
```

## Workflow States

1. **Post Creation**:
   - Employee creates post → Approval status set to `needs_approval`
   - Admin creates post → Approval status set to `approved` (bypasses approval)

2. **Approval Process**:
   - Admin reviews post → Changes status to `approved` or `rejected`
   - System checks → If current time > scheduled time && status is `needs_approval` → Set to `rejected`

3. **Publishing Process**:
   - Scheduled job → If current time ≥ scheduled time && status is `approved` → Publish post

## API Requirements (Future Implementation)

The following endpoints will be needed to support this feature:

1. `GET /api/posts/pending-approval` - Get all posts pending approval
2. `PATCH /api/posts/:id/approve` - Approve a specific post
3. `PATCH /api/posts/:id/reject` - Reject a specific post
4. `GET /api/posts/:id` - Get details of a specific post
5. `PUT /api/posts/:id` - Update/edit a specific post
6. `DELETE /api/posts/:id` - Delete a specific post

## Technical Constraints

1. Approval decisions must be tracked with timestamps and approver details for audit purposes
2. The system should support filtering pending posts by social media account
3. Approved posts should be moved to the scheduled queue for publishing
4. Rejected posts should be stored for reference but not published
5. Employees should be able to see the status of their submitted posts

## Future Enhancements

1. Add approval comment system to allow feedback between admins and employees
2. Implement approval notifications via email or in-app messaging
3. Add bulk approval/rejection functionality for efficiency
4. Create detailed analytics on approval rates, rejection reasons, and turnaround time
5. Allow team leaders to approve posts for their specific teams only