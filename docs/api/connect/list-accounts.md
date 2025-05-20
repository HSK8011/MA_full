# List Connected Accounts API

## Overview
Returns a list of all social media accounts connected to the authenticated user's profile. This endpoint provides information about account status, platform type, and basic details.

## Endpoint
`GET /api/connect/accounts`

## Authentication
Requires valid JWT token in the Authorization header.

## Request Parameters
### Headers
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | JWT token in format: `Bearer <token>` |

### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| status | string | No | Filter by account status ('connected', 'disconnected', 'all'). Default: 'all' |
| platform | string | No | Filter by platform ('twitter', 'facebook', 'linkedin', etc.) |
| limit | number | No | Maximum number of accounts to return. Default: 50, Max: 100 |
| offset | number | No | Number of accounts to skip. Default: 0 |

### Body Parameters
None required for this endpoint.

## Response
### Success Response
- Status Code: 200
```json
{
  "accounts": [
    {
      "id": "acc_1234567890",
      "name": "aimdektech",
      "type": "Twitter Profile",
      "platform": "twitter",
      "status": "connected",
      "icon": "/images/page2/twitter-icon.png",
      "lastSyncedAt": "2023-06-15T10:30:45Z"
    },
    {
      "id": "acc_0987654321",
      "name": "aimdek-technologies",
      "type": "LinkedIn Page",
      "platform": "linkedin",
      "status": "connected",
      "icon": "/images/page2/linkedin-icon.png",
      "lastSyncedAt": "2023-06-14T15:22:10Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 50,
    "offset": 0,
    "hasMore": false
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
  "message": "Insufficient permissions to access accounts"
}
```

- Status Code: 500
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred while retrieving accounts"
}
```

## Example Usage
```typescript
// Example API call using fetch
const getConnectedAccounts = async () => {
  try {
    const response = await fetch('/api/connect/accounts?status=connected', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch connected accounts');
    }
    
    const data = await response.json();
    return data.accounts;
  } catch (error) {
    console.error('Error fetching connected accounts:', error);
    throw error;
  }
};
```

## Notes
- This endpoint returns a summarized view of the connected accounts. For detailed information about a specific account, use the [Get Account Details](/api/connect/get-account.md) endpoint.
- Account information is cached for 5 minutes to improve performance.
- Rate limiting applies to this endpoint (see [Connect API overview](/api/connect/README.md) for details). 