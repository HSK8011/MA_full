# List Draft Posts

## Overview
Retrieves a list of posts with draft status for the current user or team. This endpoint supports filtering, pagination, and sorting options.

## Endpoint
`GET /api/posts?status=draft`

## Authentication
Requires valid JWT token.

## Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token |

### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| status | string | Yes | Must be "draft" to retrieve draft posts |
| accountId | string | No | Filter drafts by specific social account ID |
| platformType | string | No | Filter drafts by platform type (twitter, facebook, etc.) |
| page | number | No | Page number for pagination (default: 1) |
| limit | number | No | Number of drafts per page (default: 20, max: 100) |
| sort | string | No | Sort field (created_at, updated_at) |
| order | string | No | Sort order (asc, desc) (default: desc) |
| search | string | No | Search term to filter drafts by content |
| includeTeam | boolean | No | Include team drafts if user belongs to a team (default: true) |

## Response
### Success Response
- Status Code: 200
```json
{
  "posts": [
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
    },
    {
      "id": "post_789012",
      "content": "New product launch coming soon! Stay tuned for our biggest announcement yet.",
      "status": "draft",
      "mediaUrls": [],
      "mediaType": "none",
      "platforms": ["facebook", "instagram"],
      "accountIds": ["acc_3"],
      "createdAt": "2023-08-15T10:45:00Z",
      "updatedAt": "2023-08-15T10:45:00Z",
      "userId": "user_789",
      "teamId": "team_123",
      "draftLastModifiedAt": "2023-08-15T10:45:00Z"
    }
  ],
  "pagination": {
    "total": 24,
    "page": 1,
    "limit": 20,
    "pages": 2
  }
}
```

### Error Responses
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
  "message": "Insufficient permissions to access posts"
}
```

- Status Code: 400
```json
{
  "error": "Invalid parameters",
  "details": ["Invalid sort field specified"]
}
```

## Example Usage
```typescript
// Example API call
const listDrafts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Always include status=draft to filter for draft posts
    queryParams.append('status', 'draft');
    
    // Add any additional filters to the query parameters
    if (filters.accountId) queryParams.append('accountId', filters.accountId);
    if (filters.platformType) queryParams.append('platformType', filters.platformType);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.search) queryParams.append('search', filters.search);
    
    const response = await fetch(`/api/posts?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to retrieve drafts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error retrieving drafts:', error);
    throw error;
  }
};
```

## Notes
1. This endpoint uses the unified post schema with filtering by status=draft
2. Results are paginated to optimize performance
3. By default, posts are sorted by creation date (newest first)
4. The user can only access their own posts or those shared with their team
5. Search functionality performs partial matching on post content
6. Empty result sets return an empty array, not an error
7. Response includes pagination metadata for implementing pagination controls 