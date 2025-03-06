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
          @click="createNewEvent"
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
      
      <!-- Event Modal Components -->
      <EventModal
        :show="showEventModal"
        :mode="eventModalMode"
        :event="selectedEvent"
        :processing="saveInProgress"
        @close="closeEventModal"
        @save="saveEvent"
        @edit="enterEditMode"
        @delete="openDeleteConfirmation"
      />
      
      <DeleteConfirmationModal
        :show="showDeleteConfirmation"
        :event="selectedEvent"
        :processing="deleteInProgress"
        @confirm="deleteEvent"
        @cancel="showDeleteConfirmation = false"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '@/components/layouts/AppLayout.vue';
import CalendarGrid from '@/components/calendar/CalendarGrid.vue';
import CalendarEvent from '@/components/calendar/CalendarEvent.vue';
import EventModal from '@/components/calendar/EventModal.vue';
import DeleteConfirmationModal from '@/components/calendar/DeleteConfirmationModal.vue';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { personalEventService} from '@/services/calendar/personalEvents';
import type { CalendarEvent as CalendarEventType } from '@/types/calendar';
import { cycleTrackingService, type CycleTrackingEntry } from '@/services/health/cycleTracking';
import { supabase } from '@/services/supabase';
import { getEventType } from '@/utils/calendarUtils';
import { getFamilyContext } from '@/utils/familyUtils';
import { handleApiError } from '@/utils/errorHandler';


// State variables
const router = useRouter();
const currentDate = ref(new Date());
const loading = ref(true);

// Event modal state
const showEventModal = ref(false);
const eventModalMode = ref<'create' | 'edit' | 'view'>('view');
const selectedEvent = ref<any>(null);
const showDeleteConfirmation = ref(false);
const saveInProgress = ref(false);
const deleteInProgress = ref(false);

// Important: Add these lock variables to prevent recursive data loading
const isLoadingData = ref(false);
const lastLoadedMonth = ref('');

// Data stores
const familyEvents = ref<any[]>([]);
const personalEvents = ref<CalendarEventType[]>([]);
const healthEvents = ref<any[]>([]);

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
function toggleFilter(type: string) {
  filters.value[type as keyof typeof filters.value] = !filters.value[type as keyof typeof filters.value];
}

