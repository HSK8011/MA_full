# Create Draft Post

## Overview
Creates a new post with draft status in the system. This API allows users to save content as a draft when they have ideas but aren't ready to schedule or publish.

## Endpoint
`POST /api/posts`

## Authentication
Requires valid JWT token.

## Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token |
| Content-Type | string | Yes | Must be application/json |

### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| content | string | Yes | Main text content of the post |
| status | string | Yes | Must be "draft" for draft posts |
| mediaUrls | string[] | No | Array of URLs to attached media files |
| mediaType | string | No | Type of media (image, video, gif, carousel, none) |
| platforms | string[] | Yes | Array of social platforms to post to (e.g., ["twitter", "linkedin"]) |
| accountIds | string[] | Yes | Array of account IDs to post from |
| link | string | No | URL if post contains a link |
| tags | string[] | No | Tags for internal organization |
| utmParameters | object | No | UTM tracking parameters for links |
| draftNotes | string | No | Optional notes about the draft |
| variations | object | No | Platform-specific content variations |

## Response
### Success Response
- Status Code: 201
```json
{
  "id": "post_123456",
  "content": "Data and Creativity ❤️ The dynamic duo that your marketing strategy needs.",
  "status": "draft",
  "mediaUrls": ["https://example.com/image1.jpg"],
  "mediaType": "image",
  "platforms": ["twitter", "linkedin"],
  "accountIds": ["acc_1", "acc_2"],
  "link": "https://example.com/blog/marketing-strategy",
  "createdAt": "2023-08-20T15:30:00Z",
  "updatedAt": "2023-08-20T15:30:00Z",
  "userId": "user_789",
  "teamId": "team_123",
  "draftNotes": "Ideas for Q3 marketing campaign",
  "draftLastModifiedAt": "2023-08-20T15:30:00Z"
}
```

### Error Responses
- Status Code: 400
```json
{
  "error": "Invalid post data",
  "details": ["Content is required"]
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
  "message": "Insufficient permissions to create posts"
}
```

- Status Code: 413
```json
{
  "error": "Payload Too Large",
  "message": "Content exceeds maximum allowed length"
}
```

## Example Usage
```typescript
// Example API call
const createDraft = async (draftData) => {
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: "Data and Creativity ❤️ The dynamic duo that your marketing strategy needs.",
        status: "draft", // Specify this is a draft
        platforms: ["twitter", "linkedin"],
        accountIds: ["acc_1", "acc_2"],
        mediaUrls: ["https://example.com/image1.jpg"],
        mediaType: "image"
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create draft');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating draft:', error);
    throw error;
  }
};
```

## Notes
1. Drafts are posts with status set to "draft"
2. Posts in draft status are private to the user or team that created them
3. There is no limit to the number of draft posts a user can create
4. Draft content has the same character limitations as published posts
5. Media files must be uploaded separately using the Media Upload API before creating the draft
6. Draft posts are not visible to account followers or the public
7. Drafts can be converted to scheduled posts by updating their status to "queued" and setting a scheduledTime 