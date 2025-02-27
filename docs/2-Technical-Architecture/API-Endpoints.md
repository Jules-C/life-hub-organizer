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
  "document_type_id": string,
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

## Document Types Endpoints

### GET /document-types
List available document types.
```
Request: {
  query: {
    "family_id": string,
    "include_system": boolean,
    "page": number,
    "limit": number
  }
}

Response: {
  "documentTypes": DocumentType[],
  "total": number,
  "page": number,
  "pages": number
}
```

### POST /document-types
Create a new document type.
```
Request: {
  "name": string,
  "description": string,
  "icon": string,
  "metadata_schema": object,
  "family_id": string
}

Response: {
  "documentType": DocumentType
}
```

### GET /document-types/:id
Get document type details.
```
Request: {}

Response: {
  "documentType": DocumentType,
  "usageCount": number
}
```

### PUT /document-types/:id
Update a document type.
```
Request: {
  "name": string,
  "description": string,
  "icon": string,
  "metadata_schema": object
}

Response: {
  "documentType": DocumentType
}
```

### DELETE /document-types/:id
Delete a document type.
```
Request: {}

Response: {
  "success": boolean
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

## Health Tracking Endpoints

### GET /health/cycle-entries
List cycle tracking entries with filtering.
```
Request: {
  query: {
    "start_date": string,
    "end_date": string,
    "page": number,
    "limit": number
  }
}

Response: {
  "entries": CycleEntry[],
  "total": number,
  "page": number,
  "pages": number
}
```

### POST /health/cycle-entries
Create a new cycle tracking entry.
```
Request: {
  "start_date": string,
  "end_date": string,
  "flow_intensity": number,
  "symptoms": object,
  "notes": string,
  "is_private": boolean
}

Response: {
  "entry": CycleEntry
}
```

### GET /health/cycle-entries/:id
Get cycle entry details.
```
Request: {}

Response: {
  "entry": CycleEntry
}
```

### PUT /health/cycle-entries/:id
Update a cycle entry.
```
Request: {
  "end_date": string,
  "flow_intensity": number,
  "symptoms": object,
  "notes": string,
  "is_private": boolean
}

Response: {
  "entry": CycleEntry
}
```

### DELETE /health/cycle-entries/:id
Delete a cycle entry.
```
Request: {}

Response: {
  "success": boolean
}
```

### GET /health/cycle-predictions
Get cycle predictions based on historical data.
```
Request: {}

Response: {
  "predicted_start_date": string,
  "average_cycle_length": number,
  "confidence": number
}
```

### GET /health/cycle-entries/documents
Associate medical documents with cycle tracking entries.
```
Request: {
  query: {
    "entry_id": string
  }
}

Response: {
  "documents": Document[]
}
```

### POST /health/cycle-entries/:id/documents
Link a document to a cycle tracking entry.
```
Request: {
  "document_id": string
}

Response: {
  "success": boolean
}
```

### GET /health/export
Export health data in a standardized format.
```
Request: {
  query: {
    "format": string, // "pdf", "csv", "json"
    "start_date": string,
    "end_date": string,
    "include_documents": boolean
  }
}

