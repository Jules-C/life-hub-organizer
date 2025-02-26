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
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Event
        </button>
      </div>
      
      <!-- Calendar Header -->
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
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AppLayout from '@/components/layout/AppLayout.vue';

const loading = ref(true);
const currentDate = ref(new Date());

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
