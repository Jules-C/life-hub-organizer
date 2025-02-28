<template>
  <AppLayout>
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Unified Calendar</h2>
          <p class="mt-1 text-sm text-gray-500">
            View and manage all your events in one place
          </p>
        </div>
        <button
          @click="showAddEventMenu = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Event
        </button>
      </div>
      
      <!-- Event Type Filters -->
      <div class="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
        <div class="flex flex-wrap gap-2">
          <!-- Family Events Toggle -->
          <button
            @click="toggleFilter('family')"
            class="px-3 py-1.5 text-sm font-medium rounded-md"
            :class="filters.family ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            <svg class="inline-block -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Family Events
          </button>
          
          <!-- Personal Events Toggle -->
          <button
            v-if="isPersonalEventsEnabled"
            @click="toggleFilter('personal')"
            class="px-3 py-1.5 text-sm font-medium rounded-md"
            :class="filters.personal ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            <svg class="inline-block -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Events
          </button>
          
          <!-- Work Schedule Toggle -->
          <button
            v-if="isPersonalEventsEnabled"
            @click="toggleFilter('work')"
            class="px-3 py-1.5 text-sm font-medium rounded-md"
            :class="filters.work ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            <svg class="inline-block -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Work Schedule
          </button>
          
          <!-- Health Events Toggle -->
          <button
            v-if="isHealthTrackingEnabled"
            @click="toggleFilter('health')"
            class="px-3 py-1.5 text-sm font-medium rounded-md"
            :class="filters.health ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            <svg class="inline-block -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Health Events
          </button>
        </div>
      </div>
      
      <!-- Calendar Component -->
      <div class="p-4">
        <div v-if="loading" class="py-12 flex justify-center">
          <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <CalendarGrid
          v-else
          :initialDate="currentDate"
          @month-changed="handleMonthChanged"
          @date-selected="handleDateSelected"
        >
          <!-- Custom controls in the top right of the calendar -->
          <template #controls>
            <button
              type="button"
              class="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              @click="goToToday"
            >
              Today
            </button>
          </template>
          
          <!-- Date indicators (dots for events) -->
          <template #date-indicators="{ day }">
            <div v-if="getEventIndicators(day).length > 0" class="flex space-x-1">
              <div 
                v-for="indicator in getEventIndicators(day)" 
                :key="indicator.type"
                class="w-2 h-2 rounded-full"
                :class="indicator.class"
              ></div>
            </div>
          </template>
          
          <!-- Day content (events) -->
          <template #day-content="{ day }">
            <template v-for="event in getEventsForDay(day)" :key="event.id || event._id">
              <CalendarEvent 
                :event="event" 
                :eventType="getEventType(event)"
                @event-click="viewEvent(event)"
              />
            </template>
          </template>
        </CalendarGrid>
      </div>
      
      <!-- Simple "Add Event" Menu -->
      <div v-if="showAddEventMenu" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showAddEventMenu = false"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
            <div>
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Select Event Type
                </h3>
                <div class="mt-4 space-y-2">
                  <button
                    @click="goToEventCreator('family')"
                    class="w-full text-left px-4 py-2 border rounded-md hover:bg-purple-50"
                  >
                    <span class="font-medium text-purple-800">Family Event</span>
                  </button>
                  
                  <button
                    v-if="isPersonalEventsEnabled"
                    @click="goToEventCreator('personal')"
                    class="w-full text-left px-4 py-2 border rounded-md hover:bg-blue-50"
                  >
                    <span class="font-medium text-blue-800">Personal Event</span>
                  </button>
                  
                  <button
                    v-if="isPersonalEventsEnabled"
                    @click="goToEventCreator('work')"
                    class="w-full text-left px-4 py-2 border rounded-md hover:bg-emerald-50"
                  >
                    <span class="font-medium text-emerald-800">Work Schedule</span>
                  </button>
                  
                  <button
                    v-if="isHealthTrackingEnabled"
                    @click="goToEventCreator('health')"
                    class="w-full text-left px-4 py-2 border rounded-md hover:bg-pink-50"
                  >
                    <span class="font-medium text-pink-800">Health Entry</span>
                  </button>
                </div>
                
                <div class="mt-5 sm:mt-6">
                  <button
                    type="button"
                    class="w-full inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="showAddEventMenu = false"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue';
