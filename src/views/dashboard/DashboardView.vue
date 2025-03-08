<template>
  <AppLayout>
    <!-- Welcome Banner with Logo -->
    <div class="bg-white shadow-sm rounded-lg mb-6 overflow-hidden">
      <div class="px-6 py-8 flex items-center border-b border-gray-100">
        <img src="/src/public/android-chrome-512x512.png" alt="LifeHubOrganizer Logo" class="h-16 w-16 rounded-full mr-6" />
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Welcome to LifeHubOrganizer</h1>
          <p class="mt-1 text-lg text-gray-500">
            Your central hub for family organization
          </p>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div class="px-6 py-4 bg-gray-50 flex flex-wrap gap-8">
        <div class="flex items-center">
          <div class="text-blue-600 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-gray-500">Today</div>
            <div class="text-lg font-semibold">{{ currentDate }}</div>
          </div>
        </div>
        
        <div v-if="todayEventCount > 0" class="flex items-center">
          <div class="text-purple-600 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-gray-500">Events Today</div>
            <div class="text-lg font-semibold">{{ todayEventCount }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main App Sections -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Calendar Card -->
      <router-link to="/calendar" class="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-all duration-200">
        <div class="h-36 bg-blue-50 flex items-center justify-center">
          <svg class="h-16 w-16 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900">Calendar</h3>
          <p class="mt-1 text-sm text-gray-500">
            View and manage all your events in the unified calendar
          </p>
        </div>
      </router-link>
      
      <!-- Settings Card -->
      <router-link to="/settings" class="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-all duration-200">
        <div class="h-36 bg-gray-50 flex items-center justify-center">
          <svg class="h-16 w-16 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900">Settings</h3>
          <p class="mt-1 text-sm text-gray-500">
            Configure your preferences and manage features
          </p>
        </div>
      </router-link>
      
      <!-- Health Card -->
      <router-link
        v-if="isHealthTrackingEnabled"
        to="/calendar?filter=health"
        class="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-all duration-200"
      >
        <div class="h-36 bg-pink-50 flex items-center justify-center">
          <svg class="h-16 w-16 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900">Health</h3>
          <p class="mt-1 text-sm text-gray-500">
            Track and manage your health events and data
          </p>
        </div>
      </router-link>
      
      <!-- Documents Card (Placeholder for future feature) -->
      <div v-if="!isHealthTrackingEnabled" class="bg-white overflow-hidden shadow-sm rounded-lg opacity-60">
        <div class="h-36 bg-gray-50 flex items-center justify-center">
          <svg class="h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900">Documents</h3>
          <p class="mt-1 text-sm text-gray-500">
            Feature coming soon
          </p>
        </div>
      </div>
    </div>
    
    <!-- Today's Events -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-medium text-gray-900">Today's Schedule</h2>
        <router-link to="/calendar" class="text-sm font-medium text-primary-600 hover:text-primary-500">
          View Calendar
        </router-link>
      </div>
      
      <div v-if="loading" class="py-12 flex justify-center">
        <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="todayEvents.length === 0" class="py-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No events today</h3>
        <p class="mt-1 text-sm text-gray-500">Your schedule is clear for today.</p>
        <div class="mt-6">
          <router-link to="/calendar" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
            Add an event
          </router-link>
        </div>
      </div>
      
      <div v-else class="divide-y divide-gray-200">
        <div v-for="event in todayEvents" :key="event.id" class="p-4 hover:bg-gray-50">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="h-4 w-4 rounded-full block" :style="{ backgroundColor: event.color }"></span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ event.title }}</p>
              <p class="text-xs text-gray-500">
                {{ event.is_all_day ? 'All day' : formatTimeRange(event.start_time, event.end_time) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Quick Actions</h2>
      </div>
      
      <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link to="/calendar" class="inline-flex justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <svg class="mr-3 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Event
        </router-link>
        
        <router-link 
          v-if="isHealthTrackingEnabled" 
          to="/calendar?filter=health" 
          class="inline-flex justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          <svg class="mr-3 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Log Health Data
        </router-link>
        
        <router-link 
          to="/settings" 
          class="inline-flex justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg class="mr-3 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35.0a1.724 1.724.0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724.0 001.065 2.572c1.756.426 1.756 2.924.0 3.35a1.724 1.724.0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724.0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35.0a1.724 1.724.0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724.0 00-1.065-2.572c-1.756-.426-1.756-2.924.0-3.35a1.724 1.724.0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import AppLayout from '@/components/layouts/AppLayout.vue';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { eventService } from '@/services/events';
import { formatTime } from '@/utils/dateUtils';
import { CalendarEvent } from '@/types/calendar';

// State
const loading = ref(true);
const todayEvents = ref<CalendarEvent[]>([]);
const userPreferencesStore = useUserPreferencesStore();

// Computed properties
const isHealthTrackingEnabled = computed(() => userPreferencesStore.isHealthTrackingEnabled);
const isPersonalEventsEnabled = computed(() => userPreferencesStore.isPersonalEventsEnabled);

const todayEventCount = computed(() => todayEvents.value.length);

// Format current date in a nice readable format
const currentDate = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
});

// Format time range for events
function formatTimeRange(startTime: string, endTime: string) {
  if (!startTime || !endTime) return '';
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

// Load today's events
async function loadTodayEvents() {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();
    
    const response = await eventService.getEventsForDateRange(startOfDay, endOfDay);
    
    if (response.error) {
      console.error('Error loading today\'s events:', response.error);
      todayEvents.value = [];
    } else {
      todayEvents.value = response.data || [];
    }
  } catch (error) {
    console.error('Failed to load today\'s events:', error);
    todayEvents.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  // Load today's events
  await loadTodayEvents();
});
</script>