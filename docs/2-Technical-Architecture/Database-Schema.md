erDiagram
    USERS {
        uuid id PK
        string email
        string first_name
        string last_name
        string avatar_url
        datetime created_at
        string role
        jsonb preferences
    }
    
    FAMILIES {
        uuid id PK
        string name
        string description
        datetime created_at
        uuid created_by FK
    }
    
    FAMILY_MEMBERS {
        uuid id PK
        uuid family_id FK
        uuid user_id FK
        string role
        datetime joined_at
        jsonb preferences
    }
    
    DOCUMENTS {
        uuid id PK
        string title
        string description
        string file_path
        string file_type
        int file_size
        datetime created_at
        uuid created_by FK
        uuid family_id FK
        jsonb metadata
        string status
    }
    
    DOCUMENT_TAGS {
        uuid id PK
        uuid document_id FK
        uuid tag_id FK
        datetime created_at
        uuid created_by FK
    }
    
    TAGS {
        uuid id PK
        string name
        string color
        string category
        uuid family_id FK
        datetime created_at
    }
    
    CALENDARS {
        uuid id PK
        string name
        string provider
        string provider_id
        string access_token
        string refresh_token
        datetime token_expires
        uuid user_id FK
        boolean is_primary
        string color
        datetime last_synced
    }
    
    EVENTS {
        uuid id PK
        string title
        text description
        datetime start_time
        datetime end_time
        string location
        uuid calendar_id FK
        string provider_event_id
        boolean all_day
        string recurrence_rule
        jsonb metadata
        string status
    }
    
    EVENT_ATTENDEES {
        uuid id PK
        uuid event_id FK
        uuid user_id FK
        string status
        datetime notified_at
    }
    
    EMAIL_ACCOUNTS {
        uuid id PK
        string email
        string provider
        string access_token
        string refresh_token
        datetime token_expires
        uuid user_id FK
        datetime last_synced
    }
    
    EMAILS {
        uuid id PK
        string subject
        text body_text
        text body_html
        string sender
        string[] recipients
        datetime received_at
        uuid email_account_id FK
        string provider_email_id
        boolean is_read
        boolean is_important
        string[] labels
        jsonb metadata
    }
    
    EMAIL_ATTACHMENTS {
        uuid id PK
        uuid email_id FK
        string filename
        string file_path
        string file_type
        int file_size
        uuid document_id FK
    }
    
    NOTIFICATIONS {
        uuid id PK
        string title
        text body
        string type
        string status
        datetime created_at
        datetime read_at
        uuid user_id FK
        string source_type
        uuid source_id
    }
    
    AUTOMATIONS {
        uuid id PK
        string name
        string description
        string trigger_type
        jsonb trigger_config
        string action_type
        jsonb action_config
        boolean is_active
        uuid created_by FK
        uuid family_id FK
        datetime last_triggered
    }
    
    USERS ||--o{ FAMILY_MEMBERS : "belongs to"
    FAMILIES ||--o{ FAMILY_MEMBERS : "has"
    FAMILIES ||--o{ DOCUMENTS : "owns"
    FAMILIES ||--o{ TAGS : "has"
    USERS ||--o{ DOCUMENTS : "creates"
    DOCUMENTS ||--o{ DOCUMENT_TAGS : "has"
    TAGS ||--o{ DOCUMENT_TAGS : "used in"
    USERS ||--o{ CALENDARS : "owns"
    CALENDARS ||--o{ EVENTS : "contains"
    EVENTS ||--o{ EVENT_ATTENDEES : "has"
    USERS ||--o{ EVENT_ATTENDEES : "attends"
    USERS ||--o{ EMAIL_ACCOUNTS : "owns"
    EMAIL_ACCOUNTS ||--o{ EMAILS : "contains"
    EMAILS ||--o{ EMAIL_ATTACHMENTS : "has"
    EMAIL_ATTACHMENTS ||--o{ DOCUMENTS : "links to"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ AUTOMATIONS : "creates"
    FAMILIES ||--o{ AUTOMATIONS : "uses"