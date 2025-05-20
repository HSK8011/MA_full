# Authentication Components Documentation

## Overview
This document details the authentication components and mechanisms implemented in the Marketing Automation Tool (MAT) application. The authentication system includes modals for login, signup, and password recovery, with context-based state management and navigation.

## Key Components

### AuthModalContext
- **File Location**: `src/context/AuthModalContext.tsx`
- **Purpose**: Manages authentication modal state and user authentication flows
- **Provides**:
  - Modal opening/closing functionality
  - Modal type switching (login, signup, forgot password)
  - Authentication success handling and redirection

### Authentication Forms
- **File Location**: `src/components/molecules/AuthForms.tsx`
- **Components**:
  1. **LoginForm**: User login functionality
  2. **SignupForm**: New user registration
  3. **ForgotPasswordForm**: Password recovery process

### Modal Component
- **File Location**: `src/components/atoms/ui/modal.tsx`
- **Purpose**: Reusable modal component for displaying authentication forms
- **Features**:
  - Animation effects for opening/closing
  - Backdrop click to close
  - Close button
  - Title support

## Authentication Flow Diagrams

### Login Flow
```
User clicks "Login" → LoginForm Modal opens → User enters credentials → 
Form validation → API call (simulated) → Authentication success → 
Store auth state in localStorage → Redirect to Dashboard
```

### Signup Flow
```
User clicks "Get Started Now" → SignupForm Modal opens → User completes form → 
Form validation → API call (simulated) → Account creation → 
Store auth state in localStorage → Redirect to Dashboard
```

### Password Recovery Flow
```
User clicks "Forgot Password" in login form → ForgotPasswordForm Modal opens → 
User enters email → Form validation → API call (simulated) → 
Success message displayed → Option to return to login
```

### Logout Flow
```
User clicks "Logout" → Remove authentication data from localStorage → 
Redirect to Homepage
```

## Component Details

### AuthModalContext
```typescript
type AuthModalType = 'login' | 'signup' | 'forgot' | null;

interface AuthModalContextType {
  openModal: (type: AuthModalType) => void;
  closeModal: () => void;
  currentModal: AuthModalType;
  handleSuccessfulAuth: () => void;
}
```

- **State**:
  - `currentModal`: Controls which modal is displayed
- **Methods**:
  - `openModal(type)`: Opens the specified modal type
  - `closeModal()`: Closes any open modal
  - `switchModal(type)`: Switches between modal types
  - `handleSuccessfulAuth()`: Processes successful authentication

### LoginForm
- **Props**:
  - `onSwitch`: Function to switch to different form type
  - `onSuccess`: Callback function for successful authentication
- **State**:
  - `email`: User's email input
  - `password`: User's password input
  - `isLoading`: Loading state during authentication
- **Functionality**:
  - Form validation
  - Submit handling with loading state
  - Authentication simulation
  - Success callback execution

### SignupForm
- **Props**:
  - `onSwitch`: Function to switch to different form type
  - `onSuccess`: Callback function for successful registration
- **State**:
  - `fullName`: User's full name input
  - `email`: User's email input
  - `password`: User's password input
  - `isLoading`: Loading state during registration
- **Functionality**:
  - Form validation
  - Submit handling with loading state
  - Registration simulation
  - Success callback execution

### ForgotPasswordForm
- **Props**:
  - `onSwitch`: Function to switch to different form type
- **State**:
  - `email`: User's email input
  - `isLoading`: Loading state during request submission
  - `resetSent`: Flag indicating successful submission
- **Functionality**:
  - Form validation
  - Submit handling with loading state
  - Success state display

### Modal Component
- **Props**:
  - `isOpen`: Controls modal visibility
  - `onClose`: Function to call when modal is closed
  - `children`: Modal content
  - `title`: Optional modal title
- **Features**:
  - Backdrop overlay with click-to-close
  - Animation effects using CSS transitions
  - Portal-based rendering
  - Accessibility features

## Authentication State Management

### Current Implementation
- Uses `localStorage` for persistence:
  - `isAuthenticated` flag to track login state
- Simple, client-side approach for prototype stage

### Planned Enhancements
- **JWT Token Implementation**:
  ```typescript
  interface AuthState {
    token: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      role: string;
    };
    expiresAt: number;
  }
  ```
- Token refresh mechanism
- Secure storage options
- HTTP-only cookies consideration

## Protected Routes Implementation

### Current Approach
- Route protection implemented in App.tsx
- Checks `localStorage` for authentication flag
- Redirects unauthenticated users to homepage

### Planned Route Structure
```
/                 - HomePage (public)
/dashboard        - DashboardPage (protected)
/settings         - SettingsPage (protected)
/analytics        - AnalyticsPage (protected)
/posts            - PostsManagementPage (protected)
/posts/create     - CreatePostPage (protected)
/posts/:id        - EditPostPage (protected)
```

## API Endpoints For Authentication

### Sign-up Endpoint
- **Method**: POST
- **Path**: `/api/auth/signup`
- **Body**:
  ```json
  {
    "fullName": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "id": "string",
      "fullName": "string",
      "email": "string",
      "role": "string",
      "createdAt": "string",
      "trialEndDate": "string"
    },
    "token": "string"
  }
  ```

### Login Endpoint
- **Method**: POST
- **Path**: `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "id": "string",
      "fullName": "string",
      "email": "string",
      "role": "string"
    },
    "token": "string"
  }
  ```

### Logout Endpoint
- **Method**: POST
- **Path**: `/api/auth/logout`
- **Authentication**: Required (JWT token in headers)
- **Response**:
  ```json
  {
    "message": "Successfully logged out"
  }
  ```

### Password Reset Request Endpoint
- **Method**: POST
- **Path**: `/api/auth/password-reset-request`
- **Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password reset instructions sent to your email"
  }
  ```

### Password Reset Completion Endpoint
- **Method**: POST
- **Path**: `/api/auth/password-reset`
- **Body**:
  ```json
  {
    "token": "string",
    "newPassword": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password successfully reset"
  }
  ```

## Security Considerations

### Password Requirements
- Minimum 8 characters
- Contains at least one uppercase letter
- Contains at least one lowercase letter
- Contains at least one number
- Contains at least one special character

### Authentication Headers
```
Authorization: Bearer [JWT_TOKEN]
```

### Token Refresh Strategy
- **Short-lived access tokens** (15-60 minutes)
- **Longer-lived refresh tokens** (7-30 days)
- Refresh endpoint to obtain new access token
- Blacklisting of compromised tokens

## Future Enhancements
1. Implement social login options (Google, Facebook, Twitter)
2. Add two-factor authentication
3. Implement email verification flow
4. Add account lockout after failed attempts
5. Create password strength meter
6. Implement remember me functionality

## Testing Considerations
- Unit tests for form validation
- Integration tests for authentication flows
- Security testing (token expiration, route protection)
- Error handling and user feedback
- Edge cases (network failures, token refresh failures) 