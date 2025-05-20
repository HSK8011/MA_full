# Social Media Accounts API

This API allows users to retrieve and manage their connected social media accounts.

## Get Connected Social Media Accounts

Retrieves all connected social media accounts for the authenticated user.

### Endpoint

`GET /api/engage/accounts`

### Authentication

Required JWT token in Authorization header.

### Request Parameters

#### Query Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| platform | string | No | Filter accounts by platform (e.g., 'facebook', 'twitter', 'instagram') |
| status | string | No | Filter accounts by status ('active', 'pending', 'error') |
| page | integer | No | Page number for pagination (default: 1) |
| page_size | integer | No | Number of items per page (default: 20, max: 100) |

### Response

#### Success Response
- Status Code: 200
```json
{
  "data": [
    {
      "id": "acc_123456",
      "name": "AIMDek Technologies",
      "handle": "@aimdektech",
      "profileImage": "/images/page2/aimdek-logo.png",
      "platform": "facebook",
      "status": "active",
      "lastSynced": "2023-05-20T15:30:00Z",
      "metrics": {
        "followers": 5230,
        "engagement": 3.8,
        "posts": 124
      }
    },
    {
      "id": "acc_789012",
      "name": "AIMDek Marketing",
      "handle": "@aimdekmarketing",
      "profileImage": "/images/accounts/aimdek-marketing.png",
      "platform": "twitter",
      "status": "active",
      "lastSynced": "2023-05-20T15:45:00Z",
      "metrics": {
        "followers": 3150,
        "engagement": 2.5,
        "posts": 89
      }
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "page_size": 20,
    "total_pages": 1
  }
}
```

### Error Responses
- Status Code: 401
```json
{
  "error": "Unauthorized",
  "code": "AUTH_ERROR",
  "details": ["Invalid or expired authentication token"]
}
```

- Status Code: 403
```json
{
  "error": "Forbidden",
  "code": "ACCESS_DENIED",
  "details": ["You don't have permission to access these accounts"]
}
```

## Connect New Social Media Account

Initiates the OAuth flow to connect a new social media account.

### Endpoint

`POST /api/engage/accounts/connect`

### Authentication

Required JWT token in Authorization header.

### Request Parameters

#### Body Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| platform | string | Yes | The social media platform to connect ('facebook', 'twitter', 'instagram', 'linkedin') |
| redirectUrl | string | Yes | URL to redirect to after authorization |

### Response

#### Success Response
- Status Code: 200
```json
{
  "authUrl": "https://platform.com/oauth/authorize?client_id=xxx&redirect_uri=xxx&response_type=code",
  "state": "random-state-token-for-security"
}
```

#### Error Responses
- Status Code: 400
```json
{
  "error": "Bad Request",
  "code": "INVALID_PLATFORM",
  "details": ["Unsupported platform specified"]
}
```

## Disconnect Social Media Account

Removes a connection to a social media account.

### Endpoint

`DELETE /api/engage/accounts/{accountId}`

### Authentication

Required JWT token in Authorization header.

### Request Parameters

#### Path Parameters
| Name | Type | Required | Description |
|---|---|----|----|
| accountId | string | Yes | ID of the account to disconnect |

### Response

#### Success Response
- Status Code: 200
```json
{
  "success": true,
  "message": "Account successfully disconnected"
}
```

#### Error Responses
- Status Code: 404
```json
{
  "error": "Not Found",
  "code": "ACCOUNT_NOT_FOUND",
  "details": ["The specified account does not exist or is not connected to this user"]
}
```

## Example Usage

```typescript
// Get all connected accounts
const getAccounts = async () => {
  try {
    const response = await fetch('/api/engage/accounts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch accounts');
    
    const data = await response.json();
    return data.data; // Array of accounts
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

// Connect a new account
const connectAccount = async (platform) => {
  try {
    const response = await fetch('/api/engage/accounts/connect', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        platform,
        redirectUrl: `${window.location.origin}/settings/accounts/callback`
      })
    });
    
    if (!response.ok) throw new Error('Failed to initiate account connection');
    
    const data = await response.json();
    // Redirect user to the authorization page
    window.location.href = data.authUrl;
  } catch (error) {
    console.error('Error connecting account:', error);
    throw error;
  }
};
```

## Notes

- Accounts must be authenticated via OAuth 2.0 with the respective social media platforms
- Periodically check account status as platforms may revoke access
- Account metrics are updated every 24 hours
- Some platforms may have additional authentication requirements 