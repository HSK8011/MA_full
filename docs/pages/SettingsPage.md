# Settings Page Documentation

## Overview
The Settings page provides users with a central interface to manage their account preferences, profile information, notification settings, and security controls. This page is accessible only to authenticated users and follows the same design patterns as the Dashboard.

## File Location
- **Component Path**: `src/pages/Settings.tsx`
- **Related Components**:
  - DashboardTemplate (`src/components/templates/Dashboard/DashboardTemplate.tsx`)
  - AccountSettings (`src/components/organisms/Settings/AccountSettings.tsx`)
  - NotificationSettings (`src/components/organisms/Settings/NotificationSettings.tsx`)
  - SecuritySettings (`src/components/organisms/Settings/SecuritySettings.tsx`)

## Page Structure
```
Settings Page
├── DashboardTemplate
│   ├── Sidebar (Navigation)
│   ├── Header (User Menu + Navigation)
│   └── Main Content
│       └── AccountSettings
│           ├── Settings Sidebar
│           │   ├── Profile Settings
│           │   ├── Notification Settings
│           │   ├── Security Settings
│           │   └── General Settings
│           └── Settings Content Area
│               └── [Selected Settings Panel]
```

## Component Details

### AccountSettings Component
- **Purpose**: Main container for all settings functionality
- **State Management**: Handles active tab selection and form data
- **Data Flow**: Fetches user data from API and handles updates
- **Panels**:
  1. **Profile Settings**: User profile information management
  2. **Notification Settings**: Email and in-app notification preferences
  3. **Security Settings**: Password and security options
  4. **General Settings**: Application-wide preferences

### NotificationSettings Component
- **Purpose**: Manages user notification preferences
- **State Management**: Handles notification preference toggles and form submission
- **Data Flow**: Fetches and updates notification preferences via API
- **Features**:
  - Email notification toggles for different notification types
  - Desktop notification toggles for different notification types
  - Grouped by notification category (account, content, etc.)
  - Persistent preferences across sessions
  - Real-time toggle updates with optimistic UI

### SecuritySettings Component
- **Purpose**: Manages user security settings
- **State Management**: Handles security settings changes, especially password changes
- **Data Flow**: Fetches and updates security settings via API
- **Features**:
  - Password management with validation
  - Two-factor authentication (2FA) enable/disable button
  - Activity logging enable/disable button
  - Status indicators showing current state of each feature
  - Responsive design for all device sizes
  - Real-time updates with optimistic UI

### Navigation Flow
1. User accesses `/settings` route
2. DashboardTemplate renders with proper sidebar highlighting
3. AccountSettings component loads with Profile Settings tab active by default
4. User can switch between settings categories via the settings sidebar
5. Each settings panel maintains its own state

## API Integration & Data Flow

### Data Flow Architecture
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  React Settings │     │  API Layer       │     │   Database      │
│  Component      │────►│  (User Endpoints)│────►│   (User Schema) │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        ▲                        │                         │
        │                        ▼                         │
        │                ┌──────────────────┐              │
        │                │                  │              │
        └────────────────│  Response/Error  │◄─────────────┘
                         │  Handling        │
                         │                  │
                         └──────────────────┘
