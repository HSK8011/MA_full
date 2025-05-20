# Account Switching Functionality

## Overview
The Analyze page allows users to switch between multiple social media accounts to view metrics and analytics. A single user can have multiple accounts across different social media platforms or multiple accounts on the same platform.

## Technical Implementation

### Account Selection Flow
1. When the Analyze page loads, it fetches all accounts associated with the current user
2. The accounts are displayed in a dropdown selector in the top section of the page
3. When a user selects a different account, the UI updates to show data for the selected account
4. The time range selection persists across account switches

### API Details

#### Fetch User's Accounts

**Endpoint:** `GET /api/user/accounts`

**Authentication:** Requires valid JWT token

**Headers:**
| Name | Type | Required | Description |
|---|---|----|----|
| Authorization | string | Yes | Bearer {token} |

**Response:**
```json
{
  "accounts": [
    {
      "id": "acc_123456",
      "name": "AIMDek Technologies",
      "platform": "twitter",
      "profileImage": "/images/page2/aimdek-logo.png",
      "handle": "@aimdektech",
      "isVerified": true,
      "metrics": {
        "followers": 20000,
        "following": 500,
        "posts": 1500
      }
    },
    {
      "id": "acc_789012",
      "name": "AIMDek Marketing",
      "platform": "twitter",
      "profileImage": "/images/page2/aimdek-marketing.png",
      "handle": "@aimdekmarketing",
      "isVerified": false,
      "metrics": {
        "followers": 5000,
        "following": 200,
        "posts": 750
      }
    },
    {
      "id": "acc_345678",
      "name": "AIMDek Technologies",
      "platform": "facebook",
      "profileImage": "/images/page2/aimdek-fb.png",
      "pageId": "aimdekofficialpage",
      "isVerified": true,
      "metrics": {
        "likes": 15000,
        "followers": 14000
      }
    }
  ]
}
```

#### Switch Account

When a user selects a different account from the dropdown, the client application:

1. Updates the active account ID in local state
2. Calls the analytics endpoint with the new account ID
3. Updates the UI with the new data
4. Maintains the current time range selection

**Sample Request:**
```javascript
// Frontend implementation
const handleAccountChange = async (accountId) => {
  setSelectedAccount(accountId);
  
  // Fetch analytics for the selected account with current time range
  const response = await fetch(`/api/analytics/${accountId}?timeRange=${timeRange}`);
  const data = await response.json();
  
  // Update analytics data in state
  setAnalyticsData(data);
};
```

## Multi-Account Management

### Account Types
1. **Personal accounts**: User's own social media accounts
2. **Business accounts**: Company social media accounts
3. **Client accounts**: Accounts managed on behalf of clients

### Permissions
- Users can have different permission levels for different accounts:
  - Admin: Full access to view and manage
  - Analyst: View-only access to analytics
  - Contributor: Can view analytics and create content

### Cross-Platform Analytics
- When a user has accounts across multiple platforms (Twitter, Facebook, Instagram, etc.), the Analyze page can provide:
  - Platform-specific metrics
  - Cross-platform comparisons
  - Aggregated engagement metrics

## Error Handling

### Common Errors

#### Account Access Denied
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access this account",
  "code": "ACCOUNT_ACCESS_DENIED"
}
```

#### Account Suspended
```json
{
  "error": "Unavailable",
  "message": "This account is currently suspended by the platform",
  "code": "ACCOUNT_SUSPENDED"
}
```

#### Account Connection Expired
```json
{
  "error": "Authorization Required",
  "message": "Social media authorization has expired. Please reconnect this account.",
  "code": "AUTH_EXPIRED",
  "reconnectUrl": "/settings/accounts/reconnect/acc_123456"
}
```

## User Experience Considerations

1. The account selector maintains state across page navigation
2. Recently viewed accounts appear at the top of the dropdown
3. Accounts are grouped by platform in the selector
4. Visual indicators show account status (connected, expired, limited)
5. Quick access to account management from the selector 