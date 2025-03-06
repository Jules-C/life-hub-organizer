// src/components/calendar/__tests__/DeleteConfirmationModal.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DeleteConfirmationModal from '../DeleteConfirmationModal.vue';

describe('Delete Confirmation Modal', () => {
  const mockEvent = {
    id: 'event-123',
    title: 'Test Event',
    recurrence_rule: 'FREQ=WEEKLY'
  };

  function createWrapper(props = {}) {
    return mount(DeleteConfirmationModal, {
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

  describe('Rendering', () => {
    it('should render modal when show is true', () => {
      const wrapper = createWrapper({ show: true });
      expect(wrapper.isVisible()).toBe(true);
      expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    });

    it('should not render modal when show is false', () => {
      const wrapper = createWrapper({ show: false });
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    });

    it('should render custom title and message', () => {
      const customTitle = 'Custom Delete Title';
      const customMessage = 'Custom delete message';
      const wrapper = createWrapper({
        title: customTitle,
        message: customMessage
      });

      expect(wrapper.text()).toContain(customTitle);
      expect(wrapper.text()).toContain(customMessage);
    });

    it('should render custom button text', () => {
      const wrapper = createWrapper({
        confirmButtonText: 'Remove',
        cancelButtonText: 'Keep'
      });

      expect(wrapper.text()).toContain('Remove');
      expect(wrapper.text()).toContain('Keep');
    });
  });

  describe('Recurring Event Options', () => {
    it('should show recurring options for recurring events', () => {
      const wrapper = createWrapper({
        event: { ...mockEvent, recurrence_rule: 'FREQ=WEEKLY' },
        showRecurringOptions: true
      });

      expect(wrapper.find('#delete-series').exists()).toBe(true);
      expect(wrapper.text()).toContain('Delete entire series');
    });

    it('should not show recurring options for non-recurring events', () => {
      const wrapper = createWrapper({
        event: { ...mockEvent, recurrence_rule: null }
      });

      expect(wrapper.find('#delete-series').exists()).toBe(false);
    });

    it('should not show recurring options when showRecurringOptions is false', () => {
      const wrapper = createWrapper({
        event: { ...mockEvent, recurrence_rule: 'FREQ=WEEKLY' },
        showRecurringOptions: false
      });

      expect(wrapper.find('#delete-series').exists()).toBe(false);
    });
  });

  describe('Interactions', () => {
    it('should emit cancel event when clicking cancel button', async () => {
      const wrapper = createWrapper();
      await wrapper.find('button:contains("Cancel")').trigger('click');
      expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    it('should emit cancel event when clicking backdrop', async () => {
      const wrapper = createWrapper();
      await wrapper.find('[aria-hidden="true"]').trigger('click');
      expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    it('should emit confirm event with correct data when confirming', async () => {
      const wrapper = createWrapper();
      await wrapper.find('button:contains("Delete")').trigger('click');
      
      expect(wrapper.emitted('confirm')).toBeTruthy();
      expect(wrapper.emitted('confirm')?.[0]).toEqual([{
        deleteEntireSeries: false,
        event: mockEvent
      }]);
    });

    it('should include deleteEntireSeries in confirm event when selected', async () => {
      const wrapper = createWrapper();
      
      // Check the delete series checkbox
      await wrapper.find('#delete-series').setValue(true);
      
      // Click confirm button
      await wrapper.find('button:contains("Delete")').trigger('click');
      
      expect(wrapper.emitted('confirm')?.[0]).toEqual([{
        deleteEntireSeries: true,
        event: mockEvent
      }]);
    });
  });

  describe('Processing State', () => {
    it('should disable buttons when processing', () => {
      const wrapper = createWrapper({ processing: true });
      
      const confirmButton = wrapper.find('button:contains("Delete")');
      const cancelButton = wrapper.find('button:contains("Cancel")');
      
      expect(confirmButton.attributes('disabled')).toBeDefined();
      expect(cancelButton.attributes('disabled')).toBeDefined();
    });

    it('should not emit cancel when clicking backdrop while processing', async () => {
      const wrapper = createWrapper({ processing: true });
      await wrapper.find('[aria-hidden="true"]').trigger('click');
      expect(wrapper.emitted('cancel')).toBeFalsy();
    });

    it('should show loading state in confirm button when processing', () => {
      const wrapper = createWrapper({ processing: true });
      expect(wrapper.find('.animate-spin').exists()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing event prop', () => {
      const wrapper = createWrapper({ event: null });
      expect(() => wrapper.vm.$forceUpdate()).not.toThrow();
    });

    it('should handle undefined recurrence_rule', () => {
      const wrapper = createWrapper({
        event: { ...mockEvent, recurrence_rule: undefined }
      });
      expect(() => wrapper.vm.$forceUpdate()).not.toThrow();
    });

    it('should handle empty strings in title and message', () => {
      const wrapper = createWrapper({
        title: '',
        message: ''
      });
      expect(() => wrapper.vm.$forceUpdate()).not.toThrow();
    });
  });
});