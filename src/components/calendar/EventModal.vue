<template>
  <div v-if="show" class="fixed inset-0 overflow-y-auto z-10" aria-labelledby="modal-title" role="dialog"
    aria-modal="true" data-test="event-modal">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="cancelHandler"
        data-test="modal-backdrop">
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        data-test="modal-content">
        <div>
          <div class="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title" data-test="modal-title">
              {{ modalTitle }}
            </h3>

            <!-- View Mode -->
            <div v-if="mode === 'view'" class="mt-4" data-test="view-mode-container">
              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500">Event Type</h4>
                <div class="mt-1 flex items-center">
                  <span class="inline-block w-3 h-3 rounded-full mr-2"
                    :class="getEventTypeClass(event.event_type)"></span>
                  <p class="text-sm font-medium text-gray-900" data-test="event-type-display">{{
                    getFormattedEventType(event.event_type) }}</p>
                </div>
              </div>

              <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-500">Title</h4>
                <p class="mt-1 text-sm text-gray-900" data-test="event-title-display">{{ event.title }}</p>
              </div>

              <div class="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500">Start</h4>
                  <p class="mt-1 text-sm text-gray-900" data-test="event-start-display">{{
                    formatDateTime(event.start_time) }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500">End</h4>
                  <p class="mt-1 text-sm text-gray-900" data-test="event-end-display">{{ formatDateTime(event.end_time)
                    }}</p>
                </div>
              </div>

              <div v-if="event.location" class="mb-4">
                <h4 class="text-sm font-medium text-gray-500">Location</h4>
                <p class="mt-1 text-sm text-gray-900" data-test="event-location-display">{{ event.location }}</p>
              </div>

              <div v-if="event.description" class="mb-4">
                <h4 class="text-sm font-medium text-gray-500">Description</h4>
                <p class="mt-1 text-sm text-gray-900" data-test="event-description-display">{{ event.description }}</p>
              </div>

              <!-- Health-specific fields -->
              <div v-if="event.event_type === 'health' && event.metadata" data-test="health-fields-display">
                <div v-if="event.metadata.flow_intensity" class="mb-4">
                  <h4 class="text-sm font-medium text-gray-500">Flow Intensity</h4>
                  <p class="mt-1 text-sm inline-flex items-center px-2.5 py-0.5 rounded-full font-medium"
                    :class="getFlowIntensityClass(event.metadata.flow_intensity)" data-test="flow-intensity-display">
                    {{ getFlowIntensityLabel(event.metadata.flow_intensity) }}
                  </p>
                </div>

                <div v-if="event.metadata.symptoms && hasSymptoms(event.metadata.symptoms)" class="mb-4">
                  <h4 class="text-sm font-medium text-gray-500">Symptoms</h4>
                  <div class="mt-1 flex flex-wrap gap-1" data-test="symptoms-display">
                    <span v-for="(value, symptom) in event.metadata.symptoms" :key="symptom" v-show="value"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                      :data-test="`symptom-${String(symptom).toLowerCase().replace(' ', '-')}`">
                      {{ symptom }}
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="event.visibility" class="mb-4">
                <h4 class="text-sm font-medium text-gray-500">Visibility</h4>
                <p class="mt-1 text-sm inline-flex items-center px-2.5 py-0.5 rounded-full font-medium"
                  :class="getVisibilityClass(event.visibility)" data-test="visibility-display">
                  {{ getFormattedVisibility(event.visibility) }}
                </p>
              </div>
            </div>

            <!-- Edit or Create Mode -->
            <div v-else class="mt-4" data-test="edit-mode-container">
              <form @submit.prevent="saveHandler" data-test="event-form">
                <!-- Event Type - Only shown in Create mode -->
                <div v-if="mode === 'create'" class="mb-4">
                  <label for="event-type" class="block text-sm font-medium text-gray-700">Event Type</label>
                  <select id="event-type" v-model="formData.event_type" data-test="event-type-select"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="health">Health</option>
                    <option value="family">Family</option>
                  </select>
                </div>

                <!-- Title -->
                <div class="mb-4">
                  <label for="event-title" class="block text-sm font-medium text-gray-700">Event Title</label>
                  <input type="text" id="event-title" data-test="title-input" v-model="formData.title" required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>

                <!-- Date & Time -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label for="start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
                    <input type="date" id="start-date" data-test="start-date-input" v-model="startDate" required
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                  </div>
                  <div>
                    <label for="start-time" class="block text-sm font-medium text-gray-700">Start Time</label>
                    <input type="time" id="start-time" data-test="start-time-input" v-model="startTime" required
                      :disabled="formData.is_all_day"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label for="end-date" class="block text-sm font-medium text-gray-700">End Date</label>
                    <input type="date" id="end-date" data-test="end-date-input" v-model="endDate" required
                      :min="startDate"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                  </div>
                  <div>
                    <label for="end-time" class="block text-sm font-medium text-gray-700">End Time</label>
                    <input type="time" id="end-time" data-test="end-time-input" v-model="endTime" required
                      :disabled="formData.is_all_day"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                  </div>
                </div>

                <div class="mb-4">
                  <div class="flex items-center">
                    <input id="all-day" type="checkbox" data-test="all-day-checkbox" v-model="formData.is_all_day"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
                    <label for="all-day" class="ml-2 block text-sm text-gray-900">All day event</label>
                  </div>
                </div>

                <!-- Location -->
                <div class="mb-4">
                  <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" id="location" data-test="location-input" v-model="formData.location"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="e.g. Office, Home, etc." />
                </div>

                <!-- Description -->
                <div class="mb-4">
                  <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea id="description" data-test="description-input" v-model="formData.description" rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Add details about your event..."></textarea>
                </div>

                <!-- Health-specific fields -->
                <div v-if="formData.event_type === 'health'" class="health-fields" data-test="health-fields-form">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">Flow Intensity</label>
                    <div class="mt-2 grid grid-cols-5 gap-2" data-test="flow-intensity-buttons">
                      <button v-for="i in 5" :key="i" type="button" @click="setFlowIntensity(i)"
                        class="py-2 px-3 border rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        :class="getFlowIntensityValue() === i ? 'bg-primary-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                        :data-test="`flow-intensity-${i}`">
                        {{ i }}
                      </button>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">1 = Very Light, 5 = Very Heavy</p>
                  </div>

                  <div class="mb-4">
                    <span class="block text-sm font-medium text-gray-700">Symptoms</span>
                    <div class="mt-2 grid grid-cols-2 gap-2" data-test="symptoms-checkboxes">
                      <div v-for="symptom in availableSymptoms" :key="symptom" class="flex items-center">
                        <input :id="symptom.toLowerCase().replace(' ', '-')" type="checkbox" v-model="selectedSymptoms"
                          :value="symptom" :data-test="`symptom-${symptom.toLowerCase().replace(' ', '-')}-checkbox`"
                          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                        <label :for="symptom.toLowerCase().replace(' ', '-')"
                          class="ml-2 block text-sm text-gray-900">{{ symptom }}</label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Work-specific recurrence fields -->
                <div v-if="formData.event_type === 'work'" class="mb-4">
                  <label for="recurrence" class="block text-sm font-medium text-gray-700">Recurrence</label>
                  <select id="recurrence" data-test="recurrence-select" v-model="formData.recurrence_rule"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                    <option value="">One time</option>
                    <option value="FREQ=DAILY">Daily</option>
                    <option value="FREQ=WEEKLY">Weekly</option>
                    <option value="FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR">Weekdays</option>
                    <option value="FREQ=MONTHLY">Monthly</option>
                  </select>
                </div>

                <!-- Visibility -->
                <div class="mb-4">
                  <label for="visibility" class="block text-sm font-medium text-gray-700">Visibility</label>
                  <select id="visibility" data-test="visibility-select" v-model="formData.visibility"
                    @change="userChangedVisibility = true"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                    <option value="private">Private</option>
                    <option value="family">Family</option>
                    <option value="public">Public</option>
                  </select>
                  <p class="mt-1 text-xs"
                    :class="formData.event_type === 'family' ? 'text-purple-600' : 'text-gray-500'">
                    <span v-if="formData.event_type === 'family'">
                      <strong>Family events</strong> are typically shared with your family
                    </span>
                    <span v-else-if="formData.event_type === 'health'">
                      <strong>Health entries</strong> are private by default for your privacy
                    </span>
                    <span v-else-if="formData.event_type === 'work'">
                      You can share your <strong>work schedule</strong> with family members
                    </span>
                    <span v-else>
                      Choose who can see this event on the calendar
                    </span>
                  </p>
                </div>

                <!-- Submit buttons -->
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button type="submit" data-test="save-button"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                    :disabled="processing">
                    <span v-if="processing" data-test="loading-spinner"
                      class="inline-block animate-spin h-4 w-4 mr-2 border-t-2 border-white rounded-full"></span>
                    {{ saveButtonText }}
                  </button>
                  <button type="button" data-test="cancel-button"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    @click="cancelHandler" :disabled="processing">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Action Buttons for View Mode -->
        <div v-if="mode === 'view'" class="mt-5 sm:mt-6 flex justify-between" data-test="view-mode-actions">
          <div class="flex space-x-2">
            <button type="button" data-test="edit-button"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              @click="editHandler">
              <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
            <button type="button" data-test="delete-button"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              @click="$emit('delete', event)">
              <svg class="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
          <button type="button" data-test="close-button"
            class="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            @click="cancelHandler">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { formatDateTime } from '@/utils/dateUtils';
import type { CalendarEvent, EventType, EventVisibility } from '@/types/calendar';

interface Props {
  show: boolean;
  mode: 'create' | 'edit' | 'view';
  event?: CalendarEvent;
  processing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  mode: 'view',
  event: () => ({
    title: '',
    event_type: 'personal',
    start_time: '',
    end_time: '',
    is_all_day: false,
    visibility: 'private'
  }),
  processing: false
});

