# HomePage Documentation

## Overview
The HomePage is the main landing page for the Marketing Automation Tool (MAT) application. It serves as the entry point for users and showcases the product's features, benefits, and call-to-actions to drive sign-ups.

## File Location
- **Component Path**: `src/components/templates/HomePage.tsx`
- **Related Components**:
  - Header (`src/components/organisms/Header.tsx`)
  - HeroSection (`src/components/organisms/HeroSection.tsx`)
  - ToolsSection (`src/components/organisms/ToolsSection.tsx`)
  - FeaturesSection (`src/components/organisms/FeaturesSection.tsx`)
  - Footer (`src/components/organisms/Footer.tsx`)

## Page Structure
```
HomePage
├── Header (Navigation + Auth Buttons)
├── Main Content
│   ├── HeroSection (Primary CTA)
│   ├── ToolsSection (Product Features with CTAs)
│   ├── FeaturesSection (Detailed Feature Descriptions)
└── Footer (Links & Copyright)
```

## Component Details

### Header Component
- **Purpose**: Main navigation and authentication actions
- **Authentication Buttons**:
  - "Get Started Now" - Opens signup modal via AuthModalContext
  - "Login" - Opens login modal via AuthModalContext
- **Conditional Rendering**:
  - Shows "Dashboard" and "Logout" buttons when user is authenticated
  - Shows "Get Started Now" and "Login" buttons when user is not authenticated
- **Navigation Links**:
  - Tools
  - Pricing
  - Resources
  - About
  - Customers

### HeroSection Component
- **Purpose**: Primary call-to-action to drive sign-ups
- **Interactions**:
  - "Get Started Now" button opens signup modal via AuthModalContext
- **Key Content**:
  - Main headline
  - Supporting text
  - Primary CTA button
  - Trial information text

### ToolsSection Component
- **Purpose**: Showcase core product tools/features
- **Structure**: Two ToolCard components in grid layout
- **Interactions**:
  - Each ToolCard has "Get Started Now" button that opens signup modal
- **Content**: 
  - Two feature cards with icons, titles, descriptions, and CTAs

### FeaturesSection Component
- **Purpose**: Detailed feature descriptions with visual aids
- **Structure**: Three Feature components
  - Feature 1: "Publish" - Content planning and management
  - Feature 2: "Analyze" - Analytics and reporting
  - Feature 3: "Engage" - Audience engagement
- **Interactions**:
  - Each feature has "View More" link that directs to feature detail page
  - Links follow pattern: `/features/[feature-name]`

### Footer Component
- **Purpose**: Navigation links and copyright information
- **Structure**: Four columns of links (Tools, Company, Support, Resources)
- **No authentication interactions** in the footer

## Authentication Flows

### Sign-up Flow
1. User clicks "Get Started Now" button (in Header, HeroSection, or ToolsSection)
2. AuthModalContext opens SignupForm modal
3. User completes form with full name, email, password
4. On successful form submission:
   - User data is stored (simulated in current implementation)
   - Authentication flag stored in localStorage
   - handleSuccessfulAuth redirects to Dashboard page

### Login Flow
1. User clicks "Login" button in Header
2. AuthModalContext opens LoginForm modal
3. User completes form with email and password
4. On successful form submission:
   - Authentication flag stored in localStorage
   - handleSuccessfulAuth redirects to Dashboard page

### Password Recovery Flow
1. User clicks "Forgot Password?" in login form
2. AuthModalContext switches to ForgotPasswordForm
3. User enters email address
4. On submission, success message shown (actual password reset would be handled by backend)

## Data Schema Requirements

### User Schema
```typescript
interface User {
  id: string;
  fullName: string;
  email: string;
  password: string; // Hashed on backend
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  role: 'user' | 'admin';
  trialEndDate?: Date;
  subscription?: {
    plan: 'free' | 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'canceled' | 'trial';
    billingCycle: 'monthly' | 'annual';
  };
}
```

### Authentication API Endpoints

#### Sign-up Endpoint
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

#### Login Endpoint
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

#### Password Reset Request Endpoint
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

## Frontend State Management

### AuthModalContext
- **Purpose**: Manages authentication modal state and transitions
- **State**:
  - `currentModal`: Controls which modal is displayed ('login', 'signup', 'forgot', or null)
- **Functions**:
  - `openModal`: Opens specified authentication modal
  - `closeModal`: Closes the modal
  - `handleSuccessfulAuth`: Processes successful authentication (stores user data and redirects)

### Authentication State
- Currently uses localStorage with 'isAuthenticated' flag
- More robust implementation would store JWT token and user data

## Routing
- Basic client-side routing implemented in App.tsx
- Two main routes:
  - `/` - HomePage
  - `/dashboard` - DashboardPage (protected, requires authentication)

## Future Enhancements
1. Implement proper routing with React Router
2. Add JWT authentication with token refresh
3. Create more robust API error handling
4. Add social media authentication options
5. Implement form validation with a library like Formik or React Hook Form

## Testing Considerations
- Unit tests for authentication flows
- Integration tests for form submission
- E2E tests for complete user journeys (signup → dashboard navigation) 