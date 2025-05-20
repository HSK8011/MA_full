# Database Schema Documentation

## Overview
This document outlines the database schema for the Marketing Automation Tool. The application uses a relational database structure with the following main entities: Users, Teams, Social Accounts, Content, Analytics, and Engagements.

## Schemas

### User Schema
```typescript
interface User {
  id: string;                  // Primary key, UUID format
  name: string;                // User's full name
  first_name: string;          // User's first name
  last_name: string;           // User's last name
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

### Social Account Schema
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

### NotificationPreference Schema
```typescript
interface NotificationPreference {
  id: string;                  // Primary key, UUID format
  user_id: string;             // Foreign key to User
  notification_type: string;   // "account_update", "new_user_added", etc.
  type_display_name: string;   // Display name: "Account Update", "New User Added", etc.
  description: string;         // Description of when this notification is sent
  email_enabled: boolean;      // Whether email notifications are enabled
  desktop_enabled: boolean;    // Whether desktop notifications are enabled
  created_at: Date;
  updated_at: Date;
}
```

### NotificationType Schema
```typescript
interface NotificationType {
  id: string;                  // Primary key, unique identifier
  code: string;                // Internal code: "account_update", "new_user_added", etc.
  display_name: string;        // User-facing name: "Account Update", etc.
  description: string;         // Description of when this notification is sent
  category: string;            // Category group: "account", "content", "social", etc.
  supports_email: boolean;     // Whether email channel is supported
  supports_desktop: boolean;   // Whether desktop channel is supported
  default_email_enabled: boolean; // Default setting for email
  default_desktop_enabled: boolean; // Default setting for desktop
  required: boolean;           // Whether this notification can be disabled
}
```

### Timezone Schema
```typescript
interface Timezone {
  id: string;                  // Primary key
  name: string;                // Display name (e.g., "Culcutta")
  offset: string;              // Timezone offset (e.g., "+05:30")
  value: string;               // Combined name and offset (e.g., "Culcutta (+05:30)")
  region: string;              // Geographic region (e.g., "Asia")
  country_code: string;        // ISO country code (e.g., "IN")
  is_dst: boolean;             // Whether daylight saving time is observed
}
```

### UserActivityLog Schema
```typescript
interface UserActivityLog {
  id: string;                  // Primary key, UUID format
  user_id: string;             // Foreign key to User
  activity_type: string;       // Type of activity: "login", "logout", "password_change", "2fa_setup", etc.
  timestamp: Date;             // When the activity occurred
  ip_address: string;          // IP address of the client
  user_agent: string;          // User agent string
  status: string;              // "success", "failure"
  details: {                   // Additional details about the activity
    reason?: string;           // Reason for failure
    location?: {               // Geolocation data
      city: string | null;
      country: string | null;
      country_code: string | null;
    };
    device?: string;           // Device information
    browser?: string;          // Browser information
    [key: string]: any;        // Other activity-specific details
  };
}
```

### Settings Schema (Application Configuration)
```typescript
interface Settings {
  id: string;                  // Primary key
  category: string;            // "general", "security", "notifications", "accounts"
  key: string;                 // Setting key
  value: any;                  // Setting value (stored as JSON)
  is_user_editable: boolean;   // Whether users can modify this setting
  requires_premium: boolean;   // Whether this setting requires a premium plan
  description: string;         // Human-readable description
}
```

### TwoFactorRecoveryCode Schema
```typescript
interface TwoFactorRecoveryCode {
  id: string;                  // Primary key, UUID format
  user_id: string;             // Foreign key to User
  code: string;                // Hashed recovery code
  is_used: boolean;            // Whether the code has been used
  used_at: Date | null;        // When the code was used
  created_at: Date;            // When the code was created
  expires_at: Date | null;     // Optional expiration time
}
```

### Team Schema
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

### TeamInvitation Schema
```typescript
interface TeamInvitation {
  id: string;                  // Primary key, UUID format
  team_id: string;             // Foreign key to Team
  invited_by_id: string;       // Foreign key to User who sent the invitation
  email: string;               // Email address of the invitee
  first_name: string;          // First name of the invitee
  last_name: string;           // Last name of the invitee
  role: string;                // Assigned role: "admin", "editor", "viewer"
  permissions: string[];       // Specific permissions granted
  created_at: Date;
  expires_at: Date;            // When the invitation expires
  status: string;              // "pending", "accepted", "revoked", "expired"
  invitation_token: string;    // Unique token for accepting the invitation
  last_sent_at: Date;          // When the last invitation email was sent
}
```

### UserPermission Schema
```typescript
interface UserPermission {
  id: string;                  // Primary key, UUID format
  user_id: string;             // Foreign key to User
  permission: string;          // Permission code: "create_posts", "connect_accounts", "view_analytics"
  granted_by_id: string;       // Foreign key to User who granted the permission
  granted_at: Date;
  revoked_at: Date | null;     // When the permission was revoked (if applicable)
  is_active: boolean;          // Whether the permission is currently active
}
```

## Relationships

### User <-> Settings
- One-to-many relationship
- A user can have multiple user-specific settings
- Settings can be application-wide or user-specific

### User <-> Social Accounts
- One-to-many relationship
- A user can connect multiple social media accounts
- Each social account belongs to exactly one user

### User <-> NotificationPreferences
- One-to-many relationship
- Each user has a set of notification preferences
- Notification preferences are created for each user upon registration with default values

### User <-> UserActivityLogs
- One-to-many relationship
- A user can have multiple activity log entries
- Each activity log entry is associated with exactly one user

### User <-> TwoFactorRecoveryCodes
- One-to-many relationship
- A user with 2FA enabled has multiple recovery codes
- Each recovery code belongs to exactly one user

### User <-> Team
- Many-to-one relationship
- Multiple users can belong to a team
- Each team has one owner (special user relationship)

### Team <-> TeamInvitation
- One-to-many relationship
- A team can have multiple pending invitations
- Each invitation belongs to exactly one team

### User <-> UserPermission
- One-to-many relationship
- A user can have multiple permissions
- Each permission record belongs to exactly one user

### User <-> TeamInvitation (invited_by)
- One-to-many relationship
- A user can send multiple team invitations
- Each invitation has exactly one sender

## Database Indices

### User Table Indices
- `user_email_idx`: Index on `email` column (for login lookups)
- `user_subscription_idx`: Index on `subscription_status` and `subscription_expiry` (for subscription checks)

### Social Account Table Indices
- `social_user_platform_idx`: Composite index on `user_id` and `platform` (for filtering accounts by platform)
- `social_is_active_idx`: Index on `is_active` (for filtering active accounts)

### NotificationPreference Table Indices
- `notification_user_type_idx`: Composite index on `user_id` and `notification_type` (for looking up specific preferences)
- `notification_user_idx`: Index on `user_id` (for retrieving all user preferences)

### UserActivityLog Table Indices
- `activity_user_idx`: Index on `user_id` (for retrieving user activity)
- `activity_timestamp_idx`: Index on `timestamp` (for chronological sorting)
- `activity_type_idx`: Index on `activity_type` (for filtering by activity type)

### Team Table Indices
- `team_owner_idx`: Index on `owner_id` column (for owner lookups)
- `team_name_idx`: Index on `name` column (for search functionality)

### TeamInvitation Table Indices
- `invitation_email_idx`: Index on `email` column (for checking existing invitations)
- `invitation_token_idx`: Index on `invitation_token` (for invitation acceptance)
- `invitation_status_idx`: Index on `status` (for filtering by status)

### UserPermission Table Indices
- `permission_user_idx`: Index on `user_id` (for retrieving user permissions)
- `permission_active_idx`: Composite index on `user_id` and `is_active` (for active permissions)

## Data Flow for Account Settings

### Fetching User Profile Data
1. User authenticates and receives JWT token
2. JWT token is stored in localStorage or secure cookie
3. When user navigates to Settings page, application fetches user data:
   ```
   GET /api/user/profile
   Authorization: Bearer [jwt_token]
   ```
4. Backend validates token, retrieves user record from database
5. User data is returned to frontend without sensitive fields (password, tokens)
6. Account Settings component displays user data in form

### Updating User Profile Data
1. User modifies settings (name, phone, timezone) in Account Settings form
2. On form submission:
   ```
   PUT /api/user/profile
   Authorization: Bearer [jwt_token]
   Content-Type: application/json
   
   {
     "name": "Updated Name",
     "phone": "+91 9876543210",
     "timezone": "Mumbai (+05:30)"
   }
   ```
3. Backend validates token and input data
4. If valid, backend updates user record in database
5. Updated user data is returned to frontend
6. Account Settings component displays success message and updated data

### Fetching Notification Preferences
1. When user navigates to the Notification Settings tab, application fetches notification preferences:
   ```
   GET /api/user/notification-preferences
   Authorization: Bearer [jwt_token]
   ```
2. Backend validates token, retrieves user's notification preferences
3. Notification preferences data is returned to frontend
4. NotificationSettings component displays the preferences with toggle switches

### Updating Notification Preferences
1. User toggles notification preferences for different notification types
2. On save button click:
   ```
   PUT /api/user/notification-preferences
   Authorization: Bearer [jwt_token]
   Content-Type: application/json
   
   {
     "preferences": [
       { "id": "account_update", "emailEnabled": true, "desktopEnabled": false },
       { "id": "new_user_added", "emailEnabled": false, "desktopEnabled": true },
       // other preferences
     ]
   }
   ```
3. Backend validates token and input data
4. If valid, backend updates notification preference records in database
5. Success response is returned to frontend
6. NotificationSettings component displays success message

### Fetching Security Settings
1. When user navigates to the Security Settings tab, application fetches security settings:
   ```
   GET /api/user/security-settings
   Authorization: Bearer [jwt_token]
   ```
2. Backend validates token, retrieves user's security settings (2FA status, activity logging, last password change)
3. Security settings data is returned to frontend
4. SecuritySettings component displays the settings

### Changing Password
1. User enters current password and new password in Security Settings form
2. On form submission:
   ```
   PUT /api/user/security/change-password
   Authorization: Bearer [jwt_token]
   Content-Type: application/json
   
   {
     "currentPassword": "current-password",
     "newPassword": "new-password"
   }
   ```
3. Backend validates token and verifies current password
4. If valid, backend updates user's password in database
5. Backend creates activity log entry for password change
6. Success response is returned to frontend
7. SecuritySettings component displays success message

### Managing Two-Factor Authentication
1. User clicks enable/disable button in Security Settings
2. Frontend sends request to enable/disable 2FA:
   ```
   PUT /api/user/security/2fa
   Authorization: Bearer [jwt_token]
   Content-Type: application/json
   
   {
     "enabled": true
   }
   ```
3. If enabling 2FA, backend generates TOTP secret and recovery codes
4. Backend updates user record with 2FA settings
5. Backend creates activity log entry for 2FA change
6. If enabling, QR code and setup information are returned to frontend
7. SecuritySettings component displays setup instructions or success message

## Security Considerations
- Passwords are never stored in plaintext, only as bcrypt hashes
- OAuth tokens for social platforms are encrypted at rest
- Database access is restricted by role-based permissions
- Personal data is encrypted at rest
- API access requires valid JWT token with appropriate claims
- Sensitive operations (password change, email change) require additional verification
- Two-factor authentication uses industry-standard TOTP algorithm
- Activity logging provides audit trail for security-related events
- Recovery codes for 2FA are stored as hashes, not plaintext
- Rate limiting is applied to authentication endpoints to prevent brute force attacks 