const emit = defineEmits(['close', 'save', 'edit', 'delete']);

// Initialize form data
const formData = ref<CalendarEvent>({
  id: '',
  title: '',
  event_type: 'personal',
  start_time: '',
  end_time: '',
  location: '',
  description: '',
  is_all_day: false,
  recurrence_rule: '',
  color: '', // Default blue
  visibility: 'private',
  metadata: {}
});

// Health-specific fields
const selectedSymptoms = ref<string[]>([]);
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

// Available colors for color picker
const availableColors = [
  { value: '#3B82F6', class: 'bg-blue-500' },   // Blue
  { value: '#10B981', class: 'bg-emerald-500' }, // Green
  { value: '#8B5CF6', class: 'bg-purple-500' }, // Purple
  { value: '#EF4444', class: 'bg-red-500' },    // Red
  { value: '#F59E0B', class: 'bg-amber-500' },  // Amber
];

// Date and time form controls
const startDate = ref('');
const startTime = ref('09:00');
const endDate = ref('');
const endTime = ref('10:00');

// Computed values
const modalTitle = computed(() => {
  switch (props.mode) {
    case 'create': return 'Create New Event';
    case 'edit': return 'Edit Event';
    case 'view': return 'Event Details';
    default: return 'Event';
  }
});

// Add this with your other computed properties
const eventTypeColor = computed(() => {
  switch (formData.value.event_type) {
    case 'personal': return '#3B82F6'; // Blue
    case 'family': return '#8B5CF6';   // Purple
    case 'health': return '#EC4899';   // Pink
    case 'work': return '#10B981';     // Green
    default: return '#6B7280';         // Gray
  }
});