```

### User Profile Data Integration
- **Initial Load**:
  - On component mount, user data is fetched from `/api/user/profile`
  - Default values are used if any fields are null (e.g., phone number)
  - Form is populated with the retrieved data
- **Data Updates**:
  - When form is submitted, data is sent to `/api/user/profile` via PUT request
  - Optimistic UI updates immediately reflect changes
  - Error states are handled if the API returns errors
  - Success confirmation is shown on successful update

### Notification Preferences Integration
- **Initial Load**:
  - When the notification tab is selected, preferences are fetched from `/api/user/notification-preferences`
  - Toggle switches are set based on retrieved preferences
- **Data Updates**:
  - When user toggles notification switches and clicks save, data is sent to `/api/user/notification-preferences` via PUT request
  - Changed preferences are updated in the database
  - Success message is shown on successful update
  - Changes take effect immediately for future notifications

### Security Settings Integration
- **Initial Load**:
  - When the security tab is selected, security settings are fetched from `/api/user/security-settings`
  - Security settings include 2FA status, activity logging preference, last password change
- **Password Changes**:
  - When user submits password change form, data is sent to `/api/user/security/change-password` via PUT request
  - Current password is validated server-side
  - New password must meet minimum requirements (8+ characters)
  - Success message is shown on successful update
  - Last password change timestamp is updated
- **Two-Factor Authentication**:
  - When user clicks enable/disable button, setting is updated via `/api/user/security/2fa` endpoint
  - When enabling 2FA, QR code and setup instructions are displayed in a follow-up modal (not implemented in current UI)
  - When disabling 2FA, confirmation dialog is shown for security (not implemented in current UI)
  - Status indicator shows current enabled/disabled state
- **Activity Logging**:
  - When user clicks enable/disable button, setting is updated via `/api/user/security/activity-logs` endpoint
  - Activity logs track login attempts, security changes, and other security-related actions
  - Status indicator shows current enabled/disabled state

### Database Integration
- User data is stored in the `Users` table in the database
- Profile data corresponds to the User schema documented in `docs/api/schema.md`
- Email is a unique identifier for users and cannot be changed through the settings form
- Phone number is optional and may be null
- Timezone has a default value of "Culcutta (+05:30)" when user account is created
- Notification preferences are stored in the `NotificationPreferences` table, linked to users
- Security settings are stored in the `Users` table (2FA status, activity logging preference)

## Form Validation & Error Handling

### Profile Settings Validation
- **Name**: Required, 2-100 characters, only letters, spaces, and common name characters
- **Email**: Read-only field, cannot be changed via this form
- **Phone**: Optional, must match international phone format if provided
- **Timezone**: Required, must be one of the predefined timezone options

### Security Settings Validation
- **Current Password**: Required for password changes
- **New Password**: Required, minimum 8 characters, must include at least one number and one letter
- **Confirm Password**: Must match new password exactly
- **Two-Factor Authentication**: When enabled, user must complete setup process with authenticator app (not implemented in current UI)

### Error States
- **Field Validation Errors**: Displayed inline below each field
- **API Errors**: Displayed as toast notifications
- **Network Errors**: Displayed as toast notifications with retry option
- **Session Expiration**: Redirects to login page with return URL

## Feature Implementation Details

### User Profile Management
- **Data Source**: User database table 
- **Editable Fields**: Name, Phone, Timezone
- **Read-Only Fields**: Email (requires separate verification flow to change)
- **Profile Picture**: Users can upload/change profile pictures (stored in cloud storage)

### Notification Management
- **Data Source**: NotificationPreferences database table
- **Channels**: Email and Desktop notifications
- **Toggle Controls**: Individual on/off toggles for each notification type
- **Default Values**: System-defined defaults for new users
- **Types**: Account updates, content approvals, social media events, etc.
- **Persistence**: Settings saved to user's profile and persist across logins

### Security Management
- **Data Source**: User table
- **Password Management**: 
  - Change password form with current/new password fields
  - Password strength requirements enforced
  - Password history prevents reuse of recent passwords
  - Last password change timestamp displayed
- **Two-Factor Authentication**:
  - TOTP-based (Time-based One-Time Password) implementation
  - Enable/disable button instead of toggle switch
  - Clearly displayed enabled/disabled status
  - QR code generation for authenticator app setup (not implemented in current UI)
  - Recovery codes provided during setup (not implemented in current UI)
- **Activity Logging**:
  - Enable/disable button instead of toggle switch
  - Clearly displayed enabled/disabled status
  - Logs login attempts, password changes, security setting changes
  - Provides audit trail for security incidents
  - Data retention policies applied to logs

### Delete Account Functionality
- **Process**: Two-step confirmation required
- **Data Handling**: Account marked as deleted but data retained for 30 days
- **Recovery**: Account recovery possible within 30-day window
- **Permanent Deletion**: Scheduled job runs to permanently delete marked accounts after retention period

## Responsiveness
- Full responsive design for all device sizes
- Mobile-first approach with adaptive layouts
- Profile settings form switches to single column on small screens
- Settings sidebar collapses to top navigation on mobile devices
- Notification toggle grid adapts to available screen width
- Security settings panels stack vertically on small screens

## Security Considerations
- Page is only accessible to authenticated users
- All API calls require valid JWT token
- Form submissions use CSRF protection
- Sensitive actions (account deletion, password change) require confirmation
- Session timeout with automatic logout after period of inactivity
- Two-factor authentication with industry standard TOTP
- Password validation with minimum security requirements
- Rate limiting on password change and 2FA operations

## Accessibility
- All form fields properly labeled with associated IDs
- ARIA attributes for dynamic content
- Keyboard navigation support
- Focus management for form elements and tab switching
- High contrast mode support
- Screen reader support for notification toggle switches
- Error messages are properly associated with form fields

## Route
- **Path**: `/settings`
- **Access**: Protected (authentication required)
- **Redirect**: Unauthenticated users are redirected to the home page 