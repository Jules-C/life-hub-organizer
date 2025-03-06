// src/test-setup.ts
import type { CalendarEvent } from '@/types/calendar';
import { mount } from '@vue/test-utils';
import { Component } from 'vue';

// Type aliases
export type CalendarEventType = CalendarEvent;

// Mock data
export const mockEvent: CalendarEventType = {
  id: 'test-event-id',
  title: 'Test Event',
  description: 'This is a test event',
  start_time: '2023-09-15T10:00:00',
  end_time: '2023-09-15T11:00:00',
  is_all_day: false,
  event_type: 'personal',
  visibility: 'private',
};

// Helper functions
export function createWrapper(props: Record<string, any> = {}) {
  // This is a stub function that will be implemented in each test file
  // It's here as a type placeholder
  return {} as ReturnType<typeof mount>;
}
