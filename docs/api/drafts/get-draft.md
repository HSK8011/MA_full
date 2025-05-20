# Get Draft Post

## Overview
Retrieves a specific post with draft status by its ID. This endpoint returns the complete details of a single draft post.

## Endpoint
`GET /api/posts/:id`

## Authentication
Requires valid JWT token.

## Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token |

### Path Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| id | string | Yes | Unique identifier of the post |

## Response
### Success Response
- Status Code: 200
```json
{
  "id": "post_123456",
  "content": "Data and Creativity ❤️ The dynamic duo that your marketing strategy needs.",
  "status": "draft",
  "mediaUrls": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "mediaType": "carousel",
  "platforms": ["twitter", "linkedin", "facebook"],
  "accountIds": ["acc_1", "acc_2", "acc_3"],
  "link": "https://example.com/blog/marketing-strategy",
  "createdAt": "2023-08-20T15:30:00Z",
  "updatedAt": "2023-08-21T10:15:00Z",
  "userId": "user_789",
  "teamId": "team_123",
  "draftNotes": "Ideas for Q3 marketing campaign",
  "draftLastModifiedAt": "2023-08-21T10:15:00Z",
  "tags": ["marketing", "strategy", "q3"],
  "variations": {
    "twitter": {
      "content": "Data + Creativity = Marketing Success! 📊❤️🎨 #MarketingStrategy"
    },
    "linkedin": {
      "content": "Data and Creativity: The dynamic duo that your marketing strategy needs. Discover how they go hand-in-hand when it comes to campaign success."
    }
  },
  "utmParameters": {
    "source": "social",
    "medium": "organic",
    "campaign": "q3_strategy"
  }
}
```

### Error Responses
- Status Code: 404
```json
{
  "error": "Not Found",
  "message": "Post not found"
}
```

- Status Code: 401
```json
{
  "error": "Unauthorized",
  "message": "Valid authentication required"
}
```

- Status Code: 403
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this post"
}
```

## Example Usage
```typescript
// Example API call
const getDraft = async (postId) => {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    if (response.status === 404) {
      throw new Error('Post not found');
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to retrieve post');
    }
    
    const post = await response.json();
    
    // Verify this is a draft post
    if (post.status !== 'draft') {
      throw new Error('Retrieved post is not a draft');
    }
    
    return post;
  } catch (error) {
    console.error('Error retrieving draft post:', error);
    throw error;
  }
};
```

## Notes
1. This endpoint is part of the unified post API and retrieves posts of any status
2. The client should verify the returned post has status="draft" for draft-specific handling
3. Users can only access their own posts or those shared with their team
4. The endpoint returns the complete post data, including all platform-specific variations
5. Media URLs in the response are already pre-signed for immediate display
6. The endpoint can be used to populate edit forms when modifying an existing draft
7. For efficiency, you can optionally use `/api/posts/:id?status=draft` to get a 404 if the post exists but isn't a draft 