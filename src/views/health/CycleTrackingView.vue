<template>
    <AppLayout>
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Cycle Tracking</h2>
            <p class="mt-1 text-sm text-gray-500">
              Track your menstrual cycle and symptoms
            </p>
          </div>
          <button
            @click="showNewEntryModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Entry
          </button>
        </div>
  
        <!-- Month View Calendar -->
        <div class="p-4 border-t border-gray-200">
          <!-- Calendar Grid Component -->
          <CalendarGrid
            :initialDate="currentDate"
            @month-changed="handleMonthChanged"
            @date-selected="handleDateSelected"
          >
            <!-- Date indicators -->
            <template #date-indicators="{ day }">
              <div v-if="isCycleActiveDay(day)" class="flex space-x-1">
                <div 
                  class="w-2 h-2 rounded-full bg-pink-500"
                ></div>
              </div>
            </template>
            
            <!-- Day content -->
            <template #day-content="{ day }">
              <!-- Period flow indicator (if applicable) -->
              <div 
                v-if="isCycleActiveDay(day)"
                class="mt-1 text-xs text-center py-1 rounded"
                :class="getFlowClassForDay(day)"
                @click.stop="showCycleDetails(day)"
              >
                {{ getFlowLabelForDay(day) }}
              </div>
            </template>
          </CalendarGrid>
        </div>
        
        <!-- Stats and Predictions -->
        <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Insights</h3>
          
          <div v-if="loading" class="py-4 flex justify-center">
            <svg class="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else-if="cycleEntries.length === 0" class="text-center py-4">
            <p class="text-gray-500">No cycle data available yet. Add your first entry to see insights.</p>
          </div>
          
          <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-pink-100 rounded-md p-3">
                    <svg class="h-6 w-6 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="ml-5">
                    <h4 class="text-lg font-medium text-gray-900">Next Predicted Period</h4>
                    <div class="mt-1 text-3xl font-semibold text-gray-900">
                      {{ predictedNextPeriod ? formatDate(predictedNextPeriod) : 'Not enough data' }}
                    </div>
                    <p v-if="averageCycleLength" class="mt-1 text-sm text-gray-500">
                      Based on your average cycle of {{ averageCycleLength }} days
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div class="ml-5">
                    <h4 class="text-lg font-medium text-gray-900">Recent Symptoms</h4>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span v-for="(count, symptom) in commonSymptoms" :key="symptom" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {{ symptom }}: {{ count }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recent Entries -->
        <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Entries</h3>
          
          <div v-if="loading" class="py-4 flex justify-center">
            <svg class="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else-if="cycleEntries.length === 0" class="text-center py-4">
            <p class="text-gray-500">No entries yet.</p>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="entry in recentEntries" :key="entry.id" 
              class="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">
                    {{ formatDate(entry.start_date) }} - {{ entry.end_date ? formatDate(entry.end_date) : 'Ongoing' }}
                  </h4>
                  <p v-if="entry.notes" class="mt-1 text-sm text-gray-500">{{ entry.notes }}</p>
                  
                  <div v-if="entry.symptoms && Object.keys(entry.symptoms).length > 0" class="mt-2 flex flex-wrap gap-1">
                    <span v-for="(value, symptom) in entry.symptoms" :key="symptom" 
                      v-show="value"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      {{ symptom }}
                    </span>
                  </div>
                </div>
                
                <div class="flex space-x-2">
                  <button @click="editEntry(entry)" 
                    class="text-primary-600 hover:text-primary-800">
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDeleteEntry(entry)" 
                    class="text-red-600 hover:text-red-800">
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- New Entry Modal -->
      <div v-if="showNewEntryModal" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showNewEntryModal = false"></div>
  
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
  
          <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ editingEntry ? 'Edit Cycle Entry' : 'New Cycle Entry' }}
                </h3>
                <div class="mt-4">
                  <form @submit.prevent="saveEntry">
                    <!-- Start Date -->
                    <div class="mb-4">
                      <label for="start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
                      <input 
                        type="date" 
                        id="start-date" 
                        v-model="newEntry.start_date"
                        required
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    
                    <!-- End Date -->
                    <div class="mb-4">
                      <label for="end-date" class="block text-sm font-medium text-gray-700">End Date</label>
                      <div class="flex items-center">
                        <input 
                          type="date" 
                          id="end-date" 
                          v-model="newEntry.end_date"
                          :min="newEntry.start_date"
                          :disabled="ongoing"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div class="mt-1">
                        <div class="flex items-center">
                          <input id="ongoing" type="checkbox" v-model="ongoing" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                          <label for="ongoing" class="ml-2 block text-sm text-gray-900">Currently ongoing</label>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Flow Intensity -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700">Flow Intensity</label>
                      <div class="mt-2 grid grid-cols-5 gap-2">
                        <button 
                          v-for="i in 5" 
                          :key="i"
                          type="button"
                          @click="newEntry.flow_intensity = i"
                          class="py-2 px-3 border rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          :class="newEntry.flow_intensity === i ? 'bg-primary-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                        >
                          {{ i }}
                        </button>
                      </div>
                      <p class="mt-1 text-sm text-gray-500">1 = Very Light, 5 = Very Heavy</p>
                    </div>
                    
                    <!-- Symptoms -->
                    <div class="mb-4">
                      <span class="block text-sm font-medium text-gray-700">Symptoms</span>
                      <div class="mt-2 grid grid-cols-2 gap-2">
                        <div v-for="symptom in availableSymptoms" :key="symptom" class="flex items-center">
                          <input 
                            :id="symptom"
                            type="checkbox"
                            :value="symptom"
                            v-model="selectedSymptoms"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label :for="symptom" class="ml-2 block text-sm text-gray-900">{{ symptom }}</label>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Notes -->
                    <div class="mb-4">
                      <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea 
                        id="notes" 
                        v-model="newEntry.notes" 
                        rows="3" 
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      ></textarea>
                    </div>
                    
                    <!-- Privacy -->
                    <div class="mb-4" v-if="!isPersonalOnly">
                      <div class="flex items-center">
                        <input id="is_private" type="checkbox" v-model="newEntry.is_private" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                        <label for="is_private" class="ml-2 block text-sm text-gray-900">Keep this entry private</label>
                      </div>
                      <p class="mt-1 text-xs text-gray-500">When enabled, this entry won't appear on shared family calendars</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                      >
                        {{ editingEntry ? 'Update' : 'Save' }}
                      </button>
                      <button
                        type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        @click="showNewEntryModal = false"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteModal = false"></div>
  
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
  
          <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Delete Entry
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete this entry? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                @click="deleteEntry"
              >
                Delete
              </button>
              <button 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                @click="showDeleteModal = false"
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
  import { ref, computed, onMounted, watch } from 'vue';
  import AppLayout from '@/components/layouts/AppLayout.vue';
