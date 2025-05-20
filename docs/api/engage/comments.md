# Social Media Comments API

This API allows users to retrieve and manage comments on their social media posts, as well as reply to comments from other users.

## Get Comments for a Post

Retrieves all comments for a specific social media post.

### Endpoint

`GET /api/engage/comments`

### Authentication

Required JWT token in Authorization header.

### Request Parameters

#### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| postId | string | Yes | ID of the post to get comments from |
| sortBy | string | No | Sort order ('newest', 'oldest', 'most_likes') - default: 'newest' |
| includeReplies | boolean | No | Whether to include replies to comments (default: true) |
| status | string | No | Filter by status ('all', 'pending', 'resolved') - default: 'all' |
| page | integer | No | Page number for pagination (default: 1) |
| page_size | integer | No | Number of items per page (default: 20, max: 100) |

### Response

#### Success Response
- Status Code: 200
```json
{
  "data": [
    {
      "id": "comment_1",
      "author": {
        "name": "John Doe",
        "profileImage": "/images/avatars/john.png",
        "isVerified": false,
        "handle": "@johndoe"
      },
      "content": "Great post! I love how you highlighted the synergy between data and creativity.",
      "timeAgo": "2d",
      "timestamp": "2023-05-25T14:30:00Z",
      "likes": 12,
      "isLiked": false,
      "isExternal": true,
      "externalAccountName": "cliniktsolutions",
      "platform": "facebook",
      "status": "pending",
      "replies": [
        {
          "id": "reply_1",
          "author": {
            "name": "AIMDek Technologies",
            "profileImage": "/images/page2/aimdek-logo.png",
            "isVerified": true,
            "handle": "@aimdektech"
          },
          "content": "Thanks for the feedback, John! We're glad you enjoyed it.",
          "timeAgo": "1d",
          "timestamp": "2023-05-26T10:15:00Z",
          "likes": 3,
          "isLiked": false,
          "isExternal": false
        }
      ]
    },
    {
      "id": "comment_2",
      "author": {
        "name": "Emily Clark",
        "profileImage": "/images/avatars/emily.png",
        "isVerified": false,
        "handle": "@emilyclark"
      },
      "content": "This is exactly what our team has been focusing on lately. Would love to hear more about specific case studies.",
      "timeAgo": "1d",
      "timestamp": "2023-05-26T08:45:00Z",
      "likes": 5,
      "isLiked": true,
      "isExternal": true, 
      "externalAccountName": "emilyclark",
      "platform": "facebook",
      "status": "resolved",
      "replies": []
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "page_size": 20,
    "total_pages": 3
  }
}
```

### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "code": "INVALID_POST_ID",
  "details": ["Post ID is required"]
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "code": "POST_NOT_FOUND",
  "details": ["The specified post does not exist"]
}
```

## Get Comment Details

Retrieves detailed information about a specific comment.

### Endpoint

`GET /api/engage/comments/{commentId}`

### Authentication

Required JWT token in Authorization header.

### Request Parameters

#### Path Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| commentId | string | Yes | ID of the comment to retrieve |

### Response

#### Success Response
- Status Code: 200
```json
{
  "id": "comment_1",
  "postId": "post_1",
  "author": {
    "name": "John Doe",
    "profileImage": "/images/avatars/john.png",
    "isVerified": false,
    "handle": "@johndoe",
    "platform": "facebook",
    "profileUrl": "https://facebook.com/johndoe"
  },
  "content": "Great post! I love how you highlighted the synergy between data and creativity.",
  "timeAgo": "2d",
  "timestamp": "2023-05-25T14:30:00Z",
  "likes": 12,
  "isLiked": false,
  "isExternal": true,
  "externalAccountName": "cliniktsolutions",
  "platform": "facebook",
  "status": "pending",
  "assignedTo": null,
  "repliesCount": 1,
  "parentCommentId": null,
  "sentiment": "positive",
  "tags": ["question", "feedback"],
  "history": [
    {
      "action": "created",
      "timestamp": "2023-05-25T14:30:00Z"
    },
    {
      "action": "liked",
      "timestamp": "2023-05-25T15:45:00Z",
      "count": 12
    }
  ]
}
```

### Error Responses
- Status Code: 404
```json
{
  "error": "Not Found",
  "code": "COMMENT_NOT_FOUND",
  "details": ["The specified comment does not exist"]
}
```

## Create Comment (Reply)

Creates a new comment or reply on a post or to another comment.

### Endpoint

`POST /api/engage/comments`

### Authentication

Required JWT token in Authorization header.

### Request Parameters

#### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| postId | string | Yes | ID of the post to comment on |
| content | string | Yes | The comment text content |
| parentCommentId | string | No | ID of the parent comment (if replying to a comment) |
| mentions | array of strings | No | User handles mentioned in the comment |

### Response

#### Success Response
- Status Code: 201
```json
{
  "id": "comment_new123",
  "postId": "post_1",
  "author": {
    "name": "AIMDek Technologies",
    "profileImage": "/images/page2/aimdek-logo.png",
    "isVerified": true,
    "handle": "@aimdektech"
  },
  "content": "Thanks for your feedback! We'll be sharing more case studies next week.",
  "timeAgo": "just now",
  "timestamp": "2023-05-27T16:30:00Z",
  "likes": 0,
  "isLiked": false,
  "isExternal": false,
  "platform": "facebook",
  "status": "resolved",
  "parentCommentId": "comment_2",
  "message": "Comment posted successfully"
}
```

#### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "code": "VALIDATION_ERROR",
  "details": ["Comment content cannot be empty"]
}
```

