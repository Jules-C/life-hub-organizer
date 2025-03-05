<template>
    <div class="px-4 py-5 sm:px-6">
      <div v-if="loading" class="py-12 flex justify-center">
        <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else class="space-y-6">
        <!-- Personal or Family Mode -->
        <div>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Usage Mode</h3>
          </div>
          
          <div v-if="isPersonalOnly" class="mt-5 bg-white shadow overflow-hidden rounded-md">
            <div class="px-4 py-5 sm:p-6">
              <h4 class="text-base font-medium text-gray-900">You're using LifeHubOrganizer in Personal Mode</h4>
              <p class="mt-1 text-sm text-gray-500">
                In Personal Mode, all your data is private to you. You can create a family to share events, documents, and more.
              </p>
              
              <div class="mt-5">
                <button
                  type="button"
                  @click="$emit('create-family')"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Create a Family
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="mt-5 bg-white shadow overflow-hidden rounded-md">
            <div class="px-4 py-5 sm:p-6">
              <h4 class="text-base font-medium text-gray-900">You're using LifeHubOrganizer in Family Mode</h4>
              <p class="mt-1 text-sm text-gray-500">
                You can share events, documents, and more with your family members.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Family Members Section -->
        <div>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Family Members</h3>
            <button
              v-if="!isPersonalOnly"
              type="button"
              @click="$emit('invite-member')"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Family Member
            </button>
          </div>
          <p v-if="isPersonalOnly" class="mt-1 text-sm text-gray-500">
            Create a family to start adding members.
          </p>
          <p v-else-if="familyMembers.length === 0" class="mt-1 text-sm text-gray-500">
            You haven't added any family members yet.
          </p>
          
          <!-- Family member list -->
          <ul v-if="!isPersonalOnly && familyMembers.length > 0" class="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="member in familyMembers" :key="member.id" class="col-span-1 flex shadow-sm rounded-md">
              <div class="flex-shrink-0 flex items-center justify-center w-16 bg-primary-600 text-white text-sm font-medium rounded-l-md">
                {{ member.initials }}
              </div>
              <div class="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                <div class="flex-1 px-4 py-2 text-sm truncate">
                  <p class="text-gray-900 font-medium">{{ member.name }}</p>
                  <p class="text-gray-500">{{ member.email }}</p>
                </div>
                <div class="flex-shrink-0 pr-2">
                  <span v-if="member.role === 'admin'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Admin
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // Define the interface for a family member
  interface FamilyMember {
    id: string;
    user_id: string;
    role: string;
    name: string;
    email: string;
    initials: string;
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
    isPersonalOnly: {
      type: Boolean,
      default: true
    },
    familyId: {
      type: String,
      default: null as string | null
    },
    familyMembers: {
      type: Array as () => FamilyMember[],
      default: () => []
    }
  });
  
  defineEmits(['create-family', 'invite-member']);
  </script>