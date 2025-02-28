<template>
  <AppLayout>
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Family Calendar</h2>
          <p class="mt-1 text-sm text-gray-500">
            Manage your family's schedule in one place
          </p>
        </div>
        <button
          @click="openAddEventModal"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Event
        </button>
      </div>
      
      <!-- Calendar Header -->
      <!-- Calendar Types Navigation -->
      <div class="flex border-t border-gray-200 bg-gray-50 px-6 py-3">
        <nav class="flex space-x-4">
          <a
            href="#"
            class="px-3 py-1 text-sm font-medium rounded-md bg-primary-100 text-primary-700"
          >
            Family Calendar
          </a>
          <router-link
            v-if="isPersonalEventsEnabled"
            to="/personal-events"
            class="px-3 py-1 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            Personal Events
          </router-link>
        </nav>
      </div>
      
      <div class="flex items-center justify-between px-6 py-2 border-t border-b border-gray-200 bg-gray-50">
        <div class="flex">
          <button
            type="button"
            class="p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="sr-only">Previous month</span>
          </button>
          <button
            type="button"
            class="ml-2 p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="sr-only">Next month</span>
          </button>
          <h2 class="mx-4 text-lg font-semibold text-gray-900">{{ currentMonth }}</h2>
        </div>
        <div class="flex">
          <button
            type="button"
            class="ml-2 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Today
          </button>
          <select
            class="ml-2 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <option>Month</option>
            <option>Week</option>
            <option>Day</option>
          </select>
        </div>
      </div>
      
      <!-- Calendar Grid -->
      <div v-if="loading" class="py-12 flex justify-center">
        <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else class="p-4">
        <!-- Calendar grid -->
        <div class="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          <!-- Calendar header row (day names) -->
          <div 
            v-for="day in dayNames" 
            :key="day"
            class="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
          >
            {{ day }}
          </div>
          
          <!-- Calendar cells -->
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="min-h-[100px] p-2 bg-white border-t border-gray-200"
            :class="{ 
              'bg-gray-50': !day.isCurrentMonth,
              'bg-blue-50': day.isToday
            }"
          >
            <div class="flex justify-between">
              <span 
                class="text-sm font-medium"
                :class="day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'"
              >
                {{ day.date }}
              </span>
              <span v-if="day.isToday" class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white text-sm">
                {{ day.date }}
              </span>
            </div>
            
            <!-- Empty state for each day -->
            <div class="mt-2">
              <!-- Events would go here -->
            </div>
          </div>
        </div>
      </div>
      
      <!-- Calendar connection message -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
        <p class="text-sm text-gray-500">
          No calendars connected. 
          <button class="text-primary-600 font-medium hover:text-primary-500">Connect a calendar</button>
          to start managing your family's schedule.
        </p>
      </div>
    </div>
    
    <!-- Add Event Modal -->
    <div v-if="showAddEventModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showAddEventModal = false"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Add New Event</h3>
                <div class="mt-4 space-y-4">
                  <!-- Event Form -->
                  <div>
                    <label for="event-title" class="block text-sm font-medium text-gray-700">Event Title</label>
                    <input
                      type="text"
                      id="event-title"
                      v-model="newEvent.title"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter event title"
                    />
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="event-start" class="block text-sm font-medium text-gray-700">Start Time</label>
                      <input
                        type="datetime-local"
                        id="event-start"
                        v-model="newEvent.startTime"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label for="event-end" class="block text-sm font-medium text-gray-700">End Time</label>
                      <input
                        type="datetime-local"
                        id="event-end"
                        v-model="newEvent.endTime"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label for="event-location" class="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      id="event-location"
                      v-model="newEvent.location"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Event location (optional)"
                    />
                  </div>
                  
                  <div>
                    <label for="event-description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="event-description"
                      v-model="newEvent.description"
                      rows="3"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Event description (optional)"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="saveEvent"
            >
              Save
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="showAddEventModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AppLayout from '@/components/layout/AppLayout.vue';
import { useUserPreferencesStore } from '@/stores/userPreferences';

const loading = ref(true);
const currentDate = ref(new Date());
const userPreferencesStore = useUserPreferencesStore();
const isPersonalEventsEnabled = computed(() => userPreferencesStore.isPersonalEventsEnabled);

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const currentMonth = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  // Get first day of the month
  const firstDay = new Date(year, month, 1);
  // Get last day of the month
  const lastDay = new Date(year, month + 1, 0);
  
  // Get the day of the week for the first day (0-6)
  const firstDayOfWeek = firstDay.getDay();
  
  // Array to hold all calendar cells
  const days = [];
  
  // Add days from previous month to fill the first row
  const prevMonth = new Date(year, month, 0);
  const prevMonthDays = prevMonth.getDate();
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: prevMonthDays - i,
      isCurrentMonth: false,
      isToday: false
    });
  }
  
  // Add days from current month
  const today = new Date();
  const isCurrentMonthAndYear = 
    today.getMonth() === month && 
    today.getFullYear() === year;
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: isCurrentMonthAndYear && today.getDate() === i
    });
  }
  
  // Add days from next month to complete the grid (6 rows × 7 days = 42 cells)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false
    });
  }
  
  return days;
});

onMounted(() => {
  // Simulate loading data
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>
