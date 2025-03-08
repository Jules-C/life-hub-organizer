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
            @click="toggleFilter('family' as EventType)"
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
            v-if="isWorkScheduleEnabled"
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

          <!-- Visibility Filter -->
          <div class="ml-auto flex items-center">
            <span class="text-sm text-gray-600 mr-2">Show:</span>
            <select 
              v-model="visibilityFilter"
              class="text-sm border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              @change="loadEvents"
            >
              <option value="all">All Events</option>
              <option value="private">My Private Events</option>
              <option value="family">Family Shared Events</option>
              <option value="public">Public Events</option>
            </select>
          </div>
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
            <template v-for="event in getEventsForDay(day)" :key="event.id">
              <CalendarEvent 
                :event="event" 
                :eventType="event.event_type"
                @event-click="viewEvent(event)"
              />
            </template>
          </template>
        </CalendarGrid>
      </div>
      
      <!-- Upcoming Events Section -->
      <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Upcoming Events</h3>
        
        <div v-if="loading" class="py-4 flex justify-center">
          <svg class="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <div v-else-if="upcomingEvents.length === 0" class="py-4 text-center">
          <p class="text-gray-500">No upcoming events based on your current filters.</p>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="event in upcomingEvents" :key="event.id" 
            class="border border-gray-200 rounded-md p-4 hover:bg-gray-50 cursor-pointer"
            @click="viewEvent(event)"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-sm font-medium text-gray-900 flex items-center">
                  <span 
                    class="w-3 h-3 rounded-full mr-2"
                    :class="getEventDotClass(event)"
                  ></span>
                  {{ event.title }}
                </h4>
                <p class="mt-1 text-sm text-gray-500">
                  {{ formatDateTime(event.start_time) }}
                  <span v-if="!event.is_all_day">- {{ formatTime(event.end_time) }}</span>
                </p>
                <p v-if="event.location" class="mt-1 text-sm text-gray-500">
                  {{ event.location }}
                </p>
                
                <!-- Event type badge -->
                <div class="mt-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getEventBadgeClass(event)">
                    {{ getEventTypeName(event.event_type) }}
                  </span>
                  
                  <!-- Visibility badge if not private -->
                  <span v-if="event.visibility !== 'private'" 
                    class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getVisibilityBadgeClass(event.visibility)">
                    {{ getVisibilityName(event.visibility) }}
                  </span>
                </div>
                
                <!-- Health event specific display -->
                <div v-if="event.event_type === 'health' && event.metadata && event.metadata.symptoms" class="mt-2">
                  <div v-if="hasSymptoms(event.metadata.symptoms)" class="flex flex-wrap gap-1">
                    <span v-for="(value, symptom) in event.metadata.symptoms" :key="symptom" 
                      v-show="value"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      {{ symptom }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Event Modal Components -->
      <EventModal
        :show="showEventModal"
        :mode="eventModalMode"
        :event="eventForModal"
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
import { useRouter, useRoute } from 'vue-router';
import AppLayout from '@/components/layouts/AppLayout.vue';
import CalendarGrid from '@/components/calendar/CalendarGrid.vue';
import CalendarEvent from '@/components/calendar/CalendarEvent.vue';
import EventModal from '@/components/calendar/EventModal.vue';
import DeleteConfirmationModal from '@/components/calendar/DeleteConfirmationModal.vue';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { eventService, type EventFilters } from '@/services/events';
import type { CalendarEvent as CalendarEventType, EventType, EventVisibility } from '@/types/calendar';
import { formatDateTime, formatTime } from '@/utils/dateUtils';
import { getFamilyContext } from '@/utils/familyUtils';
import { handleApiError } from '@/utils/errorHandler';

// Router and store
const router = useRouter();
const userPreferencesStore = useUserPreferencesStore();

// State variables
const currentDate = ref(new Date());
const loading = ref(true);
const events = ref<CalendarEventType[]>([]);
const familyId = ref<string | null>(null);
const isPersonalOnly = ref(true);

// Event modal state
const showEventModal = ref(false);
const eventModalMode = ref<'create' | 'edit' | 'view'>('view');
const selectedEvent = ref<CalendarEventType | undefined>(undefined);
const saveInProgress = ref(false);
const showDeleteConfirmation = ref(false);
const deleteInProgress = ref(false);

// Important: Add these lock variables to prevent recursive data loading
const isLoadingData = ref(false);
const lastLoadedMonth = ref('');

// User preferences
const isHealthTrackingEnabled = computed(() => userPreferencesStore.isHealthTrackingEnabled);
const isPersonalEventsEnabled = computed(() => userPreferencesStore.isPersonalEventsEnabled);
const isWorkScheduleEnabled = computed(() => userPreferencesStore.isWorkScheduleEnabled);

// Filter settings
const filters = ref({
  family: true,
  personal: true,
  work: true,
  health: true
});

const visibilityFilter = ref('all');

// Computed properties
const activeEventTypes = computed((): EventType[] => {
  const types: EventType[] = [];
  if (filters.value.family) types.push('family');
  if (filters.value.personal) types.push('personal');
  if (filters.value.work) types.push('work');
  if (filters.value.health) types.push('health');
  return types;
});

const activeVisibilityTypes = computed((): EventVisibility[] | undefined => {
  if (visibilityFilter.value === 'all') return undefined;
  if (visibilityFilter.value === 'private') return ['private'];
  if (visibilityFilter.value === 'family') return ['family'];
  if (visibilityFilter.value === 'public') return ['public'];
  return undefined;
});

const eventForModal = computed(() => selectedEvent.value || { 
  title: '',
  event_type: 'personal' as EventType,
  start_time: '',
  end_time: '',
  is_all_day: false,
  visibility: 'private' as EventVisibility
});

// Get filtered events
const filteredEvents = computed(() => {
  return events.value.filter(event => {
    // Filter by event type
    if (!activeEventTypes.value.includes(event.event_type)) {
      return false;
    }
    
    // Filter by visibility
    if (activeVisibilityTypes.value && !activeVisibilityTypes.value.includes(event.visibility)) {
      return false;
    }
    
    return true;
  });
});

// Get upcoming events
const upcomingEvents = computed(() => {
  const now = new Date();
  return filteredEvents.value
    .filter(event => new Date(event.start_time) >= now)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 5);
});