const saveButtonText = computed(() => {
  return props.mode === 'create' ? 'Create' : 'Save';
});

// Track if user has explicitly changed visibility
const userChangedVisibility = ref(false);

// Helper methods for health events
function hasSymptoms(symptoms: Record<string, boolean>): boolean {
  return Object.values(symptoms).some(value => value);
}

function getFlowIntensityValue(): number {
  return formData.value.metadata?.flow_intensity || 0;
}

function setFlowIntensity(intensity: number): void {
  if (!formData.value.metadata) {
    formData.value.metadata = {};
  }
  formData.value.metadata.flow_intensity = intensity;
}

function getFlowIntensityClass(intensity: number): string {
  const classes = {
    1: 'bg-pink-100 text-pink-800',
    2: 'bg-pink-200 text-pink-800',
    3: 'bg-pink-300 text-pink-800',
    4: 'bg-pink-400 text-white',
    5: 'bg-pink-500 text-white'
  };

  return classes[intensity as keyof typeof classes] || 'bg-pink-200 text-pink-800';
}

function getFlowIntensityLabel(intensity: number): string {
  const labels = {
    1: 'Very Light',
    2: 'Light',
    3: 'Medium',
    4: 'Heavy',
    5: 'Very Heavy'
  };

  return labels[intensity as keyof typeof labels] || 'Unknown';
}

