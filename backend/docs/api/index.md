# Marketing Automation API Documentation

Welcome to the Marketing Automation API documentation. This documentation provides comprehensive information about the available API endpoints, their usage, and integration details.

## Table of Contents

1. [Posts](./posts.md)
   - Delivered Posts
   - Queued Posts
   - Draft Posts
   - Pending Approval Posts
   - Post Actions (Schedule, Approve, Reject)

2. [Integrations](./integrations.md)
   - Social Media Accounts
   - Platform Connections
   - Account Management

3. [Analytics](./analytics.md)
   - Performance Metrics
   - Engagement Stats
   - Reports

4. [Authentication](./auth.md)
   - Login
   - Registration
   - Password Reset

5. [Settings](./settings.md)
   - Queue Settings
   - User Preferences
   - Notifications

## Getting Started

### Base URL
```
http://localhost:5000/api
```

### Authentication
All API endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Response Format
All responses are in JSON format and include:
- HTTP status code
- Response body with data or error message
- Pagination info where applicable

### Error Handling
Error responses follow this format:
```json
{
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

### Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Start the server: `npm run dev`

## API Versioning

Current version: v1
Base URL with version: `/api/v1`

## Support

For API support, please contact:
- Email: api-support@example.com
- Documentation Issues: Create an issue in the GitHub repository
