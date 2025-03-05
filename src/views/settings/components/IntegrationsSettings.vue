<template>
    <div class="px-4 py-5 sm:px-6">
      <div v-if="loading" class="py-12 flex justify-center">
        <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else class="space-y-6">
        <!-- Calendar Integrations -->
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900">Calendar Integrations</h3>
          <div class="mt-4 space-y-4">
            <div class="flex justify-between items-center p-4 border border-gray-200 rounded-md">
              <div class="flex items-center">
                <div class="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M22 12.25c0 5.66-4.59 10.25-10.25 10.25S1.5 17.91 1.5 12.25 6.09 2 11.75 2 22 6.59 22 12.25z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.75 8v4.25l2.75 2.75"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">Google Calendar</h4>
                  <p class="text-sm text-gray-500">Sync your Google Calendar events</p>
                </div>
              </div>
              <button
                type="button"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Connect
              </button>
            </div>
            
            <div class="flex justify-between items-center p-4 border border-gray-200 rounded-md">
              <div class="flex items-center">
                <div class="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 8v8a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5h8a5 5 0 015 5z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h5.586c.89 0 1.337 0 1.677.269.34.268.396.74.509 1.683l.857 7.136c.014.117.021.175.001.224a.21.21 0 01-.119.117C16.458 19.458 16.4 19.45 16.284 19.437l-7.136-.857c-.944-.113-1.415-.17-1.683-.509C7.196 17.73 7.196 17.284 7.196 16.394V10.8c0-.466 0-.699.076-.891a1 1 0 01.633-.633c.192-.076.425-.076.891-.076V10z"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">Outlook Calendar</h4>
                  <p class="text-sm text-gray-500">Sync your Outlook calendar events</p>
                </div>
              </div>
              <button
                type="button"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
        
        <!-- Email Integrations -->
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900">Email Integrations</h3>
          <div class="mt-4 space-y-4">
            <div class="flex justify-between items-center p-4 border border-gray-200 rounded-md">
              <div class="flex items-center">
                <div class="w-10 h-10 flex-shrink-0 bg-red-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">Gmail</h4>
                  <p class="text-sm text-gray-500">Process emails from your Gmail account</p>
                </div>
              </div>
              <button
                type="button"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    loading: {
      type: Boolean,
      default: false
    }
  });
  </script>