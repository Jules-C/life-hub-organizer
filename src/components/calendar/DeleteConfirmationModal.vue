<template>
  <div v-if="show" class="fixed inset-0 overflow-y-auto z-20" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="!processing && $emit('cancel')"></div>

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
              {{ title }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                {{ message }}
              </p>
              
              <!-- Recurring event options -->
              <div v-if="showRecurringOptions && event?.recurrence_rule" class="mt-4">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input 
                      id="delete-series" 
                      type="checkbox" 
                      v-model="deleteEntireSeries"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="delete-series" class="font-medium text-gray-700">Delete entire series</label>
                    <p class="text-gray-500">If checked, all occurrences of this recurring event will be deleted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            @click="confirmHandler"
            :disabled="processing"
          >
            <span v-if="processing" class="inline-block animate-spin h-4 w-4 mr-2 border-t-2 border-white rounded-full"></span>
            {{ confirmButtonText }}
          </button>
          <button 
            type="button" 
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
            @click="$emit('cancel')"
            :disabled="processing"
          >
            {{ cancelButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  show: boolean;
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  processing?: boolean;
  event?: any;
  showRecurringOptions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: 'Delete Event',
  message: 'Are you sure you want to delete this event? This action cannot be undone.',
  confirmButtonText: 'Delete',
  cancelButtonText: 'Cancel',
  processing: false,
  event: null,
  showRecurringOptions: true
});

const emit = defineEmits(['confirm', 'cancel']);

// State
const deleteEntireSeries = ref(false);

// Methods
function confirmHandler() {
  emit('confirm', {
    deleteEntireSeries: deleteEntireSeries.value,
    event: props.event
  });
}
</script>
