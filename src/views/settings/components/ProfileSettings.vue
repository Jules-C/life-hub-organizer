<template>
    <div class="px-4 py-5 sm:px-6">
      <div v-if="loading" class="py-12 flex justify-center">
        <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <form v-else @submit.prevent="handleSave" class="space-y-6">
        <!-- Profile Picture -->
        <div class="flex items-center">
          <div class="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
            <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <button type="button" class="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Change
          </button>
        </div>
        
        <!-- Name -->
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="first-name" class="block text-sm font-medium text-gray-700">
              First name
            </label>
            <div class="mt-1">
              <input
                type="text"
                name="first-name"
                id="first-name"
                v-model="formData.firstName"
                autocomplete="given-name"
                class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
  
          <div class="sm:col-span-3">
            <label for="last-name" class="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <div class="mt-1">
              <input
                type="text"
                name="last-name"
                id="last-name"
                v-model="formData.lastName"
                autocomplete="family-name"
                class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div class="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              v-model="formData.email"
              autocomplete="email"
              disabled
              class="bg-gray-100 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <p class="mt-1 text-sm text-gray-500">To change your email, please contact support.</p>
        </div>
        
        <!-- Save Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="saving"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span v-if="saving">Saving...</span>
            <span v-else>Save</span>
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  
  interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
  }
  
  const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    },
    saving: {
      type: Boolean,
      default: false
    },
    profile: {
      type: Object as () => ProfileData,
      required: true
    }
  });
  
  const emit = defineEmits(['save-profile']);
  
  // Create a local form data object to track changes
  const formData = ref<ProfileData>({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  // Watch for changes in the profile prop and update local form data
  watchEffect(() => {
    // Make sure we're copying all the required properties
    formData.value = {
      firstName: props.profile.firstName || '',
      lastName: props.profile.lastName || '',
      email: props.profile.email || ''
    };
  });
  
  // Handle form submission
  function handleSave() {
    emit('save-profile', {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email
    });
  }
  </script>