// Functions to handle filter toggling
function toggleFilter(type: EventType) {
  filters.value[type as keyof typeof filters.value] = !filters.value[type as keyof typeof filters.value];
  
  // Update URL query parameter to reflect current filter state
  const router = useRouter();
  
  // If only one filter is active, add it as a query parameter
  const activeFilters = Object.entries(filters.value)
    .filter(([_, isActive]) => isActive)
    .map(([filterName]) => filterName);
  
  if (activeFilters.length === 1) {
    router.replace({ 
      query: { ...router.currentRoute.value.query, filter: activeFilters[0] }
    });
  } else {
    // If multiple or no filters are active, remove the filter parameter
    const query = { ...router.currentRoute.value.query };
    delete query.filter;
    router.replace({ query });
  }
}

// Get event indicators for a specific day
function getEventIndicators(day: any) {
  if (!day || !day.dateString) {
    return [];
  }
  
  const indicators = [];
  const eventsForDay = getEventsForDay(day);
  
  // Check for family events
  if (eventsForDay.some(event => event.event_type === 'family')) {
    indicators.push({ type: 'family', class: 'bg-purple-500' });
  }
  
  // Check for personal events
  if (eventsForDay.some(event => event.event_type === 'personal')) {
    indicators.push({ type: 'personal', class: 'bg-blue-500' });
  }
  
  // Check for work events
  if (eventsForDay.some(event => event.event_type === 'work')) {
    indicators.push({ type: 'work', class: 'bg-emerald-500' });
  }
  
  // Check for health events
  if (eventsForDay.some(event => event.event_type === 'health')) {
    indicators.push({ type: 'health', class: 'bg-pink-500' });
  }
  
  return indicators;
}

