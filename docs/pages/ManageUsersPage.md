# Manage Users Page

## Overview

The Manage Users page allows the main account owner to invite team members and manage access permissions for their marketing automation account. This page provides functionality to add new users, edit existing users' permissions, and remove users from the account.

## Page Purpose

The primary purpose of this page is to facilitate team collaboration by:
- Allowing account owners to invite new team members
- Assigning specific roles (Admin, Editor, Viewer) to team members
- Configuring granular permissions for each team member
- Managing the team roster (viewing, editing, and removing members)

## URL Path

```
/manage-users
```

## Page Components

### 1. ManageUsers (Page Component)
- **File**: `src/pages/ManageUsers.tsx`
- **Purpose**: Container component that handles authentication checking and loads the ManageUsersContent component
- **State**:
  - `isLoading`: Boolean to track authentication verification

### 2. ManageUsersContent (Organism Component)
- **File**: `src/components/organisms/ManageUsers/ManageUsersContent.tsx`
- **Purpose**: Main content component that displays and manages the user list and operations
- **State**:
  - `users`: Array of team members with their details and permissions
  - `searchQuery`: String for filtering the user list
  - `isModalOpen`: Boolean to control the visibility of the Add/Edit user modal
  - `isEditing`: Boolean to determine if in add or edit mode
  - `userForm`: Object containing the form data for adding/editing a user

### 3. User Search Bar
- Allows filtering users by name or email
- Updates the filtered list in real-time as the user types

### 4. Add User Button
- Opens the Add User modal when clicked
- Located in the top-right corner of the page

### 5. User List Table
- Displays all team members with columns for:
  - User Name (First Name + Last Name)
  - Email Address
  - Permissions (displayed as tags)
  - Actions (Edit, Delete)

### 6. User Modal (Add/Edit)
- Used for both adding new users and editing existing ones
- Fields:
  - First Name (required)
  - Last Name (required)
  - Email Address (required)
  - Role Dropdown (Admin, Editor, Viewer)
  - Permission Checkboxes:
    - Create Posts
    - Connect Accounts
    - View Analytics
  - Action Buttons:
    - Cancel: Closes the modal without saving
    - Send Invite/Save Changes: Submits the form

## User Flows

### Adding a New Team Member
1. User clicks "Add New User" button
2. The Add User modal appears
3. User fills in the required fields (First Name, Last Name, Email)
4. User selects a role from the dropdown
5. User selects the appropriate permissions
6. User clicks "Send Invite"
7. The system creates the account and sends an invitation email to the new team member
8. The modal closes, and the new user appears in the user list

### Editing a Team Member
1. User clicks the edit icon for a team member
2. The Edit User modal appears with pre-populated fields
3. User modifies the desired fields
4. User clicks "Save Changes"
5. The system updates the user's information and permissions
6. The modal closes, and the updated information is displayed in the user list

### Removing a Team Member
1. User clicks the delete icon for a team member
2. A confirmation dialog appears
3. If confirmed, the user is removed from the team
4. The user list is updated to reflect the change

### Searching for Team Members
1. User enters text in the search field
2. The user list filters in real-time to show only matching users
3. When the search field is cleared, all users are displayed

## Permissions System

### User Roles
- **Admin**: Full access to all features and settings
- **Editor**: Can create and edit content but cannot manage team members
- **Viewer**: Read-only access to analytics and content

### Granular Permissions
- **Create Posts**: Ability to create and schedule social media posts
- **Connect Accounts**: Ability to connect/disconnect social media accounts
- **View Analytics**: Access to view analytics and reporting data

