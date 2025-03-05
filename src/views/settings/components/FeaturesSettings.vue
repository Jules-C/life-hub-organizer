<template>
  <div class="px-4 py-5 sm:px-6">
    <div v-if="loading" class="py-12 flex justify-center">
      <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else class="space-y-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Feature Settings</h3>
      <p class="mt-1 text-sm text-gray-500">
        Enable or disable features based on your preferences.
      </p>
      
      <div class="mt-6">
        <div class="space-y-4">
          <!-- Personal Health Features -->
          <div class="border-t border-gray-200 pt-6">
            <h4 class="text-sm font-medium text-gray-900">Personal Health Features</h4>
            
            <div class="mt-4 flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="feature-health-tracking"
                  name="feature-health-tracking"
                  type="checkbox"
                  class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  v-model="formData.healthTracking"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="feature-health-tracking" class="font-medium text-gray-700">Enable Health Tracking</label>
                <p class="text-gray-500">Track your health data with cycle tracking and analysis.</p>
              </div>
            </div>
            
            <div class="mt-4 flex items-start pl-8" v-if="formData.healthTracking">
              <div class="flex items-center h-5">
                <input
                  id="feature-health-privacy"
                  name="feature-health-privacy"
                  type="checkbox"
                  class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  v-model="formData.healthPrivacy"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="feature-health-privacy" class="font-medium text-gray-700">Enhanced Privacy Mode</label>
                <p class="text-gray-500">Hide all health indicators from shared views and calendars.</p>
              </div>
            </div>
          </div>
          
          <!-- Personal Events Features -->
          <div class="border-t border-gray-200 pt-6">
            <h4 class="text-sm font-medium text-gray-900">Personal Events Features</h4>
            
            <div class="mt-4 flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="feature-personal-events"
                  name="feature-personal-events"
                  type="checkbox"
                  class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  v-model="formData.personalEvents"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="feature-personal-events" class="font-medium text-gray-700">Enable Personal Events</label>
                <p class="text-gray-500">Manage personal and work events with privacy controls. Disabling this feature simplifies the calendar to focus only on family events and removes work/private event separation.</p>
              </div>
            </div>
            
            <div class="mt-4 flex items-start pl-8" v-if="formData.personalEvents">
              <div class="flex items-center h-5">
                <input
                  id="feature-work-schedule"
                  name="feature-work-schedule"
                  type="checkbox"
                  class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  v-model="formData.workSchedule"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="feature-work-schedule" class="font-medium text-gray-700">Work Schedule Template</label>
                <p class="text-gray-500">Enable work schedule templates and recurring patterns.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Save Button -->
        <div class="mt-8 flex justify-end">
          <button
            type="button"
            :disabled="saving"
            @click="handleSave"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span v-if="saving">Saving...</span>
            <span v-else>Save</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';

interface FeatureSettings {
  healthTracking: boolean;
  healthPrivacy: boolean;
  personalEvents: boolean;
  workSchedule: boolean;
}

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  saving: {
    type: Boolean,
    default: false
  },
  features: {
    type: Object as () => FeatureSettings,
    required: true
  }
});

const emit = defineEmits(['save-features']);

// Create a local form data object to track changes
const formData = ref<FeatureSettings>({
  healthTracking: true,
  healthPrivacy: false,
  personalEvents: true,
  workSchedule: true
});

// Watch for changes in the features prop and update local form data
watchEffect(() => {
  formData.value = {
    healthTracking: props.features.healthTracking ?? true,
    healthPrivacy: props.features.healthPrivacy ?? false,
    personalEvents: props.features.personalEvents ?? true,
    workSchedule: props.features.workSchedule ?? true
  };
});

// Handle save button click
function handleSave() {
  emit('save-features', {
    healthTracking: formData.value.healthTracking,
    healthPrivacy: formData.value.healthPrivacy,
    personalEvents: formData.value.personalEvents,
    workSchedule: formData.value.workSchedule
  });
}
</script>