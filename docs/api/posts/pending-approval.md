# Pending Approval API

## Overview
API endpoints for managing posts that require approval before publishing to social media platforms.

## Endpoints

### Get Pending Approval Posts

#### Endpoint
`GET /api/posts/pending-approval`

#### Authentication
Requires valid JWT token.

#### Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token |

### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| page | number | No | Page number for pagination (default: 1) |
| limit | number | No | Number of items per page (default: 10) |
| socialAccountId | string | No | Filter by social media account ID |
| status | string | No | Filter by approval status ('needs_approval', 'approved', 'rejected') |
| authorId | string | No | Filter by post author ID |
| startDate | ISO8601 | No | Filter by created date range start |
| endDate | ISO8601 | No | Filter by created date range end |

#### Response
### Success Response
- Status Code: 200
```json
{
  "data": [
    {
      "id": "post-123",
      "authorId": "user-456",
      "authorName": "AIMDek Technologies",
      "authorHandle": "@aimdektech",
      "content": "Data and Creativity ❤️ The dynamic duo that your marketing strategy needs.",
      "socialMediaAccounts": [
        {
          "id": "social-789",
          "platform": "facebook"
        },
        {
          "id": "social-790",
          "platform": "twitter"
        }
      ],
      "mediaAttachments": [
        {
          "id": "media-001",
          "type": "image",
          "url": "/images/uploads/marketing-data.jpg"
        }
      ],
      "scheduledTime": "2024-04-15T15:30:00Z",
      "createdAt": "2024-04-10T09:22:43Z",
      "approvalStatus": "needs_approval"
    }
  ],
  "pagination": {
    "total": 45,
    "pages": 5,
    "page": 1,
    "limit": 10
  }
}
```

### Error Responses
- Status Code: 401
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

- Status Code: 403
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions to view pending approval posts"
}
```

### Approve Post

#### Endpoint
`PATCH /api/posts/:id/approve`

#### Authentication
Requires valid JWT token with admin privileges.

#### Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token |

### Path Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| id | string | Yes | Post ID to approve |

### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| approvalNote | string | No | Optional note about the approval |

#### Response
### Success Response
- Status Code: 200
```json
{
  "id": "post-123",
  "approvalStatus": "approved",
  "approvedBy": "admin-789",
  "approvedAt": "2024-04-12T14:32:10Z",
  "message": "Post approved successfully"
}
```

### Error Responses
- Status Code: 401
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

- Status Code: 403
```json
{
  "error": "Forbidden",
  "message": "Only administrators can approve posts"
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "message": "Post not found"
}
```

- Status Code: 409
```json
{
  "error": "Conflict",
  "message": "Post has already been approved or rejected"
}
```

### Reject Post

#### Endpoint
`PATCH /api/posts/:id/reject`

#### Authentication
Requires valid JWT token with admin privileges.

#### Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token |

### Path Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| id | string | Yes | Post ID to reject |

### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| rejectionReason | string | No | Reason for rejection |

#### Response
### Success Response
- Status Code: 200
```json
{
  "id": "post-123",
  "approvalStatus": "rejected",
  "approvedBy": "admin-789",
  "approvedAt": "2024-04-12T14:32:10Z",
  "rejectionReason": "Content doesn't comply with brand guidelines",
  "message": "Post rejected successfully"
}
```

### Error Responses
- Status Code: 401
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

- Status Code: 403
```json
{
  "error": "Forbidden",
  "message": "Only administrators can reject posts"
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "message": "Post not found"
}
```

- Status Code: 409
```json
{
  "error": "Conflict",
  "message": "Post has already been approved or rejected"
}
```

### Get Post Details

#### Endpoint
`GET /api/posts/:id`

#### Authentication
Requires valid JWT token.

#### Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token |

### Path Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| id | string | Yes | Post ID to retrieve |

#### Response
### Success Response
- Status Code: 200
```json
{
  "id": "post-123",
  "authorId": "user-456",
  "authorName": "AIMDek Technologies",
  "authorHandle": "@aimdektech",
  "content": "Data and Creativity ❤️ The dynamic duo that your marketing strategy needs.",
  "socialMediaAccounts": [
    {
      "id": "social-789",
      "platform": "facebook"
    },
    {
      "id": "social-790",
      "platform": "twitter"
    }
  ],
  "mediaAttachments": [
    {
      "id": "media-001",
      "type": "image",
      "url": "/images/uploads/marketing-data.jpg"
    }
  ],
  "scheduledTime": "2024-04-15T15:30:00Z",
  "createdAt": "2024-04-10T09:22:43Z",
  "approvalStatus": "needs_approval",
  "approvedBy": null,
  "approvedAt": null,
  "rejectionReason": null
}
```

### Error Responses
- Status Code: 401
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

- Status Code: 403
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to view this post"
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "message": "Post not found"
}
```

## Example Usage
```typescript
// Example: Get pending approval posts
async function getPendingApprovalPosts() {
  const response = await fetch('/api/posts/pending-approval', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

// Example: Approve a post
async function approvePost(postId, note) {
  const response = await fetch(`/api/posts/${postId}/approve`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      approvalNote: note
    })
  });
  return response.json();
}
```

## Notes
1. Only administrators can approve or reject posts
2. Regular employees can view pending posts but cannot approve or reject them
3. Posts that are not approved before their scheduled time will be automatically rejected
4. Approval and rejection actions are permanent and logged for auditing purposes
5. All API endpoints have rate limiting of 100 requests per minute per user 