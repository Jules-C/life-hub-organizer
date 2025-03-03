<template>
  <div v-if="show" class="fixed inset-0 overflow-y-auto z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="cancelHandler"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <div class="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {{ modalTitle }}
            </h3>
            
            <!-- View Mode -->
            <div v-if="mode === 'view'" class="mt-4">
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500">Event Type</h4>
                <div class="mt-1 flex items-center">
                  <span 
                    class="inline-block w-3 h-3 rounded-full mr-2"
                    :class="getEventTypeClass(event)"
                  ></span>
                  <p class="text-sm font-medium text-gray-900">{{ getFormattedEventType(event) }}</p>
                </div>
              </div>
              
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500">Title</h4>
                <p class="mt-1 text-sm text-gray-900">{{ event.title }}</p>
              </div>
              
              <div class="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Start</h4>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(event.start_time) }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500">End</h4>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(event.end_time) }}</p>
                </div>
              </div>
              
              <div v-if="event.location" class="mb-4">
                <h4 class="text-sm font-medium text-gray-500">Location</h4>
                <p class="mt-1 text-sm text-gray-900">{{ event.location }}</p>
              </div>
              
              <div v-if="event.description" class="mb-4">
                <h4 class="text-sm font-medium text-gray-500">Description</h4>
                <p class="mt-1 text-sm text-gray-900">{{ event.description }}</p>
              </div>
              
              <div v-if="event.visibility" class="mb-4">
                <h4 class="text-sm font-medium text-gray-500">Visibility</h4>
                <p class="mt-1 text-sm inline-flex items-center px-2.5 py-0.5 rounded-full font-medium"
                  :class="getVisibilityClass(event.visibility)">
                  {{ getFormattedVisibility(event.visibility) }}
                </p>
              </div>
            </div>
            
            <!-- Edit or Create Mode -->
            <div v-else class="mt-4">
              <form @submit.prevent="saveHandler">
                <!-- Event Type - Only shown in Create mode -->
                <div v-if="mode === 'create'" class="mb-4">
                  <label for="event-type" class="block text-sm font-medium text-gray-700">Event Type</label>
                  <select 
                    id="event-type" 
                    v-model="formData.event_type"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="health">Health</option>
                    <option value="family">Family</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <!-- Title -->
                <div class="mb-4">
                  <label for="event-title" class="block text-sm font-medium text-gray-700">Event Title</label>
                  <input 
                    type="text" 
                    id="event-title" 
                    v-model="formData.title"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                
                <!-- Date & Time -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label for="start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
                    <input 
                      type="date" 
                      id="start-date" 
                      v-model="startDate"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="start-time" class="block text-sm font-medium text-gray-700">Start Time</label>
                    <input 
                      type="time" 
                      id="start-time" 
                      v-model="startTime"
                      required
                      :disabled="formData.is_all_day"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label for="end-date" class="block text-sm font-medium text-gray-700">End Date</label>
                    <input 
                      type="date" 
                      id="end-date" 
                      v-model="endDate"
                      required
                      :min="startDate"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="end-time" class="block text-sm font-medium text-gray-700">End Time</label>
                    <input 
                      type="time" 
                      id="end-time" 
                      v-model="endTime"
                      required
                      :disabled="formData.is_all_day"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div class="mb-4">
                  <div class="flex items-center">
                    <input id="all-day" type="checkbox" v-model="formData.is_all_day" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                    <label for="all-day" class="ml-2 block text-sm text-gray-900">All day event</label>
                  </div>
                </div>
                
                <!-- Location -->
                <div class="mb-4">
                  <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
                  <input 
                    type="text" 
                    id="location" 
                    v-model="formData.location"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="e.g. Office, Home, etc."
                  />
                </div>
                
                <!-- Description -->
                <div class="mb-4">
                  <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    id="description" 
                    v-model="formData.description" 
                    rows="3" 
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Add details about your event..."
                  ></textarea>
                </div>
                
                <!-- Recurrence for work events -->
                <div v-if="formData.event_type === 'work'" class="mb-4">
                  <label for="recurrence" class="block text-sm font-medium text-gray-700">Recurrence</label>
                  <select 
                    id="recurrence" 
                    v-model="formData.recurrence_rule"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="">One time</option>
                    <option value="FREQ=DAILY">Daily</option>
                    <option value="FREQ=WEEKLY">Weekly</option>
                    <option value="FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR">Weekdays</option>
                    <option value="FREQ=MONTHLY">Monthly</option>
                  </select>
                </div>
                
                <!-- Color picker -->
                <div class="mb-4">
                  <label for="color" class="block text-sm font-medium text-gray-700">Color</label>
                  <div class="mt-1 grid grid-cols-5 gap-2">
                    <button 
                      v-for="color in availableColors" 
                      :key="color.value"
                      type="button"
                      @click="formData.color = color.value"
                      class="w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      :class="[color.class, formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-500' : '']"
                    ></button>
                  </div>
                </div>
                
                <!-- Visibility -->
                <div class="mb-4">
                  <label for="visibility" class="block text-sm font-medium text-gray-700">Visibility</label>
                  <select 
                    id="visibility" 
                    v-model="formData.visibility"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="private">Private</option>
                    <option value="family">Family</option>
                    <option value="public">Public</option>
                  </select>
                  <p class="mt-1 text-xs text-gray-500">
                    Choose who can see this event on the family calendar
                  </p>
                </div>
                
                <!-- Submit buttons -->
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                    :disabled="processing"
                  >
                    <span v-if="processing" class="inline-block animate-spin h-4 w-4 mr-2 border-t-2 border-white rounded-full"></span>
                    {{ saveButtonText }}
                  </button>
                  <button
                    type="button"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    @click="cancelHandler"
                    :disabled="processing"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons for View Mode -->
        <div v-if="mode === 'view'" class="mt-5 sm:mt-6 flex justify-between">
          <div class="flex space-x-2">
            <button 
              type="button" 
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              @click="editHandler"
            >
              <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
            <button 
              type="button" 
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              @click="$emit('delete', event)"
            >
              <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
          <button 
            type="button" 
            class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            @click="cancelHandler"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface Props {
  show: boolean;
  mode: 'create' | 'edit' | 'view';
  event?: any;
  processing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  mode: 'view',
  event: () => ({}),
  processing: false
});

