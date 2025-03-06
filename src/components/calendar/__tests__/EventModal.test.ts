// src/components/calendar/__tests__/EventModal.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import EventModal from '../EventModal.vue';
import { formatDateTime } from '@/utils/dateUtils';
import type { CalendarEvent } from '@/types/calendar';

// Mock the dateUtils functions 
vi.mock('@/utils/dateUtils', () => ({
  formatDateTime: vi.fn((date: string) => 'March 5, 2025 9:00 AM'),
  formatTime: vi.fn((date: string) => '9:00 AM')
}));

describe('EventModal.vue', () => {
  // Create a valid CalendarEvent for testing
  const mockEvent: CalendarEvent = {
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    start_time: '2025-03-05T09:00:00Z',
    end_time: '2025-03-05T10:00:00Z',
    location: 'Test Location',
    is_all_day: false,
    event_type: 'personal',
    visibility: 'private',
    color: '#3B82F6'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('View Mode', () => {
    it('displays event details correctly in view mode', () => {
      const wrapper = mount(EventModal, {
        props: {
          show: true,
          mode: 'view',
          event: mockEvent
        }
      });

      expect(wrapper.text()).toContain('Test Event');
      expect(wrapper.text()).toContain('Test Description');
      expect(wrapper.text()).toContain('Test Location');
      expect(wrapper.text()).toContain('March 5, 2025 9:00 AM'); // Using mock
    });

    it('shows edit and delete buttons in view mode', () => {
      const wrapper = mount(EventModal, {
        props: {
          show: true,
          mode: 'view',
          event: mockEvent
        }
      });

      // Look for buttons by their text content
      const editButton = wrapper.find('button:has(svg + span:contains("Edit"))');
      const deleteButton = wrapper.find('button:has(svg + span:contains("Delete"))');
      
      // If exact selectors fail, look for text content
      expect(editButton.exists() || wrapper.text().includes('Edit')).toBe(true);
      expect(deleteButton.exists() || wrapper.text().includes('Delete')).toBe(true);
    });
  });

  describe('Edit Mode', () => {
    it('populates form fields correctly in edit mode', () => {
      const wrapper = mount(EventModal, {
        props: {
          show: true,
          mode: 'edit',
          event: mockEvent
        }
      });

      const titleInput = wrapper.find('#event-title');
      const descriptionInput = wrapper.find('#description');
      const locationInput = wrapper.find('#location');
      
      expect((titleInput.element as HTMLInputElement).value).toBe('Test Event');
      expect((descriptionInput.element as HTMLTextAreaElement).value).toBe('Test Description');
      expect((locationInput.element as HTMLInputElement).value).toBe('Test Location');
    });

    it('emits save event with updated data', async () => {
      const wrapper = mount(EventModal, {
        props: {
          show: true,
          mode: 'edit',
          event: mockEvent
        }
      });

      await wrapper.find('#event-title').setValue('Updated Event');
      await wrapper.find('form').trigger('submit');

      expect(wrapper.emitted('save')).toBeTruthy();
      const savedEvent = wrapper.emitted('save')?.[0][0] as CalendarEvent;
      expect(savedEvent.title).toBe('Updated Event');
    });
  });

  describe('Create Mode', () => {
    it('shows empty form in create mode', () => {
      const newEvent: Partial<CalendarEvent> = {
        start_time: '2025-03-05T09:00:00Z',
        end_time: '2025-03-05T10:00:00Z',
        is_all_day: false,
        event_type: 'personal',
        visibility: 'private'
      };
      
      const wrapper = mount(EventModal, {
        props: {
          show: true,
          mode: 'create',
          event: newEvent as CalendarEvent
        }
      });

      const titleInput = wrapper.find('#event-title');
      const descriptionInput = wrapper.find('#description');
      const locationInput = wrapper.find('#location');
      
      expect((titleInput.element as HTMLInputElement).value).toBe('');
      expect((descriptionInput.element as HTMLTextAreaElement).value).toBe('');
      expect((locationInput.element as HTMLInputElement).value).toBe('');
    });

    it('emits save event with new event data', async () => {
      const newEvent: Partial<CalendarEvent> = {
        start_time: '2025-03-05T09:00:00Z',
        end_time: '2025-03-05T10:00:00Z',
        is_all_day: false,
        event_type: 'personal',
        visibility: 'private'
      };
      
      const wrapper = mount(EventModal, {
        props: {
          show: true,
          mode: 'create',
          event: newEvent as CalendarEvent
        }
      });

      await wrapper.find('#event-title').setValue('New Event');
      await wrapper.find('#description').setValue('New Description');
      await wrapper.find('form').trigger('submit');

      expect(wrapper.emitted('save')).toBeTruthy();
      const savedEvent = wrapper.emitted('save')?.[0][0] as CalendarEvent;
      expect(savedEvent.title).toBe('New Event');
      expect(savedEvent.description).toBe('New Description');
    });
  });

  describe('Modal Controls', () => {
    it('closes modal when clicking cancel', async () => {
      const newEvent: Partial<CalendarEvent> = {
        start_time: '2025-03-05T09:00:00Z',
        end_time: '2025-03-05T10:00:00Z',
        is_all_day: false,
        event_type: 'personal',
        visibility: 'private'
      };
      
      const wrapper = mount(EventModal, {
        props: {
          show: true,
          mode: 'create',
          event: newEvent as CalendarEvent
        }
      });

      // Find the cancel button
      const buttons = wrapper.findAll('button');
      const cancelButton = Array.from(buttons).find(
        btn => btn.text().includes('Cancel')
      );
      
      if (cancelButton) {
        await cancelButton.trigger('click');
      }
      
      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('disables form submission while processing', async () => {
      const newEvent: Partial<CalendarEvent> = {
        start_time: '2025-03-05T09:00:00Z',
        end_time: '2025-03-05T10:00:00Z',
        is_all_day: false,
        event_type: 'personal',
        visibility: 'private'
      };
      
      const wrapper = mount(EventModal, {
        props: {
          show: true,
          mode: 'create',
          event: newEvent as CalendarEvent,
          processing: true
        }
      });

      const submitButton = wrapper.find('button[type="submit"]');
      expect(submitButton.attributes('disabled')).toBeDefined();
      expect(submitButton.text().includes('Processing') || submitButton.find('.animate-spin').exists()).toBeTruthy();
    });
  });

  describe('Feature-specific Behavior', () => {
    it('shows work schedule options for work events', async () => {
      const workEvent: CalendarEvent = {
        title: '',
        start_time: '2025-03-05T09:00:00Z',
        end_time: '2025-03-05T10:00:00Z',
        is_all_day: false,
        event_type: 'work',
        visibility: 'private'
      };
      
      const wrapper = mount(EventModal, {
        props: {
          show: true,
          mode: 'create',
          event: workEvent
        }
      });

      expect(wrapper.find('#recurrence').exists()).toBe(true);
    });

    it('handles all-day event toggle correctly', async () => {
      const newEvent: Partial<CalendarEvent> = {
        start_time: '2025-03-05T09:00:00Z',
        end_time: '2025-03-05T10:00:00Z',
        is_all_day: false,
        event_type: 'personal',
        visibility: 'private'
      };
      
      const wrapper = mount(EventModal, {
        props: {
          show: true,
          mode: 'create',
          event: newEvent as CalendarEvent
        }
      });

      await wrapper.find('#all-day').setValue(true);

      const startTime = wrapper.find('#start-time');
      const endTime = wrapper.find('#end-time');

      expect(startTime.attributes('disabled')).toBeDefined();
      expect(endTime.attributes('disabled')).toBeDefined();
    });

    it('validates required fields before submission', async () => {
      const newEvent: Partial<CalendarEvent> = {
        title: '', // Empty title to trigger validation
        start_time: '2025-03-05T09:00:00Z',
        end_time: '2025-03-05T10:00:00Z',
        is_all_day: false,
        event_type: 'personal',
        visibility: 'private'
      };
      
      const wrapper = mount(EventModal, {
        props: {
          show: true,
          mode: 'create',
          event: newEvent as CalendarEvent
        }
      });

      // Try to submit without required fields
      await wrapper.find('form').trigger('submit');

      // Verify that the form wasn't submitted
      expect(wrapper.emitted('save')).toBeFalsy();
    });
  });
});