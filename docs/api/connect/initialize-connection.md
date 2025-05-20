# Initialize Connection API

## Overview
Initiates the OAuth authorization flow for connecting a new social media account. This endpoint generates the authorization URL that the user should be redirected to in order to grant permissions to the application.

## Endpoint
`POST /api/connect/initialize-connection`

## Authentication
Requires valid JWT token in the Authorization header.

## Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token in format: `Bearer <token>` |
| Content-Type | string | Yes | Must be `application/json` |

### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| platform | string | Yes | Platform identifier (e.g., 'twitter', 'linkedin', 'facebook') |
| redirectUri | string | No | Custom redirect URI (must be allowlisted). If not provided, the default configured redirect URI will be used |
| extraScopes | string[] | No | Additional OAuth scopes to request beyond the default set |

Example request body:
```json
{
  "platform": "twitter",
  "redirectUri": "https://app.example.com/auth/callback"
}
```

## Response
### Success Response
- Status Code: 200
```json
{
  "authorizationUrl": "https://twitter.com/i/oauth2/authorize?client_id=ABC123&response_type=code&scope=tweet.read%20tweet.write&redirect_uri=https%3A%2F%2Fapp.example.com%2Fauth%2Fcallback&state=xyz789",
  "state": "xyz789",
  "expiresAt": "2023-07-15T15:30:45Z"
}
```

### Error Responses
- Status Code: 400
```json
{
  "error": "InvalidRequest",
  "message": "Invalid platform specified"
}
```

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
  "error": "PlanLimitExceeded",
  "message": "Your plan allows a maximum of 3 connected accounts. Please upgrade to add more accounts.",
  "details": {
    "currentConnections": 3,
    "planLimit": 3,
    "upgradePath": "/billing/plans"
  }
}
```

- Status Code: 429
```json
{
  "error": "RateLimitExceeded",
  "message": "Too many connection attempts, please try again later",
  "details": {
    "retryAfter": 300 // seconds
  }
}
```

## Example Usage
```typescript
// Example API call using fetch
const initializeConnection = async (platform: string) => {
  try {
    const response = await fetch('/api/connect/initialize-connection', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        platform,
        redirectUri: window.location.origin + '/connect/callback'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to initialize connection');
    }
    
    const data = await response.json();
    
    // Redirect user to the authorization URL
    window.location.href = data.authorizationUrl;
  } catch (error) {
    console.error('Error initializing connection:', error);
    throw error;
  }
};
```

## Notes
- The `state` parameter in the response is used for CSRF protection. It must be stored securely (typically in session storage) and verified when the OAuth provider redirects back to your application.
- The authorization URL expires after a certain period (typically 10 minutes) as indicated by the `expiresAt` field.
- After the user grants permissions on the OAuth provider's site, they will be redirected back to the specified redirect URI with a `code` parameter that should be passed to the [Complete Connection](/api/connect/complete-connection.md) endpoint.
- For security reasons, the `redirectUri` parameter must match one of the pre-configured redirect URIs registered with the OAuth provider.
- Different platforms require different OAuth scopes. The default scopes for each platform are configured in the system, but you can request additional scopes using the `extraScopes` parameter if needed for advanced features.

## Platform-Specific Considerations

### Twitter
- Twitter OAuth 2.0 requires the `offline.access` scope for refresh tokens
- Twitter has a rate limit of 450 requests per 15-minute window for OAuth token requests

### LinkedIn
- LinkedIn OAuth uses different scopes for personal profiles vs. company pages
- For company pages, ensure the authenticating user has admin rights to the page

### Facebook
- Facebook requires different permissions for different page actions
- For posting to groups, the `publish_to_groups` permission is needed
- Instagram Business accounts are connected through Facebook authentication 