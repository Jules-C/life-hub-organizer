import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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
      // In a real implementation, we would fetch from the backend here
      // For now, we're just using local state

      // If we were loading from an API, it would look something like this:
      // const response = await api.getUserPreferences();
      // features.value = response.features;
      // notifications.value = response.notifications;
      
      console.log('User preferences initialized with defaults:', features.value);
      loading.value = false;
      return { success: true };
    } catch (error: any) {
      console.error('Failed to initialize user preferences:', error);
      loading.value = false;
      return { success: false, error: error.message };
    }
  }
  
  function updateFeatures(newFeatures: Partial<FeatureToggles>) {
    features.value = {
      ...features.value,
      ...newFeatures
    };
    
    // Log the updated features for debugging
    console.log('Features updated:', features.value);
    
    // TODO: When we implement the API service, we'll save preferences here
    // For example: await api.updateUserPreferences({ features: features.value });
    
    return { success: true };
  }
  
  function updateNotifications(newNotifications: Partial<NotificationPreferences>) {
    notifications.value = {
      ...notifications.value,
      ...newNotifications
    };
    
    // TODO: When we implement the API service, we'll save preferences here
    return { success: true };
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
