<template>
  <AppLayout>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h2 class="text-xl font-semibold text-gray-900">Family Dashboard</h2>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Welcome to your family organization center.
        </p>
      </div>
      
      <!-- Dashboard Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <!-- Today's Schedule -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Today's Schedule</h3>
            
            <div v-if="loading" class="mt-4 flex justify-center">
              <svg class="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <div v-else class="mt-4">
              <div class="border-t border-gray-200 py-3">
                <p class="text-sm text-gray-500 italic">No events scheduled for today</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <router-link to="/calendar" class="font-medium text-primary-600 hover:text-primary-500">
                View full calendar <span aria-hidden="true">&rarr;</span>
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Recent Documents -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Recent Documents</h3>
            
            <div v-if="loading" class="mt-4 flex justify-center">
              <svg class="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <div v-else class="mt-4">
              <div class="border-t border-gray-200 py-3">
                <p class="text-sm text-gray-500 italic">No recent documents</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <router-link to="/documents" class="font-medium text-primary-600 hover:text-primary-500">
                View all documents <span aria-hidden="true">&rarr;</span>
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Notifications -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
            
            <div v-if="loading" class="mt-4 flex justify-center">
              <svg class="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <div v-else class="mt-4">
              <div class="border-t border-gray-200 py-3">
                <p class="text-sm text-gray-500 italic">No notifications</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                View all notifications <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Features Section -->
      <div v-if="isHealthTrackingEnabled || isPersonalEventsEnabled" class="border-t border-gray-200 px-4 py-5 sm:px-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Personal Features</h3>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Health Tracking Card -->
          <div v-if="isHealthTrackingEnabled" class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-pink-100 rounded-md p-3">
                  <svg class="h-6 w-6 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div class="ml-5">
                  <h4 class="text-lg font-medium leading-6 text-gray-900">Health Tracking</h4>
                  <p class="mt-2 text-sm text-gray-500">
                    Track your health data privately and securely with cycle tracking features.
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <router-link to="/health/cycle-tracking" class="font-medium text-primary-600 hover:text-primary-500">
                  Go to Health Tracking <span aria-hidden="true">&rarr;</span>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Personal Events Card -->
          <div v-if="isPersonalEventsEnabled" class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="ml-5">
                  <h4 class="text-lg font-medium leading-6 text-gray-900">Personal Events</h4>
                  <p class="mt-2 text-sm text-gray-500">
                    Manage your personal schedule with privacy controls for work and personal events.
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <router-link to="/personal-events" class="font-medium text-primary-600 hover:text-primary-500">
                  Go to Personal Events <span aria-hidden="true">&rarr;</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="px-4 py-5 sm:px-6 bg-gray-50 border-t border-gray-200">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
        <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <svg class="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Upload Document
          </button>
          <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <svg class="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add Event
          </button>
          <router-link v-if="isPersonalEventsEnabled" to="/personal-events" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <svg class="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Add Personal Event
          </router-link>
          <router-link v-if="isHealthTrackingEnabled" to="/health/cycle-tracking" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <svg class="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Track Health
          </router-link>
          <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <svg class="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Create Task
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import AppLayout from '@/components/layout/AppLayout.vue';
import { useUserPreferencesStore } from '@/stores/userPreferences';

const loading = ref(true);
const userPreferencesStore = useUserPreferencesStore();

// Computed properties for feature toggles
const isHealthTrackingEnabled = computed(() => userPreferencesStore.isHealthTrackingEnabled);
const isPersonalEventsEnabled = computed(() => userPreferencesStore.isPersonalEventsEnabled);

onMounted(() => {
  // Simulate loading data
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>