import CalendarGrid from '@/components/calendar/CalendarGrid.vue';
  import { cycleTrackingService, type CycleTrackingEntry } from '@/services/health/cycleTracking';
  import { useAuthStore } from '@/stores/auth';
import { getFamilyContext } from '@/utils/familyUtils';
  
  const authStore = useAuthStore();
  const loading = ref(true);
  const cycleEntries = ref<CycleTrackingEntry[]>([]);
  const predictedNextPeriod = ref<string | null>(null);
  const averageCycleLength = ref<number | null>(null);
  const currentDate = ref(new Date());
  const showNewEntryModal = ref(false);
  const showDeleteModal = ref(false);
  const editingEntry = ref(false);
  const ongoing = ref(false);
  
  // Detect if this is a personal-only user (no family sharing)
  const isPersonalOnly = ref(true); // Default to true until we check
  
  async function checkFamilyContext() {
    const { isPersonalOnly: solo } = await getFamilyContext();
    isPersonalOnly.value = solo;
  }
  const entryToDelete = ref<CycleTrackingEntry | null>(null);
  
  const newEntry = ref<CycleTrackingEntry>({
    family_id: '', // This should be set based on current family selection
    start_date: new Date().toISOString().slice(0, 10),
    flow_intensity: 3,
    is_private: true
  });
  
  const availableSymptoms = [
    'Cramps',
    'Headache',
    'Bloating',
    'Fatigue',
    'Mood Swings',
    'Nausea',
    'Breast Tenderness',
    'Back Pain'
  ];
  
  const selectedSymptoms = ref<string[]>([]);
  
  // Calendar-related functions for the CalendarGrid component
  function handleMonthChanged(data: any) {
    if (data.date) {
      currentDate.value = new Date(data.date);
    } else {
      currentDate.value = new Date(data.year, data.month);
    }
    
    // This will trigger reloading of cycle data if needed
    loadCycleData();
  }
  
  function handleDateSelected(day: any) {
    // Show entry form for the selected day
    if (day && day.dateString) {
      newEntry.value.start_date = day.dateString;
      showNewEntryModal.value = true;
    }
  }
  
  function isCycleActiveDay(day: any) {
    if (!day || !day.dateString || !day.isCurrentMonth) return false;
    
    const dateString = day.dateString;
    
    return cycleEntries.value.some(entry => {
      const startDate = entry.start_date;
      const endDate = entry.end_date;
      
      if (endDate) {
        return dateString >= startDate && dateString <= endDate;
      } else {
        return dateString >= startDate;
      }
    });
  }
  
  function getCycleEntryForDay(day: any) {
    if (!day || !day.dateString) return null;
    
    const dateString = day.dateString;
    
    return cycleEntries.value.find(entry => {
      const startDate = entry.start_date;
      const endDate = entry.end_date;
      
      if (endDate) {
        return dateString >= startDate && dateString <= endDate;
      } else {
        return dateString >= startDate;
      }
    });
  }
  
  function getFlowClassForDay(day: any) {
    const entry = getCycleEntryForDay(day);
    if (!entry) return '';
    
    const intensity = entry.flow_intensity || 1;
    return getFlowClass(intensity);
  }
  
  function getFlowLabelForDay(day: any) {
    const entry = getCycleEntryForDay(day);
    if (!entry) return '';
    
    const intensity = entry.flow_intensity || 1;
    return getFlowLabel(intensity);
  }
  
  function showCycleDetails(day: any) {
    const entry = getCycleEntryForDay(day);
    if (entry) {
      editEntry(entry);
    }
  }
  
  // Get recent entries for the list
  const recentEntries = computed(() => {
    return [...cycleEntries.value]
      .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
      .slice(0, 5); // Show only the 5 most recent entries
  });
  
  // Calculate common symptoms from recent entries
  const commonSymptoms = computed(() => {
    const symptomCount: Record<string, number> = {};
    
    cycleEntries.value.forEach(entry => {
      if (entry.symptoms) {
        Object.entries(entry.symptoms).forEach(([symptom, present]) => {
          if (present) {
            symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
          }
        });
      }
    });
    
    return symptomCount;
  });
  
  // Calendar methods are now handled by CalendarGrid component
  
  // Visual helpers
  function getDotClass(cycleType: string | null) {
    if (!cycleType) return '';
    
    if (cycleType === 'active') {
      return 'bg-pink-500';
    }
    
    return 'bg-gray-300';
  }
  
  function getFlowClass(intensity: number | null) {
    if (!intensity) return '';
    
    const intensityMap = {
      1: 'bg-pink-100 text-pink-800',
      2: 'bg-pink-200 text-pink-800',
      3: 'bg-pink-300 text-pink-800',
      4: 'bg-pink-400 text-white',
      5: 'bg-pink-500 text-white'
    };
    
    return intensityMap[intensity as keyof typeof intensityMap] || 'bg-pink-200 text-pink-800';
  }
  
  function getFlowLabel(intensity: number | null) {
    if (!intensity) return '';
    
    const intensityMap = {
      1: 'Very Light',
      2: 'Light',
      3: 'Medium',
      4: 'Heavy',
      5: 'Very Heavy'
    };
    
    return intensityMap[intensity as keyof typeof intensityMap] || '';
  }
  
  function formatDate(dateString: string) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  // CRUD operations
  async function loadCycleData() {
    loading.value = true;
    try {
      const { data, error } = await cycleTrackingService.getAllEntries();
      
      if (error) throw error;
      
      if (data) {
        cycleEntries.value = data;
      }
      
      // Load prediction data
      const prediction = await cycleTrackingService.predictNextCycle();
      if (!prediction.error) {
        predictedNextPeriod.value = prediction.predictedStartDate;
        averageCycleLength.value = prediction.averageCycleLength;
      }
    } catch (err) {
      console.error('Failed to load cycle data:', err);
    } finally {
      loading.value = false;
    }
  }
  
  function editEntry(entry: CycleTrackingEntry) {
    editingEntry.value = true;
    
    // Clone the entry to avoid modifying the original
    newEntry.value = { ...entry };
    
    // Set the ongoing checkbox based on end_date
    ongoing.value = !entry.end_date;
    
    // Populate selected symptoms
    selectedSymptoms.value = [];
    if (entry.symptoms) {
      Object.entries(entry.symptoms).forEach(([symptom, present]) => {
        if (present) {
          selectedSymptoms.value.push(symptom);
        }
      });
    }
    
    showNewEntryModal.value = true;
  }
  
  function confirmDeleteEntry(entry: CycleTrackingEntry) {
    entryToDelete.value = entry;
    showDeleteModal.value = true;
  }
  
  async function deleteEntry() {
    if (!entryToDelete.value?.id) return;
    
    try {
      const { error } = await cycleTrackingService.deleteEntry(entryToDelete.value.id);
      
      if (error) throw error;
      
      // Remove from local list
      cycleEntries.value = cycleEntries.value.filter(entry => entry.id !== entryToDelete.value?.id);
      showDeleteModal.value = false;
      entryToDelete.value = null;
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  }
  
  async function saveEntry() {
    // Convert selected symptoms to object format
    const symptomsObject: Record<string, boolean> = {};
    availableSymptoms.forEach(symptom => {
      symptomsObject[symptom] = selectedSymptoms.value.includes(symptom);
    });
    
    newEntry.value.symptoms = symptomsObject;
    
    // Handle end date based on ongoing status
    if (ongoing.value) {
      newEntry.value.end_date = undefined;
    }
    
    // Get family context
    const { familyId, isPersonalOnly } = await getFamilyContext();
    
    // Set family ID only if user is part of a family
    if (!isPersonalOnly && familyId) {
      newEntry.value.family_id = familyId;
    }
    
    // For personal-only use, ensure entry is private
    if (isPersonalOnly) {
      newEntry.value.is_private = true;
    }
    
    try {
      let result;
      
      if (editingEntry.value && newEntry.value.id) {
        // Update existing entry
        result = await cycleTrackingService.updateEntry(newEntry.value.id, newEntry.value);
      } else {
        // Create new entry
        result = await cycleTrackingService.addEntry(newEntry.value);
      }
      
      if (result.error) throw result.error;
      
      // Refresh the data
      await loadCycleData();
      
      // Reset and close the modal
      resetForm();
      showNewEntryModal.value = false;
    } catch (err) {
      console.error('Failed to save entry:', err);
    }
  }
  
  function resetForm() {
    editingEntry.value = false;
    newEntry.value = {
      family_id: '', // This should be set based on current family selection
      start_date: new Date().toISOString().slice(0, 10),
      flow_intensity: 3,
      is_private: true
    };
    selectedSymptoms.value = [];
    ongoing.value = false;
  }
  
  // Watch for changes to ongoing to clear end_date
  watch(ongoing, (isOngoing) => {
    if (isOngoing) {
      newEntry.value.end_date = undefined;
    }
  });
  
  // Initialize data
  onMounted(async () => {
    await checkFamilyContext();
    await loadCycleData();
  });
  </script>