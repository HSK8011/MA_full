# Engage API Documentation

This directory contains API documentation for the Engage feature of the Marketing Automation Platform. The Engage feature allows users to view and interact with social media posts and comments across their connected accounts.

## API Endpoints Overview

| Endpoint | Description |
|----------|-------------|
| [GET /api/engage/accounts](./accounts.md) | Get all connected social media accounts |
| [GET /api/engage/posts](./posts.md) | Get posts for a specific social media account |
| [GET /api/engage/comments](./comments.md) | Get comments for a specific post |
| [POST /api/engage/comments](./comments.md#create-comment) | Create a new comment or reply |
| [DELETE /api/engage/comments/{id}](./comments.md#delete-comment) | Delete a comment |
| [PUT /api/engage/comments/{id}/status](./comments.md#update-comment-status) | Update comment status (mark as complete) |
| [POST /api/engage/comments/{id}/like](./comments.md#like-comment) | Like a comment |
| [POST /api/engage/comments/{id}/assign](./comments.md#assign-comment) | Assign a comment to a team member |

## Authentication

All API endpoints require authentication using a valid JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Rate Limits

API rate limits are applied to prevent abuse:

- 100 requests per minute for GET operations
- 50 requests per minute for POST/PUT/DELETE operations

## Error Handling

All endpoints use standard HTTP status codes and return JSON error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": ["Additional error details"]
}
```

## Pagination

List endpoints support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `page_size`: Number of items per page (default: 20, max: 100)

Paginated responses include metadata:

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

## Further Documentation

For detailed information about each endpoint, refer to the linked documentation files. 