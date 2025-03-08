// src/types/calendar.ts
export type EventVisibility = 'private' | 'family' | 'public';
export type EventType = 'personal' | 'work' | 'family' | 'health';

export interface CalendarEvent {
  id?: string;
  user_id?: string;
  family_id?: string;
  title: string;
  description?: string;
  start_time: string; // ISO datetime format
  end_time: string; // ISO datetime format
  location?: string;
  is_all_day: boolean;
  recurrence_rule?: string;
  event_type: EventType; // 'personal', 'work', 'family', 'health'
  color?: string;
  visibility: EventVisibility;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>; // For type-specific properties
}

// Type definitions for metadata fields
export interface HealthEventMetadata {
  flow_intensity?: number; // 1-5 scale
  symptoms?: {
    [key: string]: boolean;
  };
  notes?: string;
}

export interface WorkEventMetadata {
  participants?: string[];
  meeting_link?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface FamilyEventMetadata {
  attendees?: string[]; // Family member IDs
  category?: 'outing' | 'celebration' | 'routine' | 'other';
}

export interface PersonalEventMetadata {
  category?: string;
  tags?: string[];
  reminder?: boolean;
}

// Legacy interface - keeping for backward compatibility during migration
export interface CycleTrackingEntry {
  id?: string;
  user_id?: string;
  family_id?: string;
  start_date: string; // ISO date format
  end_date?: string; // ISO date format
  flow_intensity?: number; // 1-5 scale
  symptoms?: {
    [key: string]: boolean;
  };
  notes?: string;
  is_private: boolean;
}