import CalendarGrid from '@/components/calendar/CalendarGrid.vue';
import CalendarEvent from '@/components/calendar/CalendarEvent.vue';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { personalEventService } from '@/services/calendar/personalEvents';
import { cycleTrackingService } from '@/services/health/cycleTracking';

// State variables
const router = useRouter();
const currentDate = ref(new Date());
const loading = ref(true);
const showAddEventMenu = ref(false);

// Data stores
const familyEvents = ref([]);
const personalEvents = ref([]);
const healthEvents = ref([]);

// User preferences
const userPreferencesStore = useUserPreferencesStore();
const isHealthTrackingEnabled = computed(() => userPreferencesStore.isHealthTrackingEnabled);
const isPersonalEventsEnabled = computed(() => userPreferencesStore.isPersonalEventsEnabled);

// Filter settings
const filters = ref({
  family: true,
  personal: true,
  work: true,
  health: true
});

// Functions to handle filter toggling
function toggleFilter(type) {
  filters.value[type] = !filters.value[type];
}

// Get event indicators for a specific day
function getEventIndicators(day) {
  const indicators = [];
  const eventsForDay = getEventsForDay(day);
  
  // Check for family events
  if (eventsForDay.some(event => event._source === 'family')) {
    indicators.push({ type: 'family', class: 'bg-purple-500' });
  }
  
  // Check for personal events
  if (eventsForDay.some(event => event._source === 'personal')) {
    indicators.push({ type: 'personal', class: 'bg-blue-500' });
  }
  
  // Check for work events
  if (eventsForDay.some(event => event._source === 'work' || event.event_type === 'work')) {
    indicators.push({ type: 'work', class: 'bg-emerald-500' });
  }
  
  // Check for health events
  if (eventsForDay.some(event => event._source === 'health')) {
    indicators.push({ type: 'health', class: 'bg-pink-500' });
  }
  
  return indicators;
}

// Get all events for a specific day
function getEventsForDay(day) {
  // Get all visible events based on filters
  const allEvents = [];
  
  if (filters.value.family) {
    allEvents.push(...familyEvents.value);
  }
  
  if (filters.value.personal && isPersonalEventsEnabled.value) {
    allEvents.push(...personalEvents.value.filter(e => e.event_type !== 'work'));
  }
  
  if (filters.value.work && isPersonalEventsEnabled.value) {
    allEvents.push(...personalEvents.value.filter(e => e.event_type === 'work'));
  }
  
  if (filters.value.health && isHealthTrackingEnabled.value) {
    allEvents.push(...healthEvents.value);
  }
  
  // Filter to only events on this day
  return allEvents.filter(event => {
    const eventStart = new Date(event.start_time);
    const eventEnd = new Date(event.end_time || event.start_time);
    const dayDate = new Date(day.dateString);
    
    // Set time to 00:00:00 for date comparison
    const dateStart = new Date(dayDate);
    dateStart.setHours(0, 0, 0, 0);
    
    // Set time to 23:59:59 for end of day
    const dateEnd = new Date(dayDate);
    dateEnd.setHours(23, 59, 59, 999);
    
    return eventStart <= dateEnd && eventEnd >= dateStart;
  });
}

// Get the event type for styling purposes
function getEventType(event) {
  if (event._source === 'family') return 'family';
  if (event._source === 'health') return 'health';
  if (event._source === 'work' || event.event_type === 'work') return 'work';
  if (event._source === 'personal') return 'personal';
  return 'default';
}

// Handle month change in the calendar
async function handleMonthChanged(data) {
  loading.value = true;
  try {
    // Format dates for API requests
    const startDate = new Date(data.year, data.month, 1).toISOString();
    const endDate = new Date(data.year, data.month + 1, 0).toISOString();
    
    // Load data in parallel
    await Promise.all([
      loadFamilyEvents(startDate, endDate),
      loadPersonalEvents(startDate, endDate),
      loadHealthEvents(startDate, endDate)
    ]);
  } catch (error) {
    console.error('Error loading events:', error);
  } finally {
    loading.value = false;
  }
}

