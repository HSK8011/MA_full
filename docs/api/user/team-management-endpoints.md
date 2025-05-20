# Team Management API

## Overview

The Team Management API provides endpoints for managing team members within the Marketing Automation platform. These endpoints enable account owners to invite new team members, assign roles and permissions, update existing members, and remove members from their team.

## Base URL

```
/api/team
```

## Authentication

All endpoints require authentication with a valid JWT token in the Authorization header:

```
Authorization: Bearer {token}
```

The authenticated user must have the appropriate permissions to manage team members.

## Endpoints

### 1. Get Team Members

Retrieves all team members for the authenticated user's account.

#### Request

```
GET /api/team/members
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| page | number | No | Page number for pagination (default: 1) |
| limit | number | No | Number of results per page (default: 20, max: 100) |
| role | string | No | Filter by role (Admin, Editor, Viewer) |

#### Response

- Status Code: 200 OK

```json
{
  "members": [
    {
      "id": "user_123456",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "Admin",
      "permissions": ["create_posts", "connect_accounts", "view_analytics"],
      "createdAt": "2023-11-15T10:30:00Z",
      "status": "active"
    },
    {
      "id": "user_789012",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "role": "Editor",
      "permissions": ["create_posts", "view_analytics"],
      "createdAt": "2023-11-16T14:45:00Z",
      "status": "active"
    }
  ],
  "pagination": {
    "total": 15,
    "pages": 3,
    "currentPage": 1,
    "limit": 10
  }
}
```

### 2. Invite Team Member

Invites a new user to join the team. An email invitation is sent to the specified email address.

#### Request

```
POST /api/team/invite
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |
| Content-Type | Yes | application/json |

#### Body Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| firstName | string | Yes | First name of the user |
| lastName | string | Yes | Last name of the user |
| email | string | Yes | Email address of the user |
| role | string | Yes | Role to assign (Admin, Editor, Viewer) |
| permissions | string[] | Yes | Array of permissions to grant |

#### Example Request Body

```json
{
  "firstName": "Alex",
  "lastName": "Johnson",
  "email": "alex.johnson@example.com",
  "role": "Editor",
  "permissions": ["create_posts", "connect_accounts"]
}
```

#### Response

- Status Code: 201 Created

```json
{
  "id": "invite_345678",
  "user": {
    "id": "user_345678",
    "firstName": "Alex",
    "lastName": "Johnson",
    "email": "alex.johnson@example.com",
    "role": "Editor",
    "permissions": ["create_posts", "connect_accounts"],
    "createdAt": "2023-11-20T09:15:00Z",
    "status": "pending"
  },
  "inviteSentAt": "2023-11-20T09:15:00Z",
  "expiresAt": "2023-11-27T09:15:00Z"
}
```

#### Error Responses

- Status Code: 400 Bad Request
  - Invalid or missing required fields
  - Email already in use

```json
{
  "error": "Bad Request",
  "message": "Email is already associated with an account",
  "code": "EMAIL_EXISTS"
}
```

- Status Code: 403 Forbidden
  - User does not have permission to invite team members