// Get event indicators for a specific day
function getEventIndicators(day: any) {
  if (!day || !day.dateString) {
    return [];
  }
  
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
function getEventsForDay(day: any) {
  if (!day || !day.dateString) {
    return [];
  }

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
    if (!event || !event.start_time) return false;
    
    const eventStart = new Date(event.start_time);
    const eventEnd = event.end_time ? new Date(event.end_time) : new Date(event.start_time);
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


// Handle month change in the calendar
async function handleMonthChanged(data: any) {
  // Check if we're already loading data - prevents recursive calls
  if (isLoadingData.value) {
    console.log('Already loading data, skipping duplicate request');
    return;
  }
  
  // Create a month identifier to check for duplicates
  const monthId = `${data.year}-${data.month}`;
  
  // Skip if we just loaded this month (prevents reactivity loop)
  if (monthId === lastLoadedMonth.value) {
    console.log('Month already loaded, skipping duplicate request');
    return;
  }

  // Set lock flags
  isLoadingData.value = true;
  loading.value = true;
  
  // Remember this month so we don't reload it unnecessarily
  lastLoadedMonth.value = monthId;
  
  try {
    // Format dates for API requests
    const startDate = new Date(data.year, data.month, 1).toISOString();
    const endDate = new Date(data.year, data.month + 1, 0).toISOString();
    
    console.log('Loading data for date range:', { startDate, endDate });
    
    // Load events sequentially to prevent potential race conditions
    await loadFamilyEvents(startDate, endDate);
    
    if (isPersonalEventsEnabled.value) {
      await loadPersonalEvents(startDate, endDate);
    } else {
      personalEvents.value = [];
    }
    
    if (isHealthTrackingEnabled.value) {
      await loadHealthEvents(startDate, endDate);
    } else {
      healthEvents.value = [];
    }
  } catch (error) {
    console.error('Error loading events:', error);
  } finally {
    // Always release locks, even if there was an error
    loading.value = false;
    isLoadingData.value = false;
  }
}

// Load family events (placeholder implementation)
async function loadFamilyEvents(startDate: string, endDate: string) {
  try {
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
    return familyEvents.value;
  } catch (error) {
    console.error('Error loading family events:', error);
    familyEvents.value = [];
    throw error;
  }
}

// Load personal events
async function loadPersonalEvents(startDate: string, endDate: string) {
  if (!isPersonalEventsEnabled.value) {
    personalEvents.value = [];
    return [];
  }
  
  try {
    console.log('Loading personal events for date range:', { startDate, endDate });
    const response = await personalEventService.getEventsForDateRange(startDate, endDate);
    
    if (response.error) throw response.error;
    
    if (Array.isArray(response.data)) {
      // Add source identifier
      personalEvents.value = response.data.map(event => ({
        ...event,
        _source: event.event_type === 'work' ? 'work' : 'personal'
      }));
      return personalEvents.value;
    } else {
      console.warn('Unexpected response format from personalEventService:', response);
      personalEvents.value = [];
      return [];
    }
  } catch (error) {
    const errorDetails = handleApiError(error, 'loadPersonalEvents');
    personalEvents.value = [];
    return [];
  }
}

// Load health events
async function loadHealthEvents(startDate: string, endDate: string) {
  if (!isHealthTrackingEnabled.value) {
    healthEvents.value = [];
    return [];
  }
  
  try {
    const response = await cycleTrackingService.getEntriesForDateRange(startDate, endDate);
    
    if (response.error) throw response.error;
    
    if (Array.isArray(response.data)) {
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
      return healthEvents.value;
    } else {
      console.warn('Unexpected response format from cycleTrackingService:', response);
      healthEvents.value = [];
      return [];
    }
  } catch (error) {
    const errorDetails = handleApiError(error, 'loadHealthEvents');
    healthEvents.value = [];
    return [];
  }
}

// Refresh calendar data based on current month
function refreshCalendar() {
  handleMonthChanged({
    month: currentDate.value.getMonth(),
    year: currentDate.value.getFullYear()
  });
}

// Handle date selection
function handleDateSelected(data: any) {
  if (data && data.dateString) {
    // When user clicks on a date, create a new event pre-filled with that date
    const selectedDate = new Date(data.dateString);
    
    selectedEvent.value = {
      // Don't include an id field for new events
      title: '',
      event_type: 'personal',
      start_time: new Date(selectedDate).toISOString(),
      end_time: new Date(selectedDate).toISOString(),
      location: '',
      description: '',
      is_all_day: false,
      visibility: 'private',
    };
    
    eventModalMode.value = 'create';
    showEventModal.value = true;
  }
}

// Navigate to today
function goToToday() {
  currentDate.value = new Date();
  handleMonthChanged({
    month: currentDate.value.getMonth(),
    year: currentDate.value.getFullYear(),
    date: currentDate.value
  });
}

// Event Modal Functions

// View an event
function viewEvent(event: any) {
  selectedEvent.value = { ...event };
  eventModalMode.value = 'view';
  showEventModal.value = true;
}

// Create a new event
function createNewEvent() {
  selectedEvent.value = {
    // Don't include an id field for new events
    title: '',
    event_type: 'personal',
    start_time: new Date().toISOString(),
    end_time: new Date().toISOString(),
    location: '',
    description: '',
    is_all_day: false,
    visibility: 'private',
  };
  
  eventModalMode.value = 'create';
  showEventModal.value = true;
}

// Switch to edit mode
function enterEditMode(event: any) {
  selectedEvent.value = { ...event };
  eventModalMode.value = 'edit';
}

// Close the event modal
function closeEventModal() {
  showEventModal.value = false;
  selectedEvent.value = null;
}

// Open delete confirmation
function openDeleteConfirmation(event: any) {
  selectedEvent.value = event;
  showDeleteConfirmation.value = true;
}

// Save event (create or update)
async function saveEvent(eventData: any) {
  saveInProgress.value = true;
  
  try {
    // Get family context
    const { familyId, isPersonalOnly } = await getFamilyContext();
    
    // Set family ID only if user is part of a family
    if (!isPersonalOnly && familyId) {
      eventData.family_id = familyId;
    }
    
    // For personal-only use, ensure visibility is private
    if (isPersonalOnly) {
      eventData.visibility = 'private';
    }
    
    // Create a copy of the event data to avoid mutating the original
    const eventToSave = { ...eventData };
    
    // Determine if this is a create or update operation
    const isCreateMode = eventModalMode.value === 'create';
    let result;
    
    if (isCreateMode) {
      // For new events, remove the ID field so PostgreSQL can generate a UUID
      delete eventToSave.id;
      
      // Set the user_id field based on the current user
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        eventToSave.user_id = data.user.id;
      }
      
      result = await personalEventService.createEvent(eventToSave);
    } else {
      // For updates, make sure we have a valid ID
      if (!eventToSave.id) {
        throw new Error('Missing event ID for update operation');
      }
      result = await personalEventService.updateEvent(eventToSave.id, eventToSave);
    }
    
    if (result.error) throw result.error;
    
    // Close the modal and refresh data
    showEventModal.value = false;
    refreshCalendar();
    
  } catch (error) {
    const errorDetails = handleApiError(error, 'saveEvent');
    // You could also add UI feedback here, like a toast notification
  } finally {
    saveInProgress.value = false;
  }
}

// Delete event
async function deleteEvent(deleteData: { deleteEntireSeries: boolean; event: any }) {
  if (!deleteData.event || !deleteData.event.id) return;
  
  deleteInProgress.value = true;
  
  try {
    const result = await personalEventService.deleteEvent(
      deleteData.event.id,
      deleteData.deleteEntireSeries
    );
    
    if (result.error) throw result.error;
    
    // Close modals and refresh data
    showDeleteConfirmation.value = false;
    showEventModal.value = false;
    refreshCalendar();
    
  } catch (error) {
    const errorDetails = handleApiError(error, 'deleteEvent');
  } finally {
    deleteInProgress.value = false;
  }
}

// Initialize data on component mount
onMounted(() => {
  // Set a safety timeout to prevent infinite loading
  const safetyTimeout = setTimeout(() => {
    if (loading.value) {
      console.warn('Safety timeout triggered - forcing loading state to false');
      loading.value = false;
      isLoadingData.value = false;
    }
  }, 10000);
  
  // Load initial data
  handleMonthChanged({
    month: currentDate.value.getMonth(),
    year: currentDate.value.getFullYear()
  }).finally(() => {
    clearTimeout(safetyTimeout);
  });
});

// Fixed watcher to prevent reactivity loop
watch([isHealthTrackingEnabled, isPersonalEventsEnabled], () => {
  // Only reload if not already loading and if we've loaded something before
  if (!isLoadingData.value && lastLoadedMonth.value) {
    const [year, month] = lastLoadedMonth.value.split('-').map(Number);
    handleMonthChanged({ year, month });
  }
}, { immediate: false }); // IMPORTANT: immediate set to false
</script>
