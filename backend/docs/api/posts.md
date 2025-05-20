# Posts API Documentation

This document outlines the API endpoints for managing social media posts in the Marketing Automation platform.

## Delivered Posts

### Get Delivered Posts

Retrieves a paginated list of delivered (published) posts across all social media platforms.

```http
GET /api/posts/delivered
```

#### Query Parameters

| Parameter    | Type    | Description                                                | Required |
|-------------|---------|------------------------------------------------------------| -------- |
| page        | number  | Page number for pagination (default: 1)                    | No       |
| limit       | number  | Number of items per page (default: 10)                     | No       |
| platform    | string  | Filter by social media platform                            | No       |
| integrationId| string | Filter by specific social media account                    | No       |
| startDate   | string  | Filter posts published after this date (ISO 8601)         | No       |
| endDate     | string  | Filter posts published before this date (ISO 8601)        | No       |
| searchTerm  | string  | Search in post content and tags                           | No       |

#### Headers

| Name          | Type   | Description                                          | Required |
|---------------|--------|------------------------------------------------------| -------- |
| Authorization | string | Bearer token for authentication (e.g., Bearer {jwt})  | Yes      |

#### Response

```typescript
{
  posts: {
    _id: string;
    integrationId: string;
    userId: string;
    platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'pinterest';
    postId: string;
    content: string;
    mediaUrls: string[];
    type: 'text' | 'image' | 'video' | 'carousel' | 'link';
    status: 'published';
    publishedAt: string;
    metrics: {
      likes: number;
      comments: number;
      shares: number;
      impressions: number;
      reach: number;
      engagement: number;
      lastUpdated: string;
    };
    platformSpecific: Record<string, any>;
    link?: string;
    tags: string[];
    location?: {
      name: string;
      latitude: number;
      longitude: number;
    };
    approvalStatus: 'approved' | 'rejected' | 'pending';
    approvedBy?: string;
    approvedAt?: string;
    postHistory: Array<{
      version: number;
      content: string;
      mediaUrls: string[];
      updatedAt: string;
      updatedBy: string;
    }>;
    integration: {
      _id: string;
      platform: string;
      username: string;
      displayName: string;
      profileImageUrl: string;
    };
  }[];
  total: number;
  page: number;
  totalPages: number;
}
```

#### Example Request

```bash
curl -X GET "http://localhost:5000/api/posts/delivered?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

#### Example Response

```json
{
  "posts": [
    {
      "_id": "682ad9fc96be10d67c3d9df3",
      "integrationId": "682ad9fc96be10d67c3d9dc7",
      "userId": "68248478e90c40aa4a290bc6",
      "platform": "linkedin",
      "postId": "post_1747638780769_1",
      "content": "Proud to announce the launch of our new marketing automation platform...",
      "mediaUrls": ["https://example.com/videos/linkedin-demo.mp4"],
      "type": "video",
      "status": "published",
      "publishedAt": "2025-05-15T09:30:00.000Z",
      "metrics": {
        "likes": 245,
        "comments": 32,
        "shares": 28,
        "impressions": 2890,
        "reach": 2312,
        "engagement": 0.105,
        "lastUpdated": "2025-05-19T07:13:00.769Z"
      },
      "platformSpecific": {
        "companyPage": false
      },
      "tags": ["marketing", "automation", "launch"],
      "approvalStatus": "approved",
      "approvedAt": "2025-05-15T09:00:00.000Z",
      "approvedBy": "68248478e90c40aa4a290bc6",
      "integration": {
        "_id": "682ad9fc96be10d67c3d9dc7",
        "platform": "linkedin",
        "username": "marketing-automation",
        "displayName": "Marketing Automation",
        "profileImageUrl": "https://via.placeholder.com/150?text=LinkedIn"
      }
    }
  ],
  "total": 22,
  "page": 1,
  "totalPages": 3
}
```

## Frontend Integration

### PostService

The frontend uses a dedicated `postService` to interact with the Posts API. Here's how to use it:

```typescript
// src/services/postService.ts

interface GetDeliveredPostsParams {
  page?: number;
  limit?: number;
  platform?: string;
  integrationId?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

async function getDeliveredPosts(params: GetDeliveredPostsParams) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.platform) queryParams.append('platform', params.platform);
  if (params.integrationId) queryParams.append('integrationId', params.integrationId);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);

  const response = await axios.get(`${API_URL}/posts/delivered?${queryParams}`);
  return response.data;
}
```

### DeliveredPosts Component

The `DeliveredPosts` component in the frontend uses this service to display the delivered posts:

```typescript
// src/components/organisms/Publish/DeliveredPosts.tsx

interface DeliveredPostsProps {
  onPostSelect?: (post: Post) => void;
  selectedIntegrationId?: string;
}

function DeliveredPosts({ onPostSelect, selectedIntegrationId }: DeliveredPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postService.getDeliveredPosts({
          page,
          limit: 10,
          integrationId: selectedIntegrationId
        });
        setPosts(response.posts);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError('Failed to fetch delivered posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, selectedIntegrationId]);

  // ... rest of the component implementation
}
```

### Error Handling

Both the frontend and backend implement comprehensive error handling:

- Backend errors are properly formatted and include appropriate HTTP status codes
- Frontend catches and displays errors in a user-friendly way
- Network errors are handled gracefully with retries when appropriate
- Authentication errors redirect to the login page
- Rate limiting and other API constraints are properly communicated to the user

### Security

The API implements several security measures:

1. JWT-based authentication
2. Request validation and sanitization
3. CORS configuration for allowed origins
4. Rate limiting for API endpoints
5. Input validation for all parameters
6. XSS protection through proper content escaping