const emit = defineEmits(['close', 'save', 'edit', 'delete']);

// Initialize form data
const formData = ref({
  id: '',
  title: '',
  event_type: 'personal',
  start_time: '',
  end_time: '',
  location: '',
  description: '',
  is_all_day: false,
  recurrence_rule: '',
  color: '#3B82F6', // Default blue
  visibility: 'private',
  // Additional fields as needed
});

// Date and time form controls
const startDate = ref('');
const startTime = ref('09:00');
const endDate = ref('');
const endTime = ref('10:00');

// Available colors for color picker
const availableColors = [
  { value: '#3B82F6', class: 'bg-blue-500' },   // Blue
  { value: '#10B981', class: 'bg-emerald-500' }, // Green
  { value: '#8B5CF6', class: 'bg-purple-500' }, // Purple
  { value: '#EF4444', class: 'bg-red-500' },    // Red
  { value: '#F59E0B', class: 'bg-amber-500' },  // Amber
];

// Computed values
const modalTitle = computed(() => {
  switch (props.mode) {
    case 'create': return 'Create New Event';
    case 'edit': return 'Edit Event';
    case 'view': return 'Event Details';
    default: return 'Event';
  }
});

const saveButtonText = computed(() => {
  return props.mode === 'create' ? 'Create' : 'Save';
});

// Watchers
watch(() => props.event, (newEvent) => {
  if (newEvent && (props.mode === 'edit' || props.mode === 'view')) {
    // Update form data when event changes
    formData.value = { ...newEvent };
    
    // Parse dates and times for form controls
    if (newEvent.start_time) {
      const startDateTime = new Date(newEvent.start_time);
      startDate.value = startDateTime.toISOString().split('T')[0];
      startTime.value = startDateTime.toTimeString().slice(0, 5);
    }
    
    if (newEvent.end_time) {
      const endDateTime = new Date(newEvent.end_time);
      endDate.value = endDateTime.toISOString().split('T')[0];
      endTime.value = endDateTime.toTimeString().slice(0, 5);
    }
  }
}, { immediate: true, deep: true });

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
    // Reset form for create mode
    resetForm();
  }
});

// Lifecycle hooks
onMounted(() => {
  if (props.mode === 'create') {
    resetForm();
  }
});

// Methods
function resetForm() {
  formData.value = {
    id: '',
    title: '',
    event_type: 'personal',
    start_time: '',
    end_time: '',
    location: '',
    description: '',
    is_all_day: false,
    recurrence_rule: '',
    color: '#3B82F6',
    visibility: 'private',
  };
  
  // Set default date/time values
  const now = new Date();
  startDate.value = now.toISOString().split('T')[0];
  startTime.value = '09:00';
  
  // End date defaults to same day
  endDate.value = now.toISOString().split('T')[0];
  endTime.value = '10:00';
}

function saveHandler() {
  // Combine date and time values into ISO strings
  const startDateTime = new Date(`${startDate.value}T${startTime.value}`);
  const endDateTime = new Date(`${endDate.value}T${endTime.value}`);
  
  // Update form data with combined date/time values
  formData.value.start_time = startDateTime.toISOString();
  formData.value.end_time = endDateTime.toISOString();
  
  // Emit the save event with the form data
  emit('save', { ...formData.value });
}

function cancelHandler() {
  emit('close');
}

function editHandler() {
  emit('edit', { ...props.event });
}

// Helper methods
function formatDateTime(isoString: string) {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  return date.toLocaleString([], { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getFormattedEventType(event: any) {
  if (!event) return '';
  
  if (event._source === 'family') return 'Family Event';
  if (event._source === 'health') return 'Health Entry';
  if (event._source === 'work' || event.event_type === 'work') return 'Work Schedule';
  if (event._source === 'personal') return 'Personal Event';
  return event.event_type ? event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1) : 'Event';
}

function getEventTypeClass(event: any) {
  if (!event) return '';
  
  if (event._source === 'family') return 'bg-purple-500';
  if (event._source === 'health') return 'bg-pink-500';
  if (event._source === 'work' || event.event_type === 'work') return 'bg-emerald-500';
  if (event._source === 'personal') return 'bg-blue-500';
  return 'bg-gray-500';
}

function getFormattedVisibility(visibility: string) {
  if (visibility === 'family') return 'Shared with Family';
  if (visibility === 'public') return 'Public';
  return 'Private';
}

function getVisibilityClass(visibility: string) {
  if (visibility === 'family') return 'bg-purple-100 text-purple-800';
  if (visibility === 'public') return 'bg-indigo-100 text-indigo-800';
  return 'bg-gray-100 text-gray-800';
}
</script>