// Get all events for a specific day
function getEventsForDay(day: any) {
  if (!day || !day.dateString) {
    return [];
  }

  // Filter to only events on this day
  return filteredEvents.value.filter(event => {
    const eventStart = new Date(event.start_time);
    const eventEnd = new Date(event.end_time);
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
  
  // Update current date
  if (data.date) {
    currentDate.value = new Date(data.date);
  } else {
    currentDate.value = new Date(data.year, data.month);
  }
  
  await loadEvents();
  
  // Release locks
  loading.value = false;
  isLoadingData.value = false;
}

// Load events with current filters
async function loadEvents() {
  try {
    // Format dates for API requests
    const startDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).toISOString();
    const endDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0).toISOString();
    
    console.log('Loading data for date range:', { startDate, endDate });
    
    // Create filter object
    const filterOptions: EventFilters = {
      eventTypes: activeEventTypes.value,
      startDate,
      endDate,
      visibility: activeVisibilityTypes.value
    };
    
    // Load events
    const response = await eventService.getEventsForDateRange(startDate, endDate, filterOptions);
    
    if (response.error) throw response.error;
    
    events.value = response.data || [];
    
    // If we need shared events from family members too
    if (!isPersonalOnly.value && familyId.value) {
      const sharedResponse = await eventService.getSharedEvents(startDate, endDate);
      if (!sharedResponse.error && sharedResponse.data) {
        // Combine with our personal events
        events.value = [...events.value, ...sharedResponse.data];
      }
    }
  } catch (error) {
    console.error('Error loading events:', error);
    const errorDetails = handleApiError(error, 'loadEvents');
    events.value = [];
  }
}

