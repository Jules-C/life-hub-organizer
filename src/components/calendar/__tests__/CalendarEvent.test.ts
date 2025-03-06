import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CalendarEvent from '../CalendarEvent.vue';
import type { CalendarEvent as CalendarEventType } from '@/types/calendar';

// Mock data
const mockEvent: CalendarEventType = {
  id: 'test-event-id',
  title: 'Test Event',
  description: 'This is a test event',
  start_time: '2023-09-15T10:00:00',
  end_time: '2023-09-15T11:00:00',
  is_all_day: false,
  event_type: 'personal',
  visibility: 'private',
};

// Helper function to create wrapper with default props
function createWrapper(props: Partial<{
  event: CalendarEventType;
  eventType?: 'default' | 'personal' | 'family' | 'health' | 'work';
  customClass?: string;
  showTime?: boolean;
}> = {}) {
  return mount(CalendarEvent, {
    props: {
      event: props.event || mockEvent,
      eventType: props.eventType,
      customClass: props.customClass,
      showTime: props.showTime,
    },
    global: {
      stubs: {
        // Add stubs if needed
      },
    },
  });
}

describe('CalendarEvent.vue', () => {
  it('should render correctly with default props', () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain('Test Event');
  });

  it('should handle missing event type', () => {
    // Create a proper copy that we can modify safely
    const modifiedEvent: Partial<CalendarEventType> = {
      ...mockEvent,
      event_type: undefined as unknown as string, // Force type to be undefined
    };
    
    // Create the wrapper with the modified event
    const wrapper = createWrapper({
      event: modifiedEvent as CalendarEventType
    });
    expect(wrapper.classes()).toContain('bg-gray-100');
  });

  it('should apply custom class when provided', () => {
    const wrapper = createWrapper({
      customClass: 'custom-test-class'
    });
    expect(wrapper.classes()).toContain('custom-test-class');
  });

  it('should emit event-click when clicked', async () => {
    const wrapper = createWrapper();
    await wrapper.trigger('click');
    expect(wrapper.emitted('event-click')).toBeTruthy();
    expect(wrapper.emitted('event-click')![0]).toEqual([mockEvent]);
  });

  it('should display time when showTime is true', () => {
    const wrapper = createWrapper({
      showTime: true
    });
    expect(wrapper.text()).toContain('10:00');
  });

  it('should not display time when showTime is false', () => {
    const wrapper = createWrapper({
      showTime: false
    });
    expect(wrapper.text()).not.toContain('10:00');
  });
});
