<template>
  <div class="px-4 py-5 sm:px-6">
    <div v-if="loading" class="py-12 flex justify-center">
      <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <div v-else class="space-y-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
      <p class="mt-1 text-sm text-gray-500">
        Configure how and when you receive notifications from LifeHubOrganizer.
      </p>
      
      <div class="mt-6">
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="email-notifications"
                name="email-notifications"
                type="checkbox"
                class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                v-model="formData.email"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="email-notifications" class="font-medium text-gray-700">Email notifications</label>
              <p class="text-gray-500">Receive email notifications for important events and updates.</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="browser-notifications"
                name="browser-notifications"
                type="checkbox"
                class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                v-model="formData.browser"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="browser-notifications" class="font-medium text-gray-700">Browser notifications</label>
              <p class="text-gray-500">Receive browser push notifications when using the web app.</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="document-notifications"
                name="document-notifications"
                type="checkbox"
                class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                v-model="formData.documents"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="document-notifications" class="font-medium text-gray-700">Document updates</label>
              <p class="text-gray-500">Receive notifications when documents are added, updated, or shared.</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="calendar-notifications"
                name="calendar-notifications"
                type="checkbox"
                class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                v-model="formData.calendar"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="calendar-notifications" class="font-medium text-gray-700">Calendar reminders</label>
              <p class="text-gray-500">Receive notifications for upcoming events and appointments.</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="task-notifications"
                name="task-notifications"
                type="checkbox"
                class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                v-model="formData.tasks"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="task-notifications" class="font-medium text-gray-700">Task assignments</label>
              <p class="text-gray-500">Receive notifications when tasks are assigned to you or completed.</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <h4 class="text-sm font-medium text-gray-700">Quiet Hours</h4>
          <p class="mt-1 text-sm text-gray-500">Set times when you don't want to receive non-urgent notifications.</p>
          
          <div class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label for="quiet-hours-start" class="block text-sm font-medium text-gray-700">
                Start time
              </label>
              <div class="mt-1">
                <input
                  type="time"
                  name="quiet-hours-start"
                  id="quiet-hours-start"
                  v-model="formData.quietHoursStart"
                  class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="quiet-hours-end" class="block text-sm font-medium text-gray-700">
                End time
              </label>
              <div class="mt-1">
                <input
                  type="time"
                  name="quiet-hours-end"
                  id="quiet-hours-end"
                  v-model="formData.quietHoursEnd"
                  class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end">
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

interface NotificationSettings {
  email: boolean;
  browser: boolean;
  documents: boolean;
  calendar: boolean;
  tasks: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
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
  notifications: {
    type: Object as () => NotificationSettings,
    required: true
  }
});

const emit = defineEmits(['save-notifications']);

// Create a local form data object to track changes
const formData = ref<NotificationSettings>({
  email: true,
  browser: true,
  documents: true,
  calendar: true,
  tasks: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00'
});

// Watch for changes in the notifications prop and update local form data
watchEffect(() => {
  formData.value = {
    email: props.notifications.email ?? true,
    browser: props.notifications.browser ?? true,
    documents: props.notifications.documents ?? true,
    calendar: props.notifications.calendar ?? true,
    tasks: props.notifications.tasks ?? true,
    quietHoursStart: props.notifications.quietHoursStart ?? '22:00',
    quietHoursEnd: props.notifications.quietHoursEnd ?? '08:00'
  };
});

// Handle save button click
function handleSave() {
  emit('save-notifications', {
    email: formData.value.email,
    browser: formData.value.browser,
    documents: formData.value.documents,
    calendar: formData.value.calendar,
    tasks: formData.value.tasks,
    quietHoursStart: formData.value.quietHoursStart,
    quietHoursEnd: formData.value.quietHoursEnd
  });
}
</script>