```json
{
  "error": "Forbidden",
  "message": "You do not have permission to invite team members",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

### 3. Update Team Member

Updates an existing team member's information, role, or permissions.

#### Request

```
PUT /api/team/members/:id
```

#### URL Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | User ID of the team member to update |

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |
| Content-Type | Yes | application/json |

#### Body Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| firstName | string | No | First name of the user |
| lastName | string | No | Last name of the user |
| role | string | No | Role to assign (Admin, Editor, Viewer) |
| permissions | string[] | No | Array of permissions to grant |

#### Example Request Body

```json
{
  "firstName": "Alexander",
  "lastName": "Johnson",
  "role": "Admin",
  "permissions": ["create_posts", "connect_accounts", "view_analytics"]
}
```

#### Response

- Status Code: 200 OK

```json
{
  "id": "user_345678",
  "firstName": "Alexander",
  "lastName": "Johnson",
  "email": "alex.johnson@example.com",
  "role": "Admin",
  "permissions": ["create_posts", "connect_accounts", "view_analytics"],
  "updatedAt": "2023-11-21T11:30:00Z",
  "status": "active"
}
```

#### Error Responses

- Status Code: 404 Not Found
  - Team member not found

```json
{
  "error": "Not Found",
  "message": "Team member with ID user_345678 not found",
  "code": "USER_NOT_FOUND"
}
```

- Status Code: 403 Forbidden
  - User does not have permission to update team members

```json
{
  "error": "Forbidden",
  "message": "You do not have permission to update team members",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

### 4. Remove Team Member

Removes a team member from the account.

#### Request

```
DELETE /api/team/members/:id
```

#### URL Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | User ID of the team member to remove |

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Response

- Status Code: 204 No Content

#### Error Responses

- Status Code: 404 Not Found
  - Team member not found

```json
{
  "error": "Not Found",
  "message": "Team member with ID user_345678 not found",
  "code": "USER_NOT_FOUND"
}
```

- Status Code: 403 Forbidden
  - User does not have permission to remove team members
  - Cannot remove account owner

```json
{
  "error": "Forbidden",
  "message": "Cannot remove the account owner",
  "code": "CANNOT_REMOVE_OWNER"
}
```

### 5. Resend Invitation

Resends an invitation email to a pending team member.

#### Request

```
POST /api/team/invite/:id/resend
```

#### URL Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Invitation ID to resend |

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Response

- Status Code: 200 OK

```json
{
  "id": "invite_345678",
  "user": {
    "id": "user_345678",
    "email": "alex.johnson@example.com",
    "status": "pending"
  },
  "inviteSentAt": "2023-11-22T15:20:00Z",
  "expiresAt": "2023-11-29T15:20:00Z"
}
```

#### Error Responses

- Status Code: 404 Not Found
  - Invitation not found

```json
{
  "error": "Not Found",
  "message": "Invitation with ID invite_345678 not found",
  "code": "INVITE_NOT_FOUND"
}
```

- Status Code: 400 Bad Request
  - Invitation already accepted or expired

```json
{
  "error": "Bad Request",
  "message": "Invitation has already been accepted",
  "code": "INVITE_ALREADY_ACCEPTED"
}
```

## Role-Based Access Control

The Team Management API implements role-based access control with the following default roles:

### Admin
- Full access to all features
- Can invite, update, and remove team members
- Can assign any role up to their own level

### Editor
- Cannot manage team members
- Can create and edit content
- Has access to analytics depending on permissions

### Viewer
- Read-only access
- Cannot create or edit content
- Can view content and analytics depending on permissions

## Permission Definitions

| Permission | Description |
|------------|-------------|
| create_posts | Ability to create and schedule social media posts |
| connect_accounts | Ability to connect and manage social media accounts |
| view_analytics | Access to view analytics and reporting data |

## Data Models

### User

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  permissions: string[];
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  status: 'active' | 'pending' | 'inactive';
}
```

### Invitation

```typescript
interface Invitation {
  id: string;
  user: {
    id: string;
    email: string;
    status: 'pending';
  };
  inviteSentAt: string; // ISO date string
  expiresAt: string; // ISO date string
}
```

## Rate Limiting

These endpoints are subject to rate limiting:
- 100 requests per minute for GET operations
- 20 requests per minute for POST, PUT, DELETE operations

Exceeding these limits will result in a 429 Too Many Requests response.

## Webhook Notifications

When team member changes occur, webhook notifications can be sent to configured endpoints:

- `team.member.invited`: When a new team member is invited
- `team.member.updated`: When a team member's details or permissions are updated
- `team.member.removed`: When a team member is removed from the team 

## Overview

The Team Management API provides endpoints for managing team members within the Marketing Automation platform. These endpoints enable account owners to invite new team members, assign roles and permissions, update existing members, and remove members from their team.

## Base URL

```
/api/team
```

## Authentication

All endpoints require authentication with a valid JWT token in the Authorization header:

```
Authorization: Bearer {token}
```

The authenticated user must have the appropriate permissions to manage team members.

## Endpoints

### 1. Get Team Members

Retrieves all team members for the authenticated user's account.

#### Request

```
GET /api/team/members
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| page | number | No | Page number for pagination (default: 1) |
| limit | number | No | Number of results per page (default: 20, max: 100) |
| role | string | No | Filter by role (Admin, Editor, Viewer) |

#### Response

- Status Code: 200 OK

```json
{
  "members": [
    {
      "id": "user_123456",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "Admin",
      "permissions": ["create_posts", "connect_accounts", "view_analytics"],
      "createdAt": "2023-11-15T10:30:00Z",
      "status": "active"
    },
    {
      "id": "user_789012",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "role": "Editor",
      "permissions": ["create_posts", "view_analytics"],
      "createdAt": "2023-11-16T14:45:00Z",
      "status": "active"
    }
  ],
  "pagination": {
    "total": 15,
    "pages": 3,
    "currentPage": 1,
    "limit": 10
  }
}
```

### 2. Invite Team Member

Invites a new user to join the team. An email invitation is sent to the specified email address.

#### Request

```
POST /api/team/invite
```

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |
| Content-Type | Yes | application/json |

#### Body Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| firstName | string | Yes | First name of the user |
| lastName | string | Yes | Last name of the user |
| email | string | Yes | Email address of the user |
| role | string | Yes | Role to assign (Admin, Editor, Viewer) |
| permissions | string[] | Yes | Array of permissions to grant |

#### Example Request Body

```json
{
  "firstName": "Alex",
  "lastName": "Johnson",
  "email": "alex.johnson@example.com",
  "role": "Editor",
  "permissions": ["create_posts", "connect_accounts"]
}
```

#### Response

- Status Code: 201 Created

```json
{
  "id": "invite_345678",
  "user": {
    "id": "user_345678",
    "firstName": "Alex",
    "lastName": "Johnson",
    "email": "alex.johnson@example.com",
    "role": "Editor",
    "permissions": ["create_posts", "connect_accounts"],
    "createdAt": "2023-11-20T09:15:00Z",
    "status": "pending"
  },
  "inviteSentAt": "2023-11-20T09:15:00Z",
  "expiresAt": "2023-11-27T09:15:00Z"
}
```