// Handle date selection
function handleDateSelected(data: any) {
  if (data && data.dateString) {
    // When user clicks on a date, create a new event pre-filled with that date
    const selectedDate = new Date(data.dateString);
    
    // Create start time at 9 AM
    const startTime = new Date(selectedDate);
    startTime.setHours(9, 0, 0, 0);
    
    // Create end time at 10 AM
    const endTime = new Date(selectedDate);
    endTime.setHours(10, 0, 0, 0);
    
    selectedEvent.value = {
      title: '',
      event_type: 'personal',
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
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
function viewEvent(event: CalendarEventType) {
  selectedEvent.value = { ...event };
  eventModalMode.value = 'view';
  showEventModal.value = true;
}

// Create a new event
function createNewEvent() {
  // Create start time at 9 AM today
  const startTime = new Date();
  startTime.setHours(9, 0, 0, 0);
  
  // Create end time at 10 AM today
  const endTime = new Date();
  endTime.setHours(10, 0, 0, 0);
  
  selectedEvent.value = {
    title: '',
    event_type: 'personal',
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    location: '',
    description: '',
    is_all_day: false,
    visibility: 'private',
  };
  
  eventModalMode.value = 'create';
  showEventModal.value = true;
}

// Switch to edit mode
function enterEditMode(event: CalendarEventType) {
  selectedEvent.value = { ...event };
  eventModalMode.value = 'edit';
}

// Close the event modal
function closeEventModal() {
  showEventModal.value = false;
  selectedEvent.value = undefined;
}

// Open delete confirmation
function openDeleteConfirmation(event: CalendarEventType) {
  selectedEvent.value = event;
  showDeleteConfirmation.value = true;
}

// Save event (create or update)
async function saveEvent(eventData: CalendarEventType) {
  saveInProgress.value = true;
  
  try {
    // Get family context
    const { familyId: fid, isPersonalOnly: personal } = await getFamilyContext();
    familyId.value = fid;
    isPersonalOnly.value = personal;
    
    // Set family ID only if user is part of a family
    if (!isPersonalOnly.value && familyId.value) {
      eventData.family_id = familyId.value;
    }
    
    // For personal-only use, ensure visibility is private
    if (isPersonalOnly.value) {
      eventData.visibility = 'private';
    }
    
    // Create a copy of the event data to avoid mutating the original
    const eventToSave = { ...eventData };
    
    // Determine if this is a create or update operation
    const isCreateMode = eventModalMode.value === 'create';
    let result;
    
    if (isCreateMode) {
      // For new events, remove the ID field
      delete eventToSave.id;
      
      result = await eventService.createEvent(eventToSave);
    } else {
      // For updates, make sure we have a valid ID
      if (!eventToSave.id) {
        throw new Error('Missing event ID for update operation');
      }
      result = await eventService.updateEvent(eventToSave.id, eventToSave);
    }
    
    if (result.error) throw result.error;
    
    // Close the modal and refresh data
    showEventModal.value = false;
    await loadEvents();
    
  } catch (error) {
    const errorDetails = handleApiError(error, 'saveEvent');
    // You could also add UI feedback here, like a toast notification
  } finally {
    saveInProgress.value = false;
  }
}

// Delete event
async function deleteEvent(deleteData: { deleteEntireSeries: boolean; event: CalendarEventType }) {
  if (!deleteData.event || !deleteData.event.id) return;
  
  deleteInProgress.value = true;
  
  try {
    const result = await eventService.deleteEvent(
      deleteData.event.id,
      deleteData.deleteEntireSeries
    );
    
    if (result.error) throw result.error;
    
    // Close modals and refresh data
    showDeleteConfirmation.value = false;
    showEventModal.value = false;
    await loadEvents();
    
  } catch (error) {
    const errorDetails = handleApiError(error, 'deleteEvent');
  } finally {
    deleteInProgress.value = false;
  }
}

// Helper functions
function getEventDotClass(event: CalendarEventType): string {
  switch (event.event_type) {
    case 'personal': return 'bg-blue-500';
    case 'family': return 'bg-purple-500';
    case 'health': return 'bg-pink-500';
    case 'work': return 'bg-emerald-500';
    default: return 'bg-gray-500';
  }
}

function getEventBadgeClass(event: CalendarEventType): string {
  switch (event.event_type) {
    case 'personal': return 'bg-blue-100 text-blue-800';
    case 'family': return 'bg-purple-100 text-purple-800';
    case 'health': return 'bg-pink-100 text-pink-800';
    case 'work': return 'bg-emerald-100 text-emerald-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getVisibilityBadgeClass(visibility: string): string {
  switch (visibility) {
    case 'family': return 'bg-purple-50 text-purple-700';
    case 'public': return 'bg-indigo-50 text-indigo-700';
    default: return 'bg-gray-50 text-gray-700';
  }
}

function getEventTypeName(type: EventType): string {
  switch (type) {
    case 'personal': return 'Personal';
    case 'family': return 'Family';
    case 'health': return 'Health';
    case 'work': return 'Work';
    default: return 'Event';
  }
}

function getVisibilityName(visibility: string): string {
  switch (visibility) {
    case 'family': return 'Shared with Family';
    case 'public': return 'Public';
    default: return 'Private';
  }
}

function hasSymptoms(symptoms: Record<string, boolean> | undefined): boolean {
  if (!symptoms) return false;
  return Object.values(symptoms).some(value => value);
}

// Initialize data on component mount
onMounted(async () => {
  // Check family context
  const context = await getFamilyContext();
  familyId.value = context.familyId;
  isPersonalOnly.value = context.isPersonalOnly;
  
  // Handle initial filter from URL
  const route = useRoute();
  if (route.query.filter) {
    const filterType = route.query.filter as string;
    
    // Reset all filters first
    Object.keys(filters.value).forEach(key => {
      filters.value[key as keyof typeof filters.value] = false;
    });
    
    // Enable only the requested filter
    if (filterType in filters.value) {
      filters.value[filterType as keyof typeof filters.value] = true;
    }
  }
  
  // Set a safety timeout to prevent infinite loading
  const safetyTimeout = setTimeout(() => {
    if (loading.value) {
      console.warn('Safety timeout triggered - forcing loading state to false');
      loading.value = false;
      isLoadingData.value = false;
    }
  }, 10000);
  
  // Load initial data
  await handleMonthChanged({
    month: currentDate.value.getMonth(),
    year: currentDate.value.getFullYear()
  });
  
  clearTimeout(safetyTimeout);
});

// Watch for feature flag changes
watch([isHealthTrackingEnabled, isPersonalEventsEnabled, isWorkScheduleEnabled], () => {
  // Only reload if not already loading and if we've loaded something before
  if (!isLoadingData.value && lastLoadedMonth.value) {
    loadEvents();
  }
}, { immediate: false });

// Watch for filter changes
watch([activeEventTypes, activeVisibilityTypes], () => {
  // No need to reload data from the server, just filter the existing data
  console.log('Filters changed, applying new filters');
}, { immediate: false });
</script>