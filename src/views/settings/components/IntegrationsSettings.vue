<template>
  <div class="px-4 py-5 sm:px-6">
    <div v-if="loading" class="py-12 flex justify-center">
      <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </div>

    <div v-else class="space-y-6">
      <!-- Calendar Integrations -->
      <div>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Calendar Integrations</h3>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Beta Feature
          </span>
        </div>

        <div class="mt-4 space-y-4">
          <!-- Google Calendar -->
          <div class="flex justify-between items-center p-4 border border-gray-200 rounded-md">
            <div class="flex items-center">
              <div class="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M22 12.25c0 5.66-4.59 10.25-10.25 10.25S1.5 17.91 1.5 12.25 6.09 2 11.75 2 22 6.59 22 12.25z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.75 8v4.25l2.75 2.75" />
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">Google Calendar</h4>
                <p class="text-sm text-gray-500">
                  <span v-if="integrations.googleCalendar.connected" class="text-green-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Connected as {{ integrations.googleCalendar.email }}
                  </span>
                  <span v-else>Sync your Google Calendar events</span>
                </p>
              </div>
            </div>
            <button type="button" @click="toggleIntegration('googleCalendar')"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md"
              :class="integrations.googleCalendar.connected ?
                'text-red-700 bg-red-100 hover:bg-red-200' :
                'text-primary-700 bg-primary-100 hover:bg-primary-200'" :disabled="connecting.googleCalendar">
              <svg v-if="connecting.googleCalendar" class="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span v-if="connecting.googleCalendar">Connecting...</span>
              <span v-else-if="integrations.googleCalendar.connected">Disconnect</span>
              <span v-else>Connect</span>
            </button>
          </div>

          <!-- Outlook Calendar -->
          <div class="flex justify-between items-center p-4 border border-gray-200 rounded-md">
            <div class="flex items-center">
              <div class="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M21 8v8a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5h8a5 5 0 015 5z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M8 10h5.586c.89 0 1.337 0 1.677.269.34.268.396.74.509 1.683l.857 7.136c.014.117.021.175.001.224a.21.21 0 01-.119.117C16.458 19.458 16.4 19.45 16.284 19.437l-7.136-.857c-.944-.113-1.415-.17-1.683-.509C7.196 17.73 7.196 17.284 7.196 16.394V10.8c0-.466 0-.699.076-.891a1 1 0 01.633-.633c.192-.076.425-.076.891-.076V10z" />
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">Outlook Calendar</h4>
                <p class="text-sm text-gray-500">
                  <span v-if="integrations.outlookCalendar.connected" class="text-green-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Connected as {{ integrations.outlookCalendar.email }}
                  </span>
                  <span v-else>Sync your Outlook calendar events</span>
                </p>
              </div>
            </div>
            <button type="button" @click="toggleIntegration('outlookCalendar')"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md"
              :class="integrations.outlookCalendar.connected ?
                'text-red-700 bg-red-100 hover:bg-red-200' :
                'text-primary-700 bg-primary-100 hover:bg-primary-200'" :disabled="connecting.outlookCalendar">
              <svg v-if="connecting.outlookCalendar" class="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span v-if="connecting.outlookCalendar">Connecting...</span>
              <span v-else-if="integrations.outlookCalendar.connected">Disconnect</span>
              <span v-else>Connect</span>
            </button>
          </div>

          <!-- Apple Calendar -->
          <div class="flex justify-between items-center p-4 border border-gray-200 rounded-md">
            <div class="flex items-center">
              <div class="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">Apple Calendar</h4>
                <p class="text-sm text-gray-500">
                  <span class="text-gray-500">Coming soon</span>
                </p>
              </div>
            </div>
            <button type="button"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-50 cursor-not-allowed"
              disabled>
              Connect
            </button>
          </div>
        </div>
      </div>

      <!-- Email Integrations -->
      <div>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Email Integrations</h3>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Beta Feature
          </span>
        </div>

        <div class="mt-4 space-y-4">
          <!-- Gmail -->
          <div class="flex justify-between items-center p-4 border border-gray-200 rounded-md">
            <div class="flex items-center">
              <div class="w-10 h-10 flex-shrink-0 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">Gmail</h4>
                <p class="text-sm text-gray-500">
                  <span v-if="integrations.gmail.connected" class="text-green-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Connected as {{ integrations.gmail.email }}
                  </span>
                  <span v-else>Process emails from your Gmail account</span>
                </p>
              </div>
            </div>
            <button type="button" @click="toggleIntegration('gmail')"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md"
              :class="integrations.gmail.connected ?
                'text-red-700 bg-red-100 hover:bg-red-200' :
                'text-primary-700 bg-primary-100 hover:bg-primary-200'" :disabled="connecting.gmail">
              <svg v-if="connecting.gmail" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span v-if="connecting.gmail">Connecting...</span>
              <span v-else-if="integrations.gmail.connected">Disconnect</span>
              <span v-else>Connect</span>
            </button>
          </div>

          <!-- Outlook Email -->
          <div class="flex justify-between items-center p-4 border border-gray-200 rounded-md">
            <div class="flex items-center">
              <div class="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">Outlook Email</h4>
                <p class="text-sm text-gray-500">
                  <span v-if="integrations.outlookEmail.connected" class="text-green-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Connected as {{ integrations.outlookEmail.email }}
                  </span>
                  <span v-else>Process emails from your Outlook account</span>
                </p>
              </div>
            </div>
            <button type="button" @click="toggleIntegration('outlookEmail')"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md"
              :class="integrations.outlookEmail.connected ?
                'text-red-700 bg-red-100 hover:bg-red-200' :
                'text-primary-700 bg-primary-100 hover:bg-primary-200'" :disabled="connecting.outlookEmail">
              <svg v-if="connecting.outlookEmail" class="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span v-if="connecting.outlookEmail">Connecting...</span>
              <span v-else-if="integrations.outlookEmail.connected">Disconnect</span>
              <span v-else>Connect</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Document Storage Integrations -->
      <div>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Document Storage Integrations</h3>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Coming Soon
          </span>
        </div>

        <div class="p-4 border border-gray-200 rounded-md bg-gray-50">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-full p-1">
              <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-gray-900">Cloud Storage Integration</h3>
              <div class="mt-1 text-sm text-gray-500">
                <p>Integrations with Google Drive, Dropbox, and OneDrive are coming soon!</p>
                <p class="mt-1">These integrations will allow you to store and access your family documents in your
                  preferred cloud storage provider.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface IntegrationData {
  connected: boolean;
  email?: string;
}