#### Error Responses

- Status Code: 400 Bad Request
  - Invalid or missing required fields
  - Email already in use

```json
{
  "error": "Bad Request",
  "message": "Email is already associated with an account",
  "code": "EMAIL_EXISTS"
}
```

- Status Code: 403 Forbidden
  - User does not have permission to invite team members

```json
{
  "error": "Forbidden",
  "message": "You do not have permission to invite team members",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

### 3. Update Team Member

Updates an existing team member's information, role, or permissions.

#### Request

```
PUT /api/team/members/:id
```

#### URL Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | User ID of the team member to update |

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |
| Content-Type | Yes | application/json |

#### Body Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| firstName | string | No | First name of the user |
| lastName | string | No | Last name of the user |
| role | string | No | Role to assign (Admin, Editor, Viewer) |
| permissions | string[] | No | Array of permissions to grant |

#### Example Request Body

```json
{
  "firstName": "Alexander",
  "lastName": "Johnson",
  "role": "Admin",
  "permissions": ["create_posts", "connect_accounts", "view_analytics"]
}
```

#### Response

- Status Code: 200 OK

```json
{
  "id": "user_345678",
  "firstName": "Alexander",
  "lastName": "Johnson",
  "email": "alex.johnson@example.com",
  "role": "Admin",
  "permissions": ["create_posts", "connect_accounts", "view_analytics"],
  "updatedAt": "2023-11-21T11:30:00Z",
  "status": "active"
}
```

#### Error Responses

- Status Code: 404 Not Found
  - Team member not found

```json
{
  "error": "Not Found",
  "message": "Team member with ID user_345678 not found",
  "code": "USER_NOT_FOUND"
}
```

- Status Code: 403 Forbidden
  - User does not have permission to update team members

```json
{
  "error": "Forbidden",
  "message": "You do not have permission to update team members",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

### 4. Remove Team Member

Removes a team member from the account.

#### Request

```
DELETE /api/team/members/:id
```

#### URL Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | User ID of the team member to remove |

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Response

- Status Code: 204 No Content

#### Error Responses

- Status Code: 404 Not Found
  - Team member not found

```json
{
  "error": "Not Found",
  "message": "Team member with ID user_345678 not found",
  "code": "USER_NOT_FOUND"
}
```

- Status Code: 403 Forbidden
  - User does not have permission to remove team members
  - Cannot remove account owner

```json
{
  "error": "Forbidden",
  "message": "Cannot remove the account owner",
  "code": "CANNOT_REMOVE_OWNER"
}
```

### 5. Resend Invitation

Resends an invitation email to a pending team member.

#### Request

```
POST /api/team/invite/:id/resend
```

#### URL Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Invitation ID to resend |

#### Headers

| Name | Required | Description |
|------|----------|-------------|
| Authorization | Yes | JWT token in format: `Bearer {token}` |

#### Response

- Status Code: 200 OK

```json
{
  "id": "invite_345678",
  "user": {
    "id": "user_345678",
    "email": "alex.johnson@example.com",
    "status": "pending"
  },
  "inviteSentAt": "2023-11-22T15:20:00Z",
  "expiresAt": "2023-11-29T15:20:00Z"
}
```

#### Error Responses

- Status Code: 404 Not Found
  - Invitation not found

```json
{
  "error": "Not Found",
  "message": "Invitation with ID invite_345678 not found",
  "code": "INVITE_NOT_FOUND"
}
```

- Status Code: 400 Bad Request
  - Invitation already accepted or expired

```json
{
  "error": "Bad Request",
  "message": "Invitation has already been accepted",
  "code": "INVITE_ALREADY_ACCEPTED"
}
```

## Role-Based Access Control

The Team Management API implements role-based access control with the following default roles:

### Admin
- Full access to all features
- Can invite, update, and remove team members
- Can assign any role up to their own level

### Editor
- Cannot manage team members
- Can create and edit content
- Has access to analytics depending on permissions

### Viewer
- Read-only access
- Cannot create or edit content
- Can view content and analytics depending on permissions

## Permission Definitions

| Permission | Description |
|------------|-------------|
| create_posts | Ability to create and schedule social media posts |
| connect_accounts | Ability to connect and manage social media accounts |
| view_analytics | Access to view analytics and reporting data |

## Data Models

### User

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  permissions: string[];
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  status: 'active' | 'pending' | 'inactive';
}
```

### Invitation

```typescript
interface Invitation {
  id: string;
  user: {
    id: string;
    email: string;
    status: 'pending';
  };
  inviteSentAt: string; // ISO date string
  expiresAt: string; // ISO date string
}
```

## Rate Limiting

These endpoints are subject to rate limiting:
- 100 requests per minute for GET operations
- 20 requests per minute for POST, PUT, DELETE operations

Exceeding these limits will result in a 429 Too Many Requests response.

## Webhook Notifications

When team member changes occur, webhook notifications can be sent to configured endpoints:

- `team.member.invited`: When a new team member is invited
- `team.member.updated`: When a team member's details or permissions are updated
- `team.member.removed`: When a team member is removed from the team 