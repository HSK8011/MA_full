# Marketing Automation Tool - Application Schema

## Overview
This document provides a comprehensive schema of the Marketing Automation Tool application, detailing the data models, component structure, and architectural patterns used throughout the application.

## Application Architecture

### Technology Stack
- **Frontend**: React with TypeScript
- **UI Framework**: Shadcn UI components with Tailwind CSS
- **State Management**: Context API
- **Styling**: Emotion with Tailwind CSS utilities
- **API Communication**: Fetch API with custom hooks
- **Routing**: React Router
- **Build Tool**: Vite

### Design Pattern
The application follows the **Atomic Design** pattern for component organization:

1. **Atoms**: Basic building blocks (buttons, inputs, labels)
2. **Molecules**: Simple combinations of atoms (form fields, card with header)
3. **Organisms**: Complex UI sections (forms, navigation bars, data tables)
4. **Templates**: Page-level layouts (dashboard layouts, settings layouts)
5. **Pages**: Specific instances of templates

## Directory Structure

```
├── src/
│   ├── assets/             # Static assets
│   ├── components/         # Component library following Atomic Design
│   │   ├── atoms/          # Basic UI components
│   │   │   ├── ui/         # Shadcn UI components
│   │   │   └── custom/     # Custom atomic components
│   │   ├── molecules/      # Composite components
│   │   ├── organisms/      # Complex UI sections
│   │   └── templates/      # Page layout templates
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and helpers
│   ├── pages/              # Page components
│   ├── services/           # API service modules
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
└── docs/                   # Documentation
    ├── api/                # API documentation
    ├── pages/              # Page documentation
    └── react-vite-shadcn-atomic-design/ # Design system documentation
```

## Data Models

### User Model
```typescript
interface User {
  id: string;                  // Primary key, UUID format
  name: string;                // User's full name
  email: string;               // User's email (unique)
  password: string;            // Hashed password (bcrypt) - stored only in DB
  phone: string | null;        // Optional phone number
  timezone: string;            // Default: "Culcutta (+05:30)"
  subscription_plan: string;   // "free", "pro", "enterprise"
  subscription_status: string; // "active", "inactive", "trialing"
  subscription_expiry: Date | null;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
  is_email_verified: boolean;
  verification_token: string | null;
  reset_password_token: string | null;
  reset_password_expires: Date | null;
  avatar_url: string | null;   // URL to user's profile picture
  account_type: string;        // "personal", "business", "agency"
  company_name: string | null; // For business and agency accounts
  company_size: string | null; // For business and agency accounts
  two_factor_enabled: boolean; // Whether 2FA is enabled for the user
  two_factor_secret: string | null; // Encrypted 2FA secret key
  activity_logs_enabled: boolean; // Whether to log user activity
  last_password_change: Date | null; // Timestamp of last password change
  preferences: {
    email_notifications: boolean;  // Email notification preferences
    dashboard_layout: string;      // User's preferred dashboard layout
    theme: string;                 // "light", "dark", "system"
    language: string;              // "en-US", "fr-FR", etc.
  };
  role: string;                // "owner", "admin", "editor", "viewer"
  team_id: string | null;      // Foreign key to Team (null for team owners)
  status: string;              // "active", "pending", "inactive"
}
```

### Social Account Model
```typescript
interface SocialAccount {
  id: string;                  // Primary key, UUID format
  user_id: string;             // Foreign key to User
  platform: string;            // "twitter", "facebook", "linkedin", "instagram", "pinterest"
  account_id: string;          // Platform-specific ID
  username: string;            // Handle/username on the platform
  display_name: string;        // Display name on the platform 
  profile_image_url: string | null;
  access_token: string;        // Encrypted OAuth token
  refresh_token: string | null; // Encrypted OAuth refresh token
  token_expires_at: Date | null;
  is_active: boolean;          // Whether the account is connected and active
  last_synced_at: Date;        // Last time data was synced from this account
  created_at: Date;
  updated_at: Date;
  meta: {                      // Platform-specific metadata
    page_id?: string;          // For Facebook pages
    page_access_token?: string; // For Facebook pages
    account_type?: string;     // "personal", "business", "creator"
    scopes?: string[];         // OAuth scopes granted
  };
}
```

### Content Post Model
```typescript
interface Post {
  id: string;                  // Primary key, UUID format
  user_id: string;             // Foreign key to User
  title: string;               // Post title
  content: string;             // Post content/text
  media_urls: string[];        // Array of media URLs (images, videos)
  platforms: string[];         // Platforms to post to
  status: string;              // "draft", "scheduled", "published", "sent"
  scheduled_time: Date | null; // When the post is scheduled to be published
  published_time: Date | null; // When the post was actually published
  created_at: Date;
  updated_at: Date;
  queue_settings_id: string | null; // Foreign key to QueueSettings
  meta: {                      // Platform-specific metadata
    tags: string[];            // Hashtags
    mentions: string[];        // User mentions
    link_preview: boolean;     // Whether to show link previews
    platform_specific: {       // Platform-specific options
      [platform: string]: any;
    };
  };
}
```

### Team Model
```typescript
interface Team {
  id: string;                  // Primary key, UUID format
  name: string;                // Team name
  owner_id: string;            // Foreign key to User (the account owner)
  created_at: Date;
  updated_at: Date;
  plan_seats: number;          // Number of seats available in the plan
  used_seats: number;          // Number of seats currently used
  settings: {
    allow_member_invites: boolean;     // Whether non-admin members can invite others
    require_admin_approval: boolean;   // Whether admin approval is needed for invites
    default_member_role: string;       // Default role for new members
  };
  billing_contact_id: string | null;   // User ID of billing contact
}
```