Response: {
  "download_url": string,
  "expires_at": string
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

### GET /calendar/availability
Get family member availability with privacy controls.
```
Request: {
  query: {
    "user_ids": string[],
    "start_date": string,
    "end_date": string,
    "granularity": string // "hour", "day", "week"
  }
}

Response: {
  "availability": [
    {
      "user_id": string,
      "slots": [
        {
          "start_time": string,
          "end_time": string,
          "status": string // "free", "busy", "tentative"
        }
      ]
    }
  ]
}
```

## Personal Events Endpoints

### GET /personal-events
List personal events with filtering.
```
Request: {
  query: {
    "event_type": string,
    "start_date": string,
    "end_date": string,
    "visibility": string,
    "page": number,
    "limit": number
  }
}

Response: {
  "events": PersonalEvent[],
  "total": number,
  "page": number,
  "pages": number
}
```

### POST /personal-events
Create a new personal event.
```
Request: {
  "title": string,
  "description": string,
  "start_time": string,
  "end_time": string,
  "location": string,
  "is_all_day": boolean,
  "event_type": string,
  "recurrence_rule": string,
  "visibility": string,
  "color": string
}

Response: {
  "event": PersonalEvent
}
```

### GET /personal-events/:id
Get personal event details.
```
Request: {}

Response: {
  "event": PersonalEvent
}
```

### PUT /personal-events/:id
Update a personal event.
```
Request: {
  "title": string,
  "description": string,
  "start_time": string,
  "end_time": string,
  "location": string,
  "is_all_day": boolean,
  "event_type": string,
  "recurrence_rule": string,
  "visibility": string,
  "color": string
}

Response: {
  "event": PersonalEvent
}
```

### DELETE /personal-events/:id
Delete a personal event.
```
Request: {
  query: {
    "delete_series": boolean
  }
}

Response: {
  "success": boolean
}
```

### GET /personal-events/conflicts
Check for conflicts between personal and family events.
```
Request: {
  query: {
    "start_date": string,
    "end_date": string,
    "include_busy_only": boolean
  }
}

Response: {
  "conflicts": [
    {
      "personal_event": PersonalEvent,
      "family_event": Event,
      "conflict_type": string, // "overlap", "travel_time", etc.
      "severity": string // "high", "medium", "low"
    }
  ]
}
```

### GET /personal-events/:id/sharing
List users with whom an event is shared.
```
Request: {}

Response: {
  "event": {
    "id": string,
    "title": string
  },
  "shared_with": [
    {
      "sharing_id": string,
      "user": User,
      "permission": string, // "view", "edit", "admin"
      "status": string, // "pending", "accepted", "declined"
      "shared_at": string
    }
  ],
  "visibility": string // "private", "family", "public"
}
```

### POST /personal-events/:id/sharing
Manage sharing settings for a personal event.
```
Request: {
  "shared_with": [
    {
      "user_id": string,
      "permission": string // "view", "edit"
    }
  ],
  "visibility": string // "private", "busy", "details", "full"
}

Response: {
  "event": PersonalEvent,
  "sharing": [
    {
      "user_id": string,
      "status": string // "pending", "accepted", "declined"
    }
  ]
}
```

### PUT /personal-events/:id/visibility
Update the general visibility of a personal event.
```
Request: {
  "visibility": string, // "private", "family", "public"
  "notify_family": boolean // Whether to notify family members of the change
}

Response: {
  "success": boolean,
  "event": {
    "id": string,
    "title": string,
    "visibility": string
  }
}
```

## Event Sharing Endpoints

### GET /event-sharing
List shared events for the current user.
```
Request: {
  query: {
    "status": string, // "pending", "accepted", "declined", "all"
    "page": number,
    "limit": number
  }
}

Response: {
  "shared_events": [
    {
      "sharing_id": string,
      "event": PersonalEvent,
      "shared_by": User,
      "permission": string, // "view", "edit", "admin"
      "status": string, // "pending", "accepted", "declined"
      "shared_at": string
    }
  ],
  "total": number,
  "page": number,
  "pages": number
}
```

### POST /event-sharing/:id/respond
Respond to an event sharing invitation.
```
Request: {
  "status": string // "accepted", "declined"
}

Response: {
  "success": boolean,
  "event": PersonalEvent
}
```

### DELETE /personal-events/:event_id/sharing/:sharing_id
Remove sharing for a specific user.
```
Request: {}

Response: {
  "success": boolean
}
```

## Privacy Control Endpoints

### GET /privacy/settings
Get current privacy settings for user data.
```
Request: {}

Response: {
  "health_data": {
    "default_visibility": string, // "private", "shared_with_healthcare"
    "calendar_indicators": boolean, // Whether to show health indicators on calendar
    "notification_detail_level": string // "none", "minimal", "detailed"
  },
  "personal_events": {
    "default_visibility": string, // "private", "busy", "details", "full"
    "work_events_default": string, // "private", "busy", "details"
    "personal_events_default": string // "private", "busy", "details", "full" 
  },
  "location_sharing": {
    "enabled": boolean,
    "shared_with": User[]
  }
}
```

### PUT /privacy/settings
Update privacy settings.
```
Request: {
  "health_data": {
    "default_visibility": string,
    "calendar_indicators": boolean,
    "notification_detail_level": string
  },
  "personal_events": {
    "default_visibility": string,
    "work_events_default": string,
    "personal_events_default": string
  },
  "location_sharing": {
    "enabled": boolean,
    "shared_with": string[] // user_ids
  }
}

Response: {
  "success": boolean,
  "settings": PrivacySettings
}
```

### GET /privacy/audit-log
Review access to private data.
```
Request: {
  query: {
    "resource_type": string, // "health_data", "personal_events", "documents", "all"
    "start_date": string,
    "end_date": string,
    "page": number,
    "limit": number
  }
}

Response: {
  "audit_entries": [
    {
      "timestamp": string,
      "user": User, // Who accessed the data
      "resource_type": string,
      "resource_id": string,
      "action": string, // "view", "edit", "delete", "share"
      "access_context": string // Additional context about the access
    }
  ],
  "total": number,
  "page": number,
  "pages": number
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