// Watchers
watch(() => props.event, (newEvent) => {
  if (newEvent && (props.mode === 'edit' || props.mode === 'view')) {
    // Update form data when event changes
    formData.value = { ...newEvent };

    // If there's no color or it's different from the expected type color
    if (!formData.value.color) {
      formData.value.color = eventTypeColor.value;
    }

    // Handle health-specific fields
    if (newEvent.event_type === 'health' && newEvent.metadata) {
      selectedSymptoms.value = [];
      if (newEvent.metadata.symptoms) {
        Object.entries(newEvent.metadata.symptoms).forEach(([symptom, present]) => {
          if (present) {
            selectedSymptoms.value.push(symptom);
          }
        });
      }
    }

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

    // Reset the user changed visibility flag when loading an existing event
    userChangedVisibility.value = false;
  }
}, { immediate: true, deep: true });

watch(() => props.mode, (newMode) => {
  if (newMode === 'create') {
    // Reset form for create mode
    resetForm();
    // Reset the user changed visibility flag
    userChangedVisibility.value = false;
  }
});

// Watch for event type changes to update visibility default
watch(() => formData.value.event_type, (newType) => {
  // Only update visibility if we're in create mode and the user hasn't explicitly changed it
  if (props.mode === 'create' && !userChangedVisibility.value) {
    // Set appropriate defaults based on event type
    switch (newType) {
      case 'family':
        formData.value.visibility = 'family';
        break;
      case 'health':
        formData.value.visibility = 'private';
        break;
      case 'work':
        // You can decide if work events should default to family or private
        formData.value.visibility = 'private';
        break;
      case 'personal':
      default:
        formData.value.visibility = 'private';
        break;
    }
  }
});

watch(() => formData.value.event_type, (newEventType) => {
  // Automatically update color when event type changes
  formData.value.color = eventTypeColor.value;
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
    visibility: 'private',
    metadata: {}
  };

  // Set color based on event type
  formData.value.color = eventTypeColor.value;

  selectedSymptoms.value = [];

  // Set default date/time values
  const now = new Date();
  startDate.value = now.toISOString().split('T')[0];
  startTime.value = '09:00';

  // End date defaults to same day
  endDate.value = now.toISOString().split('T')[0];
  endTime.value = '10:00';
}

function saveHandler() {
  // Update metadata for health events
  if (formData.value.event_type === 'health') {
    if (!formData.value.metadata) {
      formData.value.metadata = {};
    }

    // Update symptoms based on selected symptoms
    const symptomsObject: Record<string, boolean> = {};
    availableSymptoms.forEach(symptom => {
      symptomsObject[symptom] = selectedSymptoms.value.includes(symptom);
    });

    formData.value.metadata.symptoms = symptomsObject;
  }

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
function getEventTypeClass(eventType: EventType): string {
  switch (eventType) {
    case 'personal': return 'bg-blue-500';
    case 'family': return 'bg-purple-500';
    case 'health': return 'bg-pink-500';
    case 'work': return 'bg-emerald-500';
    default: return 'bg-gray-500';
  }
}

function getFormattedEventType(eventType: EventType): string {
  switch (eventType) {
    case 'personal': return 'Personal Event';
    case 'family': return 'Family Event';
    case 'health': return 'Health Entry';
    case 'work': return 'Work Schedule';
    default: return 'Event';
  }
}

function getFormattedVisibility(visibility: EventVisibility): string {
  if (visibility === 'family') return 'Shared with Family';
  if (visibility === 'public') return 'Public';
  return 'Private';
}

function getVisibilityClass(visibility: EventVisibility): string {
  if (visibility === 'family') return 'bg-purple-100 text-purple-800';
  if (visibility === 'public') return 'bg-indigo-100 text-indigo-800';
  return 'bg-gray-100 text-gray-800';
}
</script>