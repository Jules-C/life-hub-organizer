// src/components/calendar/__tests__/CalendarGrid.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CalendarGrid from '../CalendarGrid.vue';

describe('CalendarGrid.vue', () => {
  const defaultProps = {
    initialDate: new Date('2025-03-05'),
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correct number of days', () => {
    const wrapper = mount(CalendarGrid, {
      props: defaultProps
    });

    // Should render 7 day headers
    const dayHeaders = wrapper.findAll('.bg-gray-50');
    expect(dayHeaders).toHaveLength(7);

    // Should render 42 day cells (6 weeks * 7 days)
    const dayCells = wrapper.findAll('.min-h-[100px]');
    expect(dayCells).toHaveLength(42);
  });

  it('emits month-changed event when navigating', async () => {
    const wrapper = mount(CalendarGrid, {
      props: defaultProps
    });

    // Click next month button
    await wrapper.find('button:last-child').trigger('click');

    expect(wrapper.emitted('month-changed')).toBeTruthy();
    expect(wrapper.emitted('month-changed')?.[0][0]).toEqual({
      month: 3, // April (0-based)
      year: 2025,
      date: expect.any(Date)
    });
  });

  it('emits date-selected event when clicking a day', async () => {
    const wrapper = mount(CalendarGrid, {
      props: defaultProps
    });

    // Find a day in current month and click it
    const currentMonthDay = wrapper.find('.bg-white:not(.bg-gray-50)');
    await currentMonthDay.trigger('click');

    expect(wrapper.emitted('date-selected')).toBeTruthy();
    expect(wrapper.emitted('date-selected')?.[0][0]).toEqual({
      date: expect.any(Date),
      dateString: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      day: expect.objectContaining({
        date: expect.any(Number),
        isCurrentMonth: true
      })
    });
  });

  it('handles custom day names', () => {
    const customDayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const wrapper = mount(CalendarGrid, {
      props: {
        ...defaultProps,
        dayNames: customDayNames
      }
    });

    const dayHeaders = wrapper.findAll('.bg-gray-50');
    dayHeaders.forEach((header, index) => {
      expect(header.text()).toBe(customDayNames[index]);
    });
  });

  it('marks today correctly', () => {
    // Mock current date to match test date
    const RealDate = Date;
    const mockDate = new Date('2025-03-05');
    global.Date = class extends RealDate {
      constructor(date: any) {
        super(date || mockDate);
      }
      static now() {
        return new RealDate('2025-03-05').getTime();
      }
    } as DateConstructor;

    const wrapper = mount(CalendarGrid, {
      props: defaultProps
    });

    const todayCell = wrapper.find('.bg-blue-50');
    expect(todayCell.exists()).toBe(true);

    // Restore original Date
    global.Date = RealDate;
  });

  it('renders custom date indicators', () => {
    const wrapper = mount(CalendarGrid, {
      props: defaultProps,
      slots: {
        'date-indicators': `
          <template #date-indicators="{ day }">
            <div v-if="day.date === 15" class="test-indicator">Test</div>
          </template>
        `
      }
    });

    const indicator = wrapper.find('.test-indicator');
    expect(indicator.exists()).toBe(true);
    expect(indicator.text()).toBe('Test');
  });

  it('renders custom day content', () => {
    const wrapper = mount(CalendarGrid, {
      props: defaultProps,
      slots: {
        'day-content': `
          <template #day-content="{ day }">
            <div v-if="day.date === 15" class="test-content">Custom Content</div>
          </template>
        `
      }
    });

    const content = wrapper.find('.test-content');
    expect(content.exists()).toBe(true);
    expect(content.text()).toBe('Custom Content');
  });

  it('handles date changes through props', async () => {
    const wrapper = mount(CalendarGrid, {
      props: defaultProps
    });

    await wrapper.setProps({
      initialDate: new Date('2025-04-01')
    });

    expect(wrapper.emitted('month-changed')).toBeTruthy();
    expect(wrapper.emitted('month-changed')?.[0][0]).toEqual({
      month: 3, // April (0-based)
      year: 2025,
      date: expect.any(Date)
    });
  });

  it('exposes correct public methods', () => {
    const wrapper = mount(CalendarGrid, {
      props: defaultProps
    });

    expect(wrapper.vm.previousMonth).toBeDefined();
    expect(wrapper.vm.nextMonth).toBeDefined();
    expect(wrapper.vm.currentDate).toBeDefined();
  });
});