# ConnectPage Documentation

## Overview
The ConnectPage serves as the central hub for managing social media accounts connected to the Marketing Automation Tool (MAT). It allows users to view, manage, disconnect, reconnect, and remove their connected social media accounts, providing a comprehensive dashboard for social media channel management.

## File Location
- **Component Path**: `src/pages/Connect.tsx`
- **Related Components**:
  - ConnectContent (`src/components/organisms/Connect/ConnectContent.tsx`)
  - Modal (`src/components/atoms/ui/modal.tsx`)

## Page Structure
```
ConnectPage
├── Header (Navigation + User Menu)
└── Main Content
    └── ConnectContent
        ├── Page Title + Connect New Channel Button
        ├── Search Bar
        ├── Connected Accounts List
        │   └── Account Items (Status + Details + Action Buttons)
        └── Remove Channel Confirmation Modal
```

## Component Details

### ConnectContent Component
- **Purpose**: Main content area for managing social media connections
- **Key Features**:
  - Account management interface
  - Connection status indicators
  - Action buttons for each connected account
- **Key Sections**:
  1. **Header Section**
     - Title: "Connect to Social Network"
     - Connect New Channel button (links to `/connect/new`)
  
  2. **Search Bar**
     - Allows filtering accounts by name or type
     - Real-time filtering as user types
     - Clear search button when search has input
  
  3. **Accounts List**
     - Displays all connected social media accounts
     - Each account shows:
       - Connection status indicator (connected/disconnected)
       - Platform icon and color
       - Account name and platform type
       - Action buttons

  4. **Remove Channel Modal**
     - Confirmation dialog for removing an account
     - Warns user that this action cannot be undone
     - Provides cancel and confirm options

### Social Account Management
- **Connection States**:
  - **Connected**: Account is active and can post/analyze
  - **Disconnected**: Account authorization has expired or been revoked
  
- **Account Actions**:
  - **Disconnect**: Temporarily deactivate an active account
  - **Reconnect**: Reauthorize a disconnected account
  - **Manage Queue Time**: Set posting schedule preferences
  - **Remove Channel**: Permanently delete the account connection

## Data Schema Requirements

### SocialAccount Schema
```typescript
interface SocialAccount {
  id: string;
  name: string;
  type: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'pinterest' | 'instagram';
  status: 'connected' | 'disconnected';
  icon: string;
  userId: string;
  accountId: string;
  accessToken?: string; // Stored only in backend
  refreshToken?: string; // Stored only in backend
  tokenExpiresAt?: Date;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Integration & Data Flow

### Connect API Endpoints

#### List Connected Accounts
- **Method**: GET
- **Path**: `/api/connect/accounts`
- **Query Parameters**:
  - `userId`: User ID (obtained from authentication)
- **Response**:
  ```json
  {
    "accounts": [
      {
        "id": "string",
        "name": "string",
        "type": "string",
        "platform": "string",
        "status": "connected|disconnected",
        "icon": "string"
      }
    ]
  }
  ```

#### Disconnect Account
- **Method**: PUT
- **Path**: `/api/connect/accounts/:accountId/disconnect`
- **Response**:
  ```json
  {
    "success": true,
    "account": {
      "id": "string",
      "status": "disconnected"
    }
  }
  ```

#### Reconnect Account
- **Method**: PUT
- **Path**: `/api/connect/accounts/:accountId/reconnect`
- **Description**: Initiates OAuth flow to reconnect account
- **Response**:
  ```json
  {
    "success": true,
    "redirectUrl": "string" // OAuth authorization URL
  }
  ```
  
#### Remove Account
- **Method**: DELETE
- **Path**: `/api/connect/accounts/:accountId`
- **Response**:
  ```json
  {
    "success": true
  }
  ```

## User Interactions & Workflows

### Managing Connected Accounts
1. **Viewing Accounts**
   - User navigates to Connect page
   - System loads and displays all connected accounts
   - User can search/filter to find specific accounts

2. **Disconnecting an Account**
   - User clicks "Disconnect" button on a connected account
   - System updates the account status to "disconnected"
   - UI updates to show disconnected state and different action buttons

3. **Reconnecting an Account**
   - User clicks "Reconnect" button on a disconnected account
   - System redirects to OAuth authorization page for that platform
   - After authorization, account status updates to "connected"

4. **Removing an Account**
   - User clicks "Remove Channel" button
   - System displays confirmation modal
   - If confirmed, system permanently removes the account connection
   - Account disappears from the list

5. **Managing Queue Time**
   - User clicks "Manage Queue Time" button
   - System opens scheduling preferences interface
   - User can set preferred posting times and frequency
   - Changes are saved to the account settings

### Search Functionality
- Real-time filtering of accounts list
- Matches against account name and type
- Empty state displayed when no accounts match search criteria

## Performance Considerations
- Account list should lazy load for users with many connections
- OAuth redirects should use state parameters to prevent CSRF attacks
- Rate limiting should be implemented on API endpoints
- Disconnection should be handled gracefully when platforms have API issues

## Accessibility Features
- All interactive elements have appropriate ARIA attributes
- Color is not the only indicator of account status
- Modal is keyboard navigable with proper focus management
- Search functionality works with screen readers

## Route
- **Path**: `/connect`
- **Access**: Protected (authentication required)
- **Redirect**: Unauthenticated users are redirected to homepage

## Future Enhancements
1. Bulk actions for managing multiple accounts
2. Account health monitoring with proactive reconnection prompts
3. Analytics overview for each connected account
4. Custom labeling and grouping of accounts
5. More granular permission management for team accounts 