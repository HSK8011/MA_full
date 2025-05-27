# Marketing Automation Tool - Entity Relationship Diagram

```mermaid
%%% ER Diagram for Marketing Automation Tool

erDiagram
    User ||--o{ SocialAccount : "connects"
    User ||--o{ Post : "creates"
    User ||--o{ QueueSettings : "configures"
    User ||--o{ AnalyticsData : "views"
    User }o--o{ Team : "belongs to"
    User ||--o{ TeamInvitation : "sends"
    User ||--o{ UserPermission : "has"
    User ||--o{ UserActivityLog : "generates"
    User ||--o{ NotificationPreference : "sets"
    User ||--o{ TwoFactorRecoveryCode : "generates"
    Team ||--o{ TeamInvitation : "has"
    Post }o--o{ QueueSettings : "uses"
    SocialAccount ||--o{ Post : "publishes to"
    SocialAccount ||--o{ AnalyticsData : "provides"
    Post ||--o{ AnalyticsData : "generates"
    
    User {
        string id PK
        string name
        string first_name
        string last_name
        string email
        string password
        string phone
        string timezone
        string subscription_plan
        string subscription_status
        date subscription_expiry
        date created_at
        date updated_at
        date last_login_at
        boolean is_email_verified
        string verification_token
        string reset_password_token
        date reset_password_expires
        string avatar_url
        string account_type
        string company_name
        string company_size
        boolean two_factor_enabled
        string two_factor_secret
        boolean activity_logs_enabled
        date last_password_change
        json preferences
        string role
        string team_id FK
        string status
    }
    
    SocialAccount {
        string id PK
        string user_id FK
        string platform
        string account_id
        string username
        string display_name
        string profile_image_url
        string access_token
        string refresh_token
        date token_expires_at
        boolean is_active
        date last_synced_at
        date created_at
        date updated_at
        json meta
    }
    
    Post {
        string id PK
        string user_id FK
        string title
        string content
        string[] media_urls
        string[] platforms
        string status
        date scheduled_time
        date published_time
        date created_at
        date updated_at
        string queue_settings_id FK
        json meta
    }
    
    Team {
        string id PK
        string name
        string owner_id FK
        date created_at
        date updated_at
        number plan_seats
        number used_seats
        json settings
        string billing_contact_id FK
    }
    
    QueueSettings {
        string id PK
        string user_id FK
        string name
        boolean is_active
        string[] platforms
        json time_slots
        date created_at
        date updated_at
        string[] account_ids
        string time_zone
    }
    
    AnalyticsData {
        string id PK
        string user_id FK
        string account_id FK
        string post_id FK
        string platform
        string period
        date start_date
        date end_date
        json metrics
        date created_at
        date updated_at
    }
    
    TeamInvitation {
        string id PK
        string team_id FK
        string invited_by_id FK
        string email
        string first_name
        string last_name
        string role
        string[] permissions
        date created_at
        date expires_at
        string status
        string invitation_token
        date last_sent_at
    }
    
    UserPermission {
        string id PK
        string user_id FK
        string permission
        string granted_by_id FK
        date granted_at
        date revoked_at
        boolean is_active
    }
    
    NotificationPreference {
        string id PK
        string user_id FK
        string notification_type
        string type_display_name
        string description
        boolean email_enabled
        boolean desktop_enabled
        date created_at
        date updated_at
    }
    
    UserActivityLog {
        string id PK
        string user_id FK
        string activity_type
        date timestamp
        string ip_address
        string user_agent
        string status
        json details
    }
    
    TwoFactorRecoveryCode {
        string id PK
        string user_id FK
        string code
        boolean is_used
        date used_at
        date created_at
        date expires_at
    }
```

## Legend

- **PK**: Primary Key
- **FK**: Foreign Key
- **||--o{**: One-to-many relationship
- **}o--o{**: Many-to-many relationship

## Relationship Descriptions

1. **User to SocialAccount**: One user can connect many social accounts
2. **User to Post**: One user can create many posts
3. **User to QueueSettings**: One user can configure many queue settings
4. **User to Team**: Many users can belong to one team, and a user may be a team owner
5. **User to TeamInvitation**: One user can send many team invitations
6. **SocialAccount to Post**: One social account can have many posts published to it
7. **Post to QueueSettings**: Many posts can use the same queue settings
8. **SocialAccount to AnalyticsData**: One social account can generate many analytics records
9. **Post to AnalyticsData**: One post can generate many analytics records 