# ConnectNewPage Documentation

## Overview
The ConnectNewPage allows users to add new social media accounts to the Marketing Automation Tool (MAT). It presents available channel options, guides users through the authorization process, and manages the free plan limitations. This page acts as the entry point for expanding a user's social media presence within the application.

## File Location
- **Component Path**: `src/pages/ConnectNew.tsx`
- **Related Components**:
  - ConnectNewContent (`src/components/organisms/Connect/ConnectNewContent.tsx`)

## Page Structure
```
ConnectNewPage
├── Header (Navigation + User Menu)
└── Main Content
    └── ConnectNewContent
        ├── Page Title
        ├── Back to Channels Link
        ├── Connect New Channel Section
        │   ├── Instructions
        │   └── Channel Grid
        └── Free Plan Section
            ├── Trial Expiration Notice
            ├── Current Plan Status
            └── Upgrade Button
```

## Component Details

### ConnectNewContent Component
- **Purpose**: Provides interface for connecting new social media accounts
- **Layout**: Two-column layout on desktop (responsive single column on mobile)
  - Left column: Connect New Channel interface
  - Right column: Free Plan information and upgrade option

- **Key Sections**:
  1. **Page Title**
     - Main title outside content boxes: "Connect to Social Network"
  
  2. **Connect New Channel Section (Left Column)**
     - Title: "Connect New Channel"
     - Back to Channels link (returns to `/connect`)
     - Instructions panel with help information
     - Grid of available social platforms with:
       - Platform logo
       - Platform name and type
       - Brief description
       - Connect button
  
  3. **Free Plan Section (Right Column)**
     - Trial expiration notice
     - Current plan status indicator
     - Plan limit information
     - Upgrade button

### Available Social Platforms
The page provides multiple social media platforms for connection:
1. **Twitter Profile**
   - Connect personal or business Twitter accounts
   - Schedule tweets and analyze engagement

2. **LinkedIn Page/Profile**
   - Connect company pages or personal profiles
   - Publish professional content and track engagement

3. **Pinterest Business**
   - Connect Pinterest business accounts
   - Schedule pins and track traffic data

4. **Facebook Page/Group**
   - Connect Facebook pages or groups
   - Publish content and interact with audience

5. **Instagram Business Account**
   - Connect Instagram business accounts
   - Schedule posts and track engagement

6. **Shopify Store**
   - Connect Shopify e-commerce stores
   - Integrate product information and track conversions

## Connection Workflow

### OAuth Authorization Flow
1. **Initiation**
   - User clicks "CONNECT" button for desired platform
   - System prepares OAuth request with appropriate scopes
   
2. **Authorization**
   - User is redirected to platform's OAuth authorization page
   - User grants permission to the application
   
3. **Token Exchange**
   - Platform redirects back with authorization code
   - Backend exchanges code for access and refresh tokens
   
4. **Account Creation**
   - System creates new social account record
   - UI updates to show newly connected account
   - User is redirected to the main Connect page

### Plan Limit Handling
- Free plan users are limited to 3 social media accounts
- When limit is reached:
  - Warning is displayed in the Free Plan section
  - User is prompted to upgrade
  - Connection process still works, but recommends upgrade

## Data Schema Requirements

### Channel Schema
```typescript
interface Channel {
  id: string;
  name: string;
  icon: string;
  description: string;
  connectUrl: string;
  scopes?: string[]; // OAuth permission scopes
  requiresBusinessAccount?: boolean;
  setupInstructions?: string;
}
```

### PlanLimits Schema
```typescript
interface PlanLimits {
  name: string; // e.g., "FREE PLAN"
  accountLimit: number; // Number of allowed accounts
  scheduledPostsLimit: number;
  analyticsRetentionDays: number;
  features: string[]; // Available features for plan level
}
```

## API Integration & Data Flow

### Connect API Endpoints

#### List Available Channels
- **Method**: GET
- **Path**: `/api/connect/channels`
- **Response**:
  ```json
  {
    "channels": [
      {
        "id": "string",
        "name": "string",
        "icon": "string",
        "description": "string",
        "connectUrl": "string"
      }
    ]
  }
  ```

#### Get User Plan Information
- **Method**: GET
- **Path**: `/api/users/me/plan`
- **Response**:
  ```json
  {
    "plan": "free",
    "accountsUsed": 3,
    "accountLimit": 3,
    "trialDaysRemaining": 5,
    "features": ["basic_scheduling", "basic_analytics"]
  }
  ```

#### Initiate Account Connection
- **Method**: POST
- **Path**: `/api/connect/initialize-connection`
- **Body**:
  ```json
  {
    "platform": "string"
  }
  ```
- **Response**:
  ```json
  {
    "authorizationUrl": "string",
    "state": "string" // for CSRF protection
  }
  ```

#### Complete Account Connection
- **Method**: POST
- **Path**: `/api/connect/complete-connection`
- **Body**:
  ```json
  {
    "platform": "string",
    "code": "string",
    "state": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "account": {
      "id": "string",
      "name": "string",
      "type": "string",
      "platform": "string",
      "status": "connected"
    }
  }
  ```

## Platform-Specific Auth Requirements

### Twitter
- **Authentication**: OAuth 2.0
- **Required Scopes**:
  - `tweet.read`
  - `tweet.write`
  - `users.read`
  - `offline.access`

### LinkedIn
- **Authentication**: OAuth 2.0
- **Required Scopes**:
  - `r_liteprofile`
  - `r_organization_admin`
  - `w_organization_social`
  - `w_member_social`

### Facebook
- **Authentication**: OAuth 2.0
- **Required Scopes**:
  - `pages_manage_posts`
  - `pages_read_engagement`
  - `publish_to_groups` (for group connections)

### Pinterest
- **Authentication**: OAuth 2.0
- **Required Scopes**:
  - `pins:read`
  - `pins:write`
  - `boards:read`
  - `boards:write`

### Instagram
- **Authentication**: OAuth 2.0 via Facebook
- **Required Scopes**:
  - `instagram_basic`
  - `instagram_content_publish`
  - `pages_show_list`

### Shopify
- **Authentication**: OAuth 2.0
- **Required Scopes**:
  - `read_products`
  - `read_orders`
  - `read_customers`

## Error Handling
- **Rate Limiting**: Graceful handling of platform-specific rate limits
- **Connection Failures**: Clear error messages for auth failures
- **Account Already Connected**: Prevention of duplicate connections
- **Business Account Requirements**: Clear messaging when business accounts are required

## Accessibility Features
- All interactive elements have appropriate ARIA attributes
- Channel grid is keyboard navigable
- Platform icons have proper alt text
- Color is not the only indicator of selection state

## Route
- **Path**: `/connect/new`
- **Access**: Protected (authentication required)
- **Redirect**: Unauthenticated users are redirected to homepage

## Future Enhancements
1. Multi-account management for the same platform
2. Custom connection parameters per platform
3. Advanced permission scope selection 
4. Connection health tests upon completion
5. Guided setup wizards for each platform 