## Delete Comment

Deletes a comment created by the authenticated user.

### Endpoint

`DELETE /api/engage/comments/{commentId}`

### Authentication

Required JWT token in Authorization header.

### Request Parameters

#### Path Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| commentId | string | Yes | ID of the comment to delete |

### Response

#### Success Response
- Status Code: 200
```json
{
  "success": true,
  "message": "Comment deleted successfully",
  "id": "comment_123"
}
```

#### Error Responses
- Status Code: 403
```json
{
  "error": "Forbidden",
  "code": "DELETE_NOT_ALLOWED",
  "details": ["You can only delete your own comments"]
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "code": "COMMENT_NOT_FOUND",
  "details": ["The specified comment does not exist"]
}
```

## Update Comment Status

Updates the status of a comment (e.g., marking as resolved).

### Endpoint

`PUT /api/engage/comments/{commentId}/status`

### Authentication

Required JWT token in Authorization header.

### Request Parameters

#### Path Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| commentId | string | Yes | ID of the comment to update |

#### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| status | string | Yes | New status ('pending', 'resolved', 'spam') |
| note | string | No | Optional note about status change |

### Response

#### Success Response
- Status Code: 200
```json
{
  "id": "comment_1",
  "status": "resolved",
  "updatedAt": "2023-05-27T16:40:00Z",
  "message": "Comment status updated successfully"
}
```

#### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "code": "INVALID_STATUS",
  "details": ["Status must be one of: pending, resolved, spam"]
}
```

## Like Comment

Likes or unlikes a comment.

### Endpoint

`POST /api/engage/comments/{commentId}/like`

### Authentication

Required JWT token in Authorization header.

### Request Parameters

#### Path Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| commentId | string | Yes | ID of the comment to like/unlike |

#### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| action | string | Yes | Either 'like' or 'unlike' |

### Response

#### Success Response
- Status Code: 200
```json
{
  "id": "comment_1",
  "isLiked": true,
  "likeCount": 13,
  "message": "Comment liked successfully"
}
```

#### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "code": "INVALID_ACTION",
  "details": ["Action must be either 'like' or 'unlike'"]
}
```

## Assign Comment

Assigns a comment to a team member for handling.

### Endpoint

`POST /api/engage/comments/{commentId}/assign`

### Authentication

Required JWT token in Authorization header.

### Request Parameters

#### Path Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| commentId | string | Yes | ID of the comment to assign |

#### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| userId | string | Yes/No | ID of the user to assign to (null to unassign) |

### Response

#### Success Response
- Status Code: 200
```json
{
  "id": "comment_1",
  "assignedTo": {
    "id": "user_456",
    "name": "Sarah Johnson",
    "avatar": "/images/avatars/sarah.png"
  },
  "message": "Comment assigned successfully"
}
```

#### Error Responses
- Status Code: 404
```json
{
  "error": "Not Found",
  "code": "USER_NOT_FOUND",
  "details": ["The specified user does not exist"]
}
```

## Example Usage

```typescript
// Get comments for a post
const getPostComments = async (postId) => {
  try {
    const response = await fetch(`/api/engage/comments?postId=${postId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch comments');
    
    const data = await response.json();
    return data.data; // Array of comments
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Reply to a comment
const replyToComment = async (postId, parentCommentId, content) => {
  try {
    const response = await fetch('/api/engage/comments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postId,
        parentCommentId,
        content
      })
    });
    
    if (!response.ok) throw new Error('Failed to post reply');
    
    return await response.json();
  } catch (error) {
    console.error('Error posting reply:', error);
    throw error;
  }
};

// Mark a comment as complete
const markCommentAsComplete = async (commentId) => {
  try {
    const response = await fetch(`/api/engage/comments/${commentId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'resolved'
      })
    });
    
    if (!response.ok) throw new Error('Failed to update comment status');
    
    return await response.json();
  } catch (error) {
    console.error('Error updating comment status:', error);
    throw error;
  }
};
```

## Notes

- Comments from external users cannot be edited or deleted through this API
- Comment status changes are only visible internally, not to the public
- Some platforms may have restrictions on comment operations (e.g., Facebook limits how often you can post comments)
- Sentiment analysis is performed automatically on all comments
- The API supports mentions with the @ symbol followed by a username 