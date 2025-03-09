// src/components/calendar/__tests__/DeleteConfirmationModal.test.ts
import { describe, it, expect } from 'vitest';
import DeleteConfirmationModal from '../DeleteConfirmationModal.vue';
import { createTestWrapper, findByTestId } from '@/test-utils/test-helpers';

describe('DeleteConfirmationModal', () => {
  const mockEvent = {
    id: 'event-123',
    title: 'Test Event',
    recurrence_rule: 'FREQ=WEEKLY'
  };

  function createWrapper(props = {}) {
    return createTestWrapper(DeleteConfirmationModal, {
      props: {
        show: true,
        event: mockEvent,
        title: 'Delete Event',
        message: 'Are you sure?',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        processing: false,
        showRecurringOptions: true,
        ...props
      }
    });
  }

  describe('Visibility', () => {
    it('should render when show is true', () => {
      const wrapper = createWrapper({ show: true });
      expect(wrapper.isVisible()).toBe(true);
    });

    it('should not render when show is false', () => {
      const wrapper = createWrapper({ show: false });
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    });
  });

  describe('Content', () => {
    it('should display correct title and message', () => {
      const customTitle = 'Custom Title';
      const customMessage = 'Custom message';
      const wrapper = createWrapper({
        title: customTitle,
        message: customMessage
      });
      
      expect(wrapper.text()).toContain(customTitle);
      expect(wrapper.text()).toContain(customMessage);
    });
  });

  describe('Interactions', () => {
    it('should emit cancel event when cancel button is clicked', async () => {
      const wrapper = createWrapper();
      await findByTestId(wrapper, 'cancel-button').trigger('click');
      expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    it('should emit confirm event with expected data when confirm button is clicked', async () => {
      const wrapper = createWrapper();
      await findByTestId(wrapper, 'confirm-button').trigger('click');
      
      expect(wrapper.emitted('confirm')).toBeTruthy();
      expect(wrapper.emitted('confirm')?.[0][0]).toEqual({
        deleteEntireSeries: false,
        event: mockEvent
      });
    });
  });

  describe('Processing State', () => {
    it('should disable buttons and show spinner when processing', () => {
      const wrapper = createWrapper({ processing: true });
      
      expect(findByTestId(wrapper, 'cancel-button').attributes('disabled')).toBeDefined();
      expect(findByTestId(wrapper, 'confirm-button').attributes('disabled')).toBeDefined();
      expect(findByTestId(wrapper, 'loading-spinner').exists()).toBe(true);
    });
  });
});