## Data Model

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  permissions: Array<'create_posts' | 'connect_accounts' | 'view_analytics'>;
}
```

## API Endpoints

This page interacts with the following API endpoints:

- `GET /api/team/members` - Retrieve all team members
- `POST /api/team/invite` - Send an invitation to a new team member
- `PUT /api/team/members/:id` - Update a team member's information and permissions
- `DELETE /api/team/members/:id` - Remove a team member from the team

For detailed API specifications, see [Team Management API Documentation](../api/user/team-management-endpoints.md).

## Design and UX Considerations

- The user list provides clear visual cues for different permission levels
- The modal uses a clean, focused design to simplify the invitation process
- Real-time search functionality improves user experience when managing large teams
- The edit flow pre-populates all fields to minimize user effort when making small changes
- Confirmation is required for destructive actions like removing team members

## Related Components

- [DashboardHeader](./components/DashboardHeader.md) - Contains the navigation item to access this page
- [DashboardTemplate](./components/DashboardTemplate.md) - Parent layout component

## Future Enhancements

- Team activity logs to track changes to the team
- Bulk user management (invite multiple users, bulk permission changes)
- Custom role creation with granular permission management
- Team hierarchies with sub-teams
- User status indicators (active, pending invitation, inactive) 

## Overview

The Manage Users page allows the main account owner to invite team members and manage access permissions for their marketing automation account. This page provides functionality to add new users, edit existing users' permissions, and remove users from the account.

## Page Purpose

The primary purpose of this page is to facilitate team collaboration by:
- Allowing account owners to invite new team members
- Assigning specific roles (Admin, Editor, Viewer) to team members
- Configuring granular permissions for each team member
- Managing the team roster (viewing, editing, and removing members)

## URL Path

```
/manage-users
```

## Page Components

### 1. ManageUsers (Page Component)
- **File**: `src/pages/ManageUsers.tsx`
- **Purpose**: Container component that handles authentication checking and loads the ManageUsersContent component
- **State**:
  - `isLoading`: Boolean to track authentication verification

### 2. ManageUsersContent (Organism Component)
- **File**: `src/components/organisms/ManageUsers/ManageUsersContent.tsx`
- **Purpose**: Main content component that displays and manages the user list and operations
- **State**:
  - `users`: Array of team members with their details and permissions
  - `searchQuery`: String for filtering the user list
  - `isModalOpen`: Boolean to control the visibility of the Add/Edit user modal
  - `isEditing`: Boolean to determine if in add or edit mode
  - `userForm`: Object containing the form data for adding/editing a user

### 3. User Search Bar
- Allows filtering users by name or email
- Updates the filtered list in real-time as the user types

### 4. Add User Button
- Opens the Add User modal when clicked
- Located in the top-right corner of the page

### 5. User List Table
- Displays all team members with columns for:
  - User Name (First Name + Last Name)
  - Email Address
  - Permissions (displayed as tags)
  - Actions (Edit, Delete)

### 6. User Modal (Add/Edit)
- Used for both adding new users and editing existing ones
- Fields:
  - First Name (required)
  - Last Name (required)
  - Email Address (required)
  - Role Dropdown (Admin, Editor, Viewer)
  - Permission Checkboxes:
    - Create Posts
    - Connect Accounts
    - View Analytics
  - Action Buttons:
    - Cancel: Closes the modal without saving
    - Send Invite/Save Changes: Submits the form

## User Flows

### Adding a New Team Member
1. User clicks "Add New User" button
2. The Add User modal appears
3. User fills in the required fields (First Name, Last Name, Email)
4. User selects a role from the dropdown
5. User selects the appropriate permissions
6. User clicks "Send Invite"
7. The system creates the account and sends an invitation email to the new team member
8. The modal closes, and the new user appears in the user list

### Editing a Team Member
1. User clicks the edit icon for a team member
2. The Edit User modal appears with pre-populated fields
3. User modifies the desired fields
4. User clicks "Save Changes"
5. The system updates the user's information and permissions
6. The modal closes, and the updated information is displayed in the user list

### Removing a Team Member
1. User clicks the delete icon for a team member
2. A confirmation dialog appears
3. If confirmed, the user is removed from the team
4. The user list is updated to reflect the change

### Searching for Team Members
1. User enters text in the search field
2. The user list filters in real-time to show only matching users
3. When the search field is cleared, all users are displayed

## Permissions System

### User Roles
- **Admin**: Full access to all features and settings
- **Editor**: Can create and edit content but cannot manage team members
- **Viewer**: Read-only access to analytics and content

### Granular Permissions
- **Create Posts**: Ability to create and schedule social media posts
- **Connect Accounts**: Ability to connect/disconnect social media accounts
- **View Analytics**: Access to view analytics and reporting data

## Data Model

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  permissions: Array<'create_posts' | 'connect_accounts' | 'view_analytics'>;
}
```

## API Endpoints

This page interacts with the following API endpoints:

- `GET /api/team/members` - Retrieve all team members
- `POST /api/team/invite` - Send an invitation to a new team member
- `PUT /api/team/members/:id` - Update a team member's information and permissions
- `DELETE /api/team/members/:id` - Remove a team member from the team

For detailed API specifications, see [Team Management API Documentation](../api/user/team-management-endpoints.md).

## Design and UX Considerations

- The user list provides clear visual cues for different permission levels
- The modal uses a clean, focused design to simplify the invitation process
- Real-time search functionality improves user experience when managing large teams
- The edit flow pre-populates all fields to minimize user effort when making small changes
- Confirmation is required for destructive actions like removing team members

## Related Components

- [DashboardHeader](./components/DashboardHeader.md) - Contains the navigation item to access this page
- [DashboardTemplate](./components/DashboardTemplate.md) - Parent layout component

## Future Enhancements

- Team activity logs to track changes to the team
- Bulk user management (invite multiple users, bulk permission changes)
- Custom role creation with granular permission management
- Team hierarchies with sub-teams
- User status indicators (active, pending invitation, inactive) 