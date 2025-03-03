import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { userPreferencesService } from '@/services/userPreferences';

export interface FeatureToggles {
  healthTracking: boolean;
  healthPrivacy: boolean;
  personalEvents: boolean;
  workSchedule: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  browser: boolean;
  documents: boolean;
  calendar: boolean;
  tasks: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export const useUserPreferencesStore = defineStore('userPreferences', () => {
  // State
  const features = ref<FeatureToggles>({
    healthTracking: true,
    healthPrivacy: false,
    personalEvents: true,
    workSchedule: true
  });
  
  const notifications = ref<NotificationPreferences>({
    email: true,
    browser: true,
    documents: true,
    calendar: true,
    tasks: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  });
  
  const loading = ref(false);
  
  // Computed properties for easier access
  const isHealthTrackingEnabled = computed(() => features.value.healthTracking);
  const isHealthPrivacyEnabled = computed(() => features.value.healthPrivacy);
  const isPersonalEventsEnabled = computed(() => features.value.personalEvents);
  const isWorkScheduleEnabled = computed(() => features.value.workSchedule);
  
  // Actions
  async function initialize() {
    loading.value = true;
    try {
      // Get preferences from backend
      const prefs = await userPreferencesService.getUserPreferences();
      
      // Update the local state
      features.value = prefs.features;
      notifications.value = prefs.notifications;
      
      console.log('User preferences initialized:', features.value);
      loading.value = false;
      return { success: true };
    } catch (error: any) {
      console.error('Failed to initialize user preferences:', error);
      loading.value = false;
      return { success: false, error: error.message };
    }
  }
  
  
  async function updateFeatures(newFeatures: Partial<FeatureToggles>) {
    try {
      // Update local state
      features.value = {
        ...features.value,
        ...newFeatures
      };
      
      // Save to backend
      await userPreferencesService.updateFeatureToggles(newFeatures);
      
      return { success: true };
    } catch (error: any) {
      console.error('Failed to update features:', error);
      return { success: false, error: error.message };
    }
  }
  
  async function updateNotifications(newNotifications: Partial<NotificationPreferences>) {
    try {
      // Update local state
      notifications.value = {
        ...notifications.value,
        ...newNotifications
      };
      
      // Save to backend
      await userPreferencesService.updateNotificationPreferences(newNotifications);
      
      return { success: true };
    } catch (error: any) {
      console.error('Failed to update notifications:', error);
      return { success: false, error: error.message };
    }
  }
  
  return {
    features,
    notifications,
    loading,
    isHealthTrackingEnabled,
    isHealthPrivacyEnabled,
    isPersonalEventsEnabled,
    isWorkScheduleEnabled,
    initialize,
    updateFeatures,
    updateNotifications
  };
});
