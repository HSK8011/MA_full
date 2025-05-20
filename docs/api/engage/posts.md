# Social Media Posts API

This API allows users to retrieve and manage social media posts from their connected accounts.

## Get Posts for an Account

Retrieves posts from a specific social media account.

### Endpoint

`GET /api/engage/posts`

### Authentication

Required JWT token in Authorization header.

### Request Parameters

#### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| accountId | string | Yes | ID of the account to get posts from |
| dateFrom | ISO8601 Date | No | Filter posts from this date |
| dateTo | ISO8601 Date | No | Filter posts until this date |
| type | string | No | Filter by post type ('image', 'video', 'text', 'link') |
| keyword | string | No | Search keyword in post content |
| hasComments | boolean | No | Filter posts with comments (true) or without (false) |
| engagementMin | number | No | Minimum engagement rate |
| status | string | No | Filter by post status ('published', 'scheduled', 'draft') |
| page | integer | No | Page number for pagination (default: 1) |
| page_size | integer | No | Number of items per page (default: 20, max: 100) |

### Response

#### Success Response
- Status Code: 200
```json
{
  "data": [
    {
      "id": "post_1",
      "content": "Data and Creativity 🧡 The dynamic duo that your marketing strategy needs. Discover how they go hand-in-hand when it comes to campaign success.",
      "date": "2023-05-27T15:53:00Z",
      "formattedDate": "Mon, May 27, 2023 3:53 pm",
      "account": {
        "id": "acc_123456",
        "name": "AIMDek Technologies",
        "profileImage": "/images/page2/aimdek-logo.png",
        "handle": "@aimdektech"
      },
      "engagement": {
        "likes": 120,
        "comments": 45,
        "shares": 67
      },
      "isExternal": false,
      "mediaUrls": [
        "/images/posts/marketing-strategy.jpg"
      ],
      "type": "image",
      "status": "published",
      "commentCount": 45,
      "postUrl": "https://facebook.com/aimdektech/posts/123456789"
    },
    {
      "id": "post_2",
      "content": "Discover how they go hand-in-hand when it comes to campaign success. Data and Creativity 🧡 The dynamic duo that your marketing strategy needs.",
      "date": "2023-05-26T13:27:00Z",
      "formattedDate": "Sun, May 26, 2023 1:27 pm",
      "account": {
        "id": "acc_123456",
        "name": "AIMDek Technologies",
        "profileImage": "/images/page2/aimdek-logo.png",
        "handle": "@aimdektech"
      },
      "engagement": {
        "likes": 95,
        "comments": 38,
        "shares": 52
      },
      "isExternal": false,
      "mediaUrls": [],
      "type": "text",
      "status": "published",
      "commentCount": 38,
      "postUrl": "https://facebook.com/aimdektech/posts/987654321"
    }
  ],
  "meta": {
    "total": 124,
    "page": 1,
    "page_size": 20,
    "total_pages": 7
  }
}
```

### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "code": "INVALID_ACCOUNT_ID",
  "details": ["Account ID is required"]
}
```

- Status Code: 404
```json
{
  "error": "Not Found",
  "code": "ACCOUNT_NOT_FOUND",
  "details": ["The specified account does not exist"]
}
```

## Get Post Details

Retrieves detailed information about a specific post.

### Endpoint

`GET /api/engage/posts/{postId}`

### Authentication

Required JWT token in Authorization header.

### Request Parameters

#### Path Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| postId | string | Yes | ID of the post to retrieve |

### Response

#### Success Response
- Status Code: 200
```json
{
  "id": "post_1",
  "content": "Data and Creativity 🧡 The dynamic duo that your marketing strategy needs. Discover how they go hand-in-hand when it comes to campaign success.",
  "date": "2023-05-27T15:53:00Z",
  "formattedDate": "Mon, May 27, 2023 3:53 pm",
  "account": {
    "id": "acc_123456",
    "name": "AIMDek Technologies",
    "profileImage": "/images/page2/aimdek-logo.png",
    "handle": "@aimdektech"
  },
  "engagement": {
    "likes": 120,
    "comments": 45,
    "shares": 67,
    "reach": 3500,
    "impressions": 5200,
    "engagementRate": 4.2
  },
  "isExternal": false,
  "mediaUrls": [
    "/images/posts/marketing-strategy.jpg"
  ],
  "type": "image",
  "status": "published",
  "commentCount": 45,
  "postUrl": "https://facebook.com/aimdektech/posts/123456789",
  "hashtags": ["#marketing", "#data", "#creativity"],
  "mentions": ["@marketingexperts"],
  "platform": "facebook",
  "locationName": "San Francisco, CA",
  "insights": {
    "demographicData": {
      "ageGroups": {
        "18-24": 15,
        "25-34": 45,
        "35-44": 25,
        "45-54": 10,
        "55+": 5
      },
      "genders": {
        "male": 55,
        "female": 42,
        "other": 3
      },
      "topLocations": [
        {"name": "United States", "percentage": 65},
        {"name": "Canada", "percentage": 15},
        {"name": "United Kingdom", "percentage": 10}
      ]
    }
  },
  "publishedByUser": {
    "id": "user_123",
    "name": "John Smith"
  }
}
```

### Error Responses
- Status Code: 404
```json
{
  "error": "Not Found",
  "code": "POST_NOT_FOUND",
  "details": ["The specified post does not exist"]
}
```

## Create a New Post

Creates a new post on the specified social media account.

### Endpoint

`POST /api/engage/posts`

### Authentication

Required JWT token in Authorization header.

### Request Parameters

#### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| accountId | string | Yes | ID of the account to post to |
| content | string | Yes | The post text content |
| media | array | No | Array of media objects (images, videos) |
| scheduledTime | ISO8601 Date | No | When to publish the post (if not provided, post immediately) |
| locationName | string | No | Location tag for the post |

### Response

#### Success Response
- Status Code: 201
```json
{
  "id": "post_123new",
  "content": "Just launched our new feature!",
  "status": "scheduled",
  "scheduledTime": "2023-06-15T10:00:00Z",
  "accountId": "acc_123456",
  "message": "Post scheduled successfully"
}
```

#### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "code": "VALIDATION_ERROR",
  "details": ["Content must be between 1 and 280 characters for Twitter"]
}
```

## Example Usage

```typescript
// Get posts for an account
const getAccountPosts = async (accountId) => {
  try {
    const response = await fetch(`/api/engage/posts?accountId=${accountId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch posts');
    
    const data = await response.json();
    return data.data; // Array of posts
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Get single post details
const getPostDetails = async (postId) => {
  try {
    const response = await fetch(`/api/engage/posts/${postId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch post details');
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching post details:', error);
    throw error;
  }
};

// Create a new post
const createPost = async (postData) => {
  try {
    const response = await fetch('/api/engage/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) throw new Error('Failed to create post');
    
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};
```

## Notes

- Different social media platforms have different character limits and supported media types
- Scheduled posts may be rejected by the platform if they violate the platform's policies
- Real-time engagement metrics may differ slightly from platform analytics
- Post metrics are refreshed every 15 minutes 