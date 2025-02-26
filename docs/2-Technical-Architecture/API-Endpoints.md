# API Endpoint Specifications

## Authentication Endpoints

### POST /auth/register
Create a new user account.
```
Request: {
  "email": string,
  "password": string,
  "first_name": string,
  "last_name": string
}

Response: {
  "user": User,
  "session": Session
}
```

### POST /auth/login
Authenticate a user.
```
Request: {
  "email": string,
  "password": string
}

Response: {
  "user": User,
  "session": Session
}
```

### POST /auth/logout
End the current session.
```
Request: {}

Response: {
  "success": boolean
}
```

### GET /auth/session
Get current session information.
```
Request: {}

Response: {
  "user": User,
  "session": Session
}
```

### POST /auth/oauth/connect
Connect an OAuth provider (Google, Microsoft).
```
Request: {
  "provider": string,
  "code": string,
  "redirect_uri": string
}

Response: {
  "success": boolean,
  "provider_details": object
}
```

## User and Family Endpoints

### GET /users/me
Get current user profile.
```
Request: {}

Response: {
  "user": User,
  "preferences": object
}
```

### PATCH /users/me
Update current user profile.
```
Request: {
  "first_name": string,
  "last_name": string,
  "avatar_url": string,
  "preferences": object
}

Response: {
  "user": User
}
```

### GET /families
List all families for current user.
```
Request: {}

Response: {
  "families": Family[]
}
```

### POST /families
Create a new family.
```
Request: {
  "name": string,
  "description": string
}

Response: {
  "family": Family
}
```

### GET /families/:id
Get family details.
```
Request: {}

Response: {
  "family": Family,
  "members": FamilyMember[]
}
```

### POST /families/:id/members
Add a member to family.
```
Request: {
  "email": string,
  "role": string
}

Response: {
  "success": boolean,
  "invitation": object
}
```

## Document Endpoints

### GET /documents
List documents with filtering.
```
Request: {
  query: {
    "family_id": string,
    "tag_ids": string[],
    "search": string,
    "start_date": string,
    "end_date": string,
    "page": number,
    "limit": number
  }
}

Response: {
  "documents": Document[],
  "total": number,
  "page": number,
  "pages": number
}
```

### POST /documents
Create a new document record.
```
Request: {
  "title": string,
  "description": string,
  "family_id": string,
  "metadata": object,
  "tags": string[]
}

Response: {
  "document": Document,
  "upload_url": string
}
```

### GET /documents/:id
Get document details.
```
Request: {}

Response: {
  "document": Document,
  "tags": Tag[],
  "related_documents": Document[]
}
```

### PUT /documents/:id
Update document metadata.
```
Request: {
  "title": string,
  "description": string,
  "metadata": object
}

Response: {
  "document": Document
}
```

### DELETE /documents/:id
Delete a document.
```
Request: {}

Response: {
  "success": boolean
}
```

### GET /documents/:id/content
Get document content or download URL.
```
Request: {}

Response: {
  "download_url": string,
  "content_type": string,
  "expires_at": string
}
```

### POST /documents/:id/tags
Add tags to a document.
```
Request: {
  "tag_ids": string[]
}

Response: {
  "document": Document,
  "tags": Tag[]
}
```

## Tag Endpoints

### GET /tags
List all tags for a family.
```
Request: {
  query: {
    "family_id": string
  }
}

Response: {
  "tags": Tag[]
}
```

### POST /tags
Create a new tag.
```
Request: {
  "name": string,
  "color": string,
  "category": string,
  "family_id": string
}

Response: {
  "tag": Tag
}
```

## Calendar Endpoints

### GET /calendars
List all calendars for current user.
```
Request: {}

Response: {
  "calendars": Calendar[]
}
```

### POST /calendars/connect
Connect a new calendar.
```
Request: {
  "provider": string,
  "name": string,
  "color": string
}

Response: {
  "calendar": Calendar,
  "auth_url": string
}
```

### GET /events
List events with filtering.
```
Request: {
  query: {
    "calendar_ids": string[],
    "start_date": string,
    "end_date": string,
    "search": string
  }
}

Response: {
  "events": Event[]
}
```

### POST /events
Create a new event.
```
Request: {
  "title": string,
  "description": string,
  "start_time": string,
  "end_time": string,
  "location": string,
  "calendar_id": string,
  "all_day": boolean,
  "recurrence_rule": string,
  "attendees": {
    "email": string,
    "name": string
  }[]
}

Response: {
  "event": Event
}
```

### GET /events/:id
Get event details.
```
Request: {}

Response: {
  "event": Event,
  "attendees": Attendee[]
}
```

## Email Endpoints

### GET /email-accounts
List connected email accounts.
```
Request: {}

Response: {
  "accounts": EmailAccount[]
}
```

### POST /email-accounts/connect
Connect a new email account.
```
Request: {
  "provider": string
}

Response: {
  "account": EmailAccount,
  "auth_url": string
}
```

### GET /emails
List emails with filtering.
```
Request: {
  query: {
    "account_id": string,
    "labels": string[],
    "search": string,
    "start_date": string,
    "end_date": string,
    "is_read": boolean,
    "has_attachments": boolean,
    "page": number,
    "limit": number
  }
}

Response: {
  "emails": Email[],
  "total": number,
  "page": number,
  "pages": number
}
```

### GET /emails/:id
Get email details.
```
Request: {}

Response: {
  "email": Email,
  "attachments": Attachment[]
}
```

### POST /emails/:id/save-attachment
Save an email attachment as a document.
```
Request: {
  "attachment_id": string,
  "document_title": string,
  "family_id": string,
  "tags": string[]
}

Response: {
  "document": Document
}
```

## Notification Endpoints

### GET /notifications
List notifications for current user.
```
Request: {
  query: {
    "status": string,
    "page": number,
    "limit": number
  }
}

Response: {
  "notifications": Notification[],
  "total": number,
  "unread": number
}
```

### POST /notifications/:id/read
Mark a notification as read.
```
Request: {}

Response: {
  "success": boolean
}
```

## Automation Endpoints

### GET /automations
List automations for a family.
```
Request: {
  query: {
    "family_id": string
  }
}

Response: {
  "automations": Automation[]
}
```

### POST /automations
Create a new automation.
```
Request: {
  "name": string,
  "description": string,
  "trigger_type": string,
  "trigger_config": object,
  "action_type": string,
  "action_config": object,
  "family_id": string
}

Response: {
  "automation": Automation
}
```

### PUT /automations/:id/toggle
Enable or disable an automation.
```
Request: {
  "is_active": boolean
}

Response: {
  "automation": Automation
}
```

## Dashboard Endpoints

### GET /dashboard
Get dashboard data.
```
Request: {}

Response: {
  "upcoming_events": Event[],
  "recent_documents": Document[],
  "important_emails": Email[],
  "notifications": Notification[],
  "family_activity": Activity[]
}
```

## Search Endpoint

### GET /search
Global search across all data types.
```
Request: {
  query: {
    "q": string,
    "types": string[],
    "family_id": string
  }
}

Response: {
  "results": {
    "documents": Document[],
    "events": Event[],
    "emails": Email[]
  }
}
```