### Queue Settings Model
```typescript
interface QueueSettings {
  id: string;                  // Primary key, UUID format
  user_id: string;             // Foreign key to User
  name: string;                // Custom name for this queue setting
  is_active: boolean;          // Whether this queue setting is active
  platforms: string[];         // Which platforms this queue applies to
  time_slots: {
    day: string;               // "monday", "tuesday", etc.
    times: string[];           // Array of times in the format "HH:MM"
  }[];
  created_at: Date;
  updated_at: Date;
  account_ids: string[];       // Array of social account IDs this queue applies to
  time_zone: string;           // Timezone for the times
}
```

### Analytics Data Model
```typescript
interface AnalyticsData {
  id: string;                  // Primary key, UUID format
  user_id: string;             // Foreign key to User
  account_id: string;          // Foreign key to SocialAccount
  post_id: string | null;      // Foreign key to Post (if applicable)
  platform: string;            // Social media platform
  period: string;              // "day", "week", "month", "custom"
  start_date: Date;            // Start of analytics period
  end_date: Date;              // End of analytics period
  metrics: {
    impressions: number;       // Number of times content was viewed
    engagement: number;        // Total engagement (likes, comments, shares, etc.)
    clicks: number;            // Number of clicks on links
    followers_gained: number;  // New followers gained
    followers_lost: number;    // Followers lost
    reach: number;             // Unique users who saw the content
    profile_views: number;     // Number of profile views
    platform_specific: {       // Platform-specific metrics
      [key: string]: any;
    };
  };
  created_at: Date;
  updated_at: Date;
}
```

## Key Pages

### Dashboard Page
- **Purpose**: Main interface after login
- **Features**:
  - Social media account overview
  - Recent post performance
  - Scheduled posts calendar
  - Quick actions (create post, view analytics)
  - Activity feed

### Connect Pages
- **Connect Page**: Manage existing social media connections
- **ConnectNew Page**: Add new social media accounts
- **Features**:
  - OAuth integration with social platforms
  - Connection status management
  - Account reconnection
  - Platform-specific settings

### Publish Pages
- **Purpose**: Create, edit, and schedule social media content
- **Features**:
  - Rich text editor
  - Media management
  - Multi-platform posting
  - Post preview
  - Scheduling options
  - Queue time settings

### Analyze Page
- **Purpose**: View analytics across social platforms
- **Features**:
  - Performance metrics
  - Engagement statistics
  - Audience demographics
  - Content performance
  - Custom date ranges
  - Export capabilities

### Settings Page
- **Purpose**: Manage user preferences and account settings
- **Sections**:
  - Account Settings
  - Notification Preferences
  - Team Management
  - Billing Information
  - Security Settings
  - API Access

### Manage Users Page
- **Purpose**: Team management for business/agency accounts
- **Features**:
  - User invitations
  - Role assignment
  - Permission management
  - Activity monitoring
  - User removal

## Component Hierarchy

### Authentication Components
- Login Form
- Registration Form
- Password Reset
- Two-Factor Authentication
- Social Login Options

### Dashboard Components
- Overview Cards
- Recent Activity Feed
- Quick Action Buttons
- Performance Metrics Charts
- Calendar Schedule View

### Content Creation Components
- Rich Text Editor
- Media Upload Widget
- Platform Selector
- Post Preview Cards
- Scheduling Interface
- Queue Time Selector

### Analytics Components
- Metrics Overview Cards
- Time Period Selector
- Data Visualization Charts
- Platform Comparison View
- Export Controls
- Detailed Metrics Tables

### Settings Components
- Settings Navigation
- Profile Edit Form
- Password Change Form
- Notification Preferences
- Team Management Interface
- Billing Information Form

## API Integration

### Authentication Endpoints
- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/refresh-token`
- `/api/auth/logout`
- `/api/auth/password-reset`
- `/api/auth/verify-email`

### User Management Endpoints
- `/api/user/profile`
- `/api/user/security-settings`
- `/api/user/notification-preferences`
- `/api/team/members`
- `/api/team/invitations`

### Social Connection Endpoints
- `/api/connect/accounts`
- `/api/connect/oauth/:platform`
- `/api/connect/accounts/:accountId/disconnect`
- `/api/connect/accounts/:accountId/reconnect`

### Content Management Endpoints
- `/api/posts`
- `/api/posts/draft`
- `/api/posts/scheduled`
- `/api/posts/published`
- `/api/posts/:postId`
- `/api/queue-settings`

### Analytics Endpoints
- `/api/analyze/overview`
- `/api/analyze/accounts/:accountId`
- `/api/analyze/posts/:postId`
- `/api/analyze/export`

## Security Implementation

- JWT-based authentication
- Password hashing (bcrypt)
- HTTPS for all API communication
- CSRF protection
- Input validation
- OAuth 2.0 for social platform integration
- Two-factor authentication
- Account activity logging
- Role-based access control

## Responsive Design

The application implements responsive design using Tailwind CSS breakpoints:
- `sm`: 640px (mobile devices)
- `md`: 768px (tablets)
- `lg`: 1024px (laptops)
- `xl`: 1280px (desktops)
- `2xl`: 1536px (large screens)

All components are built with a mobile-first approach, ensuring optimal user experience across all device sizes. 