// Load family events (placeholder implementation)
async function loadFamilyEvents(startDate, endDate) {
  // This is a placeholder. In a real implementation, you would
  // fetch family events from a service
  familyEvents.value = [
    {
      _id: 'family-event-1',
      title: 'Family Dinner',
      start_time: new Date().toISOString(),
      end_time: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
      _source: 'family'
    },
    {
      _id: 'family-event-2',
      title: 'Movie Night',
      start_time: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
      end_time: new Date(new Date(new Date().setDate(new Date().getDate() + 3)).getTime() + 3 * 60 * 60 * 1000).toISOString(),
      _source: 'family'
    }
  ];
}

// Load personal events
async function loadPersonalEvents(startDate, endDate) {
  if (!isPersonalEventsEnabled.value) {
    personalEvents.value = [];
    return;
  }
  
  try {
    const response = await personalEventService.getEventsForDateRange(startDate, endDate);
    
    if (response.data) {
      // Add source identifier
      personalEvents.value = response.data.map(event => ({
        ...event,
        _source: event.event_type === 'work' ? 'work' : 'personal'
      }));
    }
  } catch (error) {
    console.error('Error loading personal events:', error);
    personalEvents.value = [];
  }
}

// Load health events
async function loadHealthEvents(startDate, endDate) {
  if (!isHealthTrackingEnabled.value) {
    healthEvents.value = [];
    return;
  }
  
  try {
    const response = await cycleTrackingService.getEntriesForDateRange(startDate, endDate);
    
    if (response.data) {
      // Convert health entries to calendar-compatible format
      healthEvents.value = response.data.map(entry => {
        // Create start and end times
        const startDate = new Date(entry.start_date);
        const endDate = entry.end_date ? new Date(entry.end_date) : new Date(startDate);
        
        if (!entry.end_date) {
          endDate.setHours(23, 59, 59);
        }
        
        return {
          _id: entry.id,
          title: 'Cycle Entry',
          description: entry.notes || 'Health tracking entry',
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString(),
          is_all_day: true,
          is_private: entry.is_private,
          _source: 'health',
          // Preserve original data
          original: entry
        };
      });
    }
  } catch (error) {
    console.error('Error loading health events:', error);
    healthEvents.value = [];
  }
}

// Handle date selection
function handleDateSelected(data) {
  console.log('Date selected:', data.dateString);
  // Pre-filling date in the appropriate form could be implemented here
}

// Navigate to today
function goToToday() {
  currentDate.value = new Date();
  handleMonthChanged({
    month: currentDate.value.getMonth(),
    year: currentDate.value.getFullYear()
  });
}

// View event details
function viewEvent(event) {
  // Based on event type, navigate to the appropriate editor
  switch (getEventType(event)) {
    case 'family':
      // Navigate to family event editor
      console.log('View family event:', event);
      break;
    case 'personal':
    case 'work':
      // Navigate to personal event editor
      console.log('View personal/work event:', event);
      break;
    case 'health':
      // Navigate to health entry editor
      console.log('View health entry:', event);
      break;
  }
}

// Navigate to the appropriate event creator
function goToEventCreator(type) {
  showAddEventMenu.value = false;
  
  switch (type) {
    case 'family':
      router.push('/calendar'); // Navigate to family calendar
      break;
    case 'personal':
    case 'work':
      router.push('/personal-events'); // Navigate to personal events
      break;
    case 'health':
      router.push('/health/cycle-tracking'); // Navigate to health tracking
      break;
  }
}

// Initialize data on component mount
onMounted(async () => {
  await handleMonthChanged({
    month: currentDate.value.getMonth(),
    year: currentDate.value.getFullYear()
  });
});

// Watch for feature toggle changes
watch([isHealthTrackingEnabled, isPersonalEventsEnabled], async () => {
  await handleMonthChanged({
    month: currentDate.value.getMonth(),
    year: currentDate.value.getFullYear()
  });
});
</script>