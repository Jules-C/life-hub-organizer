// src/views/calendar/__tests__/PersonalEventsView.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import PersonalEventsView from '../PersonalEventsView.vue';
import { personalEventService } from '@/services/calendar/personalEvents';
import { getFamilyContext } from '@/utils/familyUtils';
import type { CalendarEvent } from '@/types/calendar';

// Mock required services and components
vi.mock('@/services/calendar/personalEvents');
vi.mock('@/utils/familyUtils');

// Mock calendar grid component
vi.mock('@/components/calendar/CalendarGrid.vue', () => {
  return {
    default: {
      name: 'CalendarGrid',
      template: '<div class="calendar-grid"><slot name="day-content" :day="mockDay"></slot></div>',
      props: ['initialDate'],
      setup() {
        return {
          mockDay: {
            date: 1,
            isCurrentMonth: true,
            dateString: '2025-03-01'
          }
        };
      }
    }
  };
});

describe('PersonalEventsView', () => {
  const mockEvents: CalendarEvent[] = [
    {
      id: 'event-1',
      title: 'Personal Meeting',
      start_time: '2025-03-01T09:00:00Z',
      end_time: '2025-03-01T10:00:00Z',
      event_type: 'personal',
      visibility: 'private',
      is_all_day: false
    },
    {
      id: 'event-2',
      title: 'Work Schedule',
      start_time: '2025-03-01T14:00:00Z',
      end_time: '2025-03-01T17:00:00Z',
      event_type: 'work',
      recurrence_rule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
      visibility: 'private',
      is_all_day: false
    }
  ];

  function createWrapper() {
    return mount(PersonalEventsView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              userPreferences: {
                features: {
                  personalEvents: true
                }
              }
            }
          })
        ],
        stubs: {
          'AppLayout': true,
          'EventModal': true,
          'DeleteConfirmationModal': true
        }
      }
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(personalEventService.getEventsForDateRange).mockResolvedValue({
      data: mockEvents,
      error: null
    });
    vi.mocked(getFamilyContext).mockResolvedValue({
      familyId: null,
      isPersonalOnly: true
    });
  });

  describe('Initialization', () => {
    it('should load events on mount', async () => {
      const wrapper = createWrapper();
      await vi.dynamicImportSettled();
      
      expect(personalEventService.getEventsForDateRange).toHaveBeenCalled();
      
      // Test through rendered output rather than accessing vm properties
      const eventList = wrapper.findAll('.event-item');
      expect(eventList.length).toBeGreaterThan(0);
    });
  });

  describe('Tab Navigation', () => {
    it('should have tab buttons', async () => {
      const wrapper = createWrapper();
      const tabs = wrapper.findAll('.tab-button');
      expect(tabs.length).toBeGreaterThan(0);
    });
    
    it('should switch tabs when clicked', async () => {
      const wrapper = createWrapper();
      
      // Find tab buttons
      const personalTab = wrapper.find('[data-tab="personal"]');
      await personalTab.trigger('click');
      
      // Verify active tab styling
      expect(personalTab.classes()).toContain('active-tab');
    });
  });

  describe('Event Creation', () => {
    it('should show add event button', async () => {
      const wrapper = createWrapper();
      const addButton = wrapper.find('.add-event-button');
      expect(addButton.exists()).toBe(true);
    });
    
    it('should call create event service when form submitted', async () => {
      vi.mocked(personalEventService.createEvent).mockResolvedValue({
        data: { ...mockEvents[0], id: 'new-event' } as CalendarEvent,
        error: null
      });

      const wrapper = createWrapper();
      
      // We need to trigger the form submission via DOM events instead of directly calling methods
      // Use direct component method invocation to avoid type errors
      // instead of trying to access methods through the wrapper that might not be exposed
      // Note: In a real test, you'd handle this with proper component type declarations
      const anyWrapper = wrapper as any;
      if (anyWrapper.vm.submitForm) {
        await anyWrapper.vm.submitForm();
      } else {
        // Fallback to DOM interaction if method is not accessible
        // Open the event modal first
        await wrapper.find('.add-event-button').trigger('click');
        
        // Fill in the form fields
        const titleInput = wrapper.find('#title');
        await titleInput.setValue('New Test Event');
        
        // Submit the form
        const form = wrapper.find('form');
        await form.trigger('submit.prevent');
      }
      
      // Wait for the next tick to allow the promise to resolve
      await wrapper.vm.$nextTick();
      
      expect(personalEventService.createEvent).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should show error messages when service fails', async () => {
      const mockError = new Error('Failed to load events');
      vi.mocked(personalEventService.getEventsForDateRange).mockResolvedValue({
        data: null,
        error: mockError as any
      });

      const wrapper = createWrapper();
      await vi.dynamicImportSettled();
      
      // Error should be displayed in UI
      const errorEl = wrapper.find('.error-message');
      expect(errorEl.exists()).toBe(true);
    });
  });
});
