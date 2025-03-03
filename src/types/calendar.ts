// src/types/calendar.ts
export type EventVisibility = 'private' | 'family' | 'public';

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
  event_type: string; // 'work', 'personal', 'health', etc.
  color?: string;
  visibility: EventVisibility;
  created_at?: string;
  updated_at?: string;
}

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