interface Integrations {
  googleCalendar: IntegrationData;
  outlookCalendar: IntegrationData;
  gmail: IntegrationData;
  outlookEmail: IntegrationData;
}

interface ConnectingState {
  googleCalendar: boolean;
  outlookCalendar: boolean;
  gmail: boolean;
  outlookEmail: boolean;
}

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

// Integration status
const integrations = ref<Integrations>({
  googleCalendar: { connected: false },
  outlookCalendar: { connected: false },
  gmail: { connected: false },
  outlookEmail: { connected: false }
});

// Connecting status (for spinners)
const connecting = ref<ConnectingState>({
  googleCalendar: false,
  outlookCalendar: false,
  gmail: false,
  outlookEmail: false
});

// Mock function to toggle integration connection status
function toggleIntegration(integration: keyof Integrations) {
  connecting.value[integration] = true;

  // Simulate API call with timeout
  setTimeout(() => {
    if (integrations.value[integration].connected) {
      // Disconnect logic
      integrations.value[integration] = { connected: false };
    } else {
      // Connect logic - mock successful connection
      const emailMap: Record<string, string> = {
        googleCalendar: 'user@gmail.com',
        outlookCalendar: 'user@outlook.com',
        gmail: 'user@gmail.com',
        outlookEmail: 'user@outlook.com'
      };

      integrations.value[integration] = {
        connected: true,
        email: emailMap[integration]
      };
    }

    connecting.value[integration] = false;
  }, 1500);
}

// Function to load integration status from backend (mock implementation)
async function loadIntegrationStatus() {
  // In a real implementation, this would fetch from your backend
  // Simulating a connected Google Calendar for demonstration
  setTimeout(() => {
    integrations.value.googleCalendar = {
      connected: true,
      email: 'user@gmail.com'
    };
  }, 1000);
}

// Load integration status on component mount
onMounted(() => {
  loadIntegrationStatus();
});
</script>