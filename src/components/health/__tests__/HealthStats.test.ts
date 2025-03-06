// src/components/health/__tests__/HealthStats.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { cycleTrackingService } from '@/services/health/cycleTracking';
import HealthStats from '../HealthStats.vue';

// Mock the service
vi.mock('@/services/health/cycleTracking', () => ({
  cycleTrackingService: {
    getEntriesForDateRange: vi.fn(),
    predictNextCycle: vi.fn()
  }
}));

describe('HealthStats.vue', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default mock response
    vi.mocked(cycleTrackingService.getEntriesForDateRange).mockResolvedValue({
      data: [
        {
          id: 'entry-1',
          start_date: '2025-02-01',
          end_date: '2025-02-05',
          flow_intensity: 3,
          is_private: true
        },
        {
          id: 'entry-2',
          start_date: '2025-03-01',
          end_date: '2025-03-06',
          flow_intensity: 4,
          is_private: true  
        }
      ],
      error: null
    });
    
    vi.mocked(cycleTrackingService.predictNextCycle).mockResolvedValue({
      predictedStartDate: '2025-04-01',
      averageCycleLength: 28,
      error: null
    });
  });
  
  it('should load entries on mount', async () => {
    const wrapper = mount(HealthStats);
    await wrapper.vm.$nextTick();
    
    expect(cycleTrackingService.getEntriesForDateRange).toHaveBeenCalled();
  });
  
  it('should display loading state', async () => {
    const wrapper = mount(HealthStats);
    
    // Check if loading indicator is visible initially
    expect(wrapper.find('.loading-indicator').exists()).toBe(true);
    
    await wrapper.vm.$nextTick();
    
    // After loading, indicator should be hidden
    expect(wrapper.find('.loading-indicator').exists()).toBe(false);
  });
  
  it('should calculate average cycle length correctly', async () => {
    const wrapper = mount(HealthStats);
    await wrapper.vm.$nextTick();
    
    // Check if the average cycle length is calculated and displayed
    expect(wrapper.text()).toContain('28');
  });
  
  it('should predict next cycle start date', async () => {
    const wrapper = mount(HealthStats);
    await wrapper.vm.$nextTick();
    
    // Check if the prediction is displayed
    expect(wrapper.text()).toContain('April');
  });
  
  it('should handle date range props', async () => {
    const startDate = '2025-01-01';
    const endDate = '2025-03-31';
    
    const wrapper = mount(HealthStats, {
      props: {
        startDate,
        endDate
      }
    });
    
    await wrapper.vm.$nextTick();
    
    // Verify that the service was called with the specified date range
    expect(cycleTrackingService.getEntriesForDateRange).toHaveBeenCalledWith(
      startDate,
      endDate
    );
  });
  
  it('should handle errors gracefully', async () => {
    // Mock an error response
    vi.mocked(cycleTrackingService.getEntriesForDateRange).mockResolvedValue({
      data: null,
      error: {
        message: 'Failed to load entries',
        details: '',
        hint: '',
        code: 'ERROR',
        name: 'PostgrestError'
      }
    });
    
    const wrapper = mount(HealthStats);
    await wrapper.vm.$nextTick();
    
    // Check if error message is displayed
    expect(wrapper.find('.error-message').exists()).toBe(true);
    expect(wrapper.text()).toContain('Failed to load');
  });
});
