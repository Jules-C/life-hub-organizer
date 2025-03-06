// src/components/settings/__tests__/FamilySettings.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FamilySettings from '@/views/settings/components/FamilySettings.vue';

describe('Family Settings Component', () => {
  const mockFamilyMembers = [
    {
      id: 'member-1',
      user_id: 'user-1',
      role: 'admin',
      name: 'John Doe',
      email: 'john@example.com',
      initials: 'JD'
    },
    {
      id: 'member-2',
      user_id: 'user-2',
      role: 'member',
      name: 'Jane Smith',
      email: 'jane@example.com',
      initials: 'JS'
    }
  ];

  function createWrapper(props = {}) {
    return mount(FamilySettings, {
      props: {
        loading: false,
        saving: false,
        isPersonalOnly: false,
        familyId: 'family-123',
        familyMembers: mockFamilyMembers,
        ...props
      }
    });
  }

  describe('Rendering', () => {
    it('should show loading state when loading', () => {
      const wrapper = createWrapper({ loading: true });
      expect(wrapper.find('.animate-spin').exists()).toBe(true);
    });

    it('should show personal mode message when isPersonalOnly is true', () => {
      const wrapper = createWrapper({ isPersonalOnly: true });
      expect(wrapper.text()).toContain('You\'re using LifeHubOrganizer in Personal Mode');
      expect(wrapper.find('button:contains("Create a Family")').exists()).toBe(true);
    });

    it('should show family mode content when isPersonalOnly is false', () => {
      const wrapper = createWrapper({ isPersonalOnly: false });
      expect(wrapper.text()).toContain('You\'re using LifeHubOrganizer in Family Mode');
    });

    it('should render family members list correctly', () => {
      const wrapper = createWrapper();
      const memberElements = wrapper.findAll('.col-span-1');
      
      expect(memberElements).toHaveLength(mockFamilyMembers.length);
      expect(wrapper.text()).toContain('John Doe');
      expect(wrapper.text()).toContain('jane@example.com');
    });

    it('should show admin badge for admin members', () => {
      const wrapper = createWrapper();
      const adminBadge = wrapper.find('.bg-green-100.text-green-800');
      expect(adminBadge.exists()).toBe(true);
      expect(adminBadge.text()).toContain('Admin');
    });
  });

  describe('Interactions', () => {
    it('should emit create-family event when clicking create family button', async () => {
      const wrapper = createWrapper({ isPersonalOnly: true });
      await wrapper.find('button:contains("Create a Family")').trigger('click');
      expect(wrapper.emitted('create-family')).toBeTruthy();
    });

    it('should emit invite-member event when clicking invite member button', async () => {
      const wrapper = createWrapper({ isPersonalOnly: false });
      await wrapper.find('button:contains("Add Family Member")').trigger('click');
      expect(wrapper.emitted('invite-member')).toBeTruthy();
    });

    it('should disable invite button when saving', () => {
      const wrapper = createWrapper({ saving: true });
      const inviteButton = wrapper.find('button:contains("Add Family Member")');
      expect(inviteButton.attributes('disabled')).toBeDefined();
    });
  });

  describe('Empty States', () => {
    it('should show no members message when family members list is empty', () => {
      const wrapper = createWrapper({ familyMembers: [] });
      expect(wrapper.text()).toContain('You haven\'t added any family members yet');
    });

    it('should handle undefined familyMembers prop', () => {
      const wrapper = createWrapper({ familyMembers: undefined });
      expect(() => wrapper.vm.$forceUpdate()).not.toThrow();
    });
  });

  describe('Member Display', () => {
    it('should show member initials in avatar', () => {
      const wrapper = createWrapper();
      const avatars = wrapper.findAll('.flex-shrink-0');
      expect(avatars[0].text()).toContain('JD');
    });

    it('should format member roles correctly', () => {
      const wrapper = createWrapper();
      expect(wrapper.text()).toContain('Admin');
      expect(wrapper.text()).toContain('Member');
    });

    it('should handle members without initials', () => {
      const membersWithoutInitials = [
        {
          ...mockFamilyMembers[0],
          initials: undefined
        }
      ];
      const wrapper = createWrapper({ familyMembers: membersWithoutInitials });
      expect(() => wrapper.vm.$forceUpdate()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle members with missing email', () => {
      const membersWithoutEmail = [
        {
          ...mockFamilyMembers[0],
          email: undefined
        }
      ];
      const wrapper = createWrapper({ familyMembers: membersWithoutEmail });
      expect(() => wrapper.vm.$forceUpdate()).not.toThrow();
    });

    it('should handle members with missing name', () => {
      const membersWithoutName = [
        {
          ...mockFamilyMembers[0],
          name: undefined
        }
      ];
      const wrapper = createWrapper({ familyMembers: membersWithoutName });
      expect(() => wrapper.vm.$forceUpdate()).not.toThrow();
    });

    it('should handle missing familyId', () => {
      const wrapper = createWrapper({ familyId: undefined });
      expect(() => wrapper.vm.$forceUpdate()).not.toThrow();
    });
  });
});