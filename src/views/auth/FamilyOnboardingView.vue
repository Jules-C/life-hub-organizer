<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Family Setup
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Set up your LifeHubOrganizer experience
        </p>
      </div>
      
      <!-- Step indicator -->
      <div class="flex items-center justify-center">
        <ol class="flex items-center w-full">
          <li class="flex w-full items-center text-primary-600 after:content-[''] after:w-full after:h-1 after:border-b after:border-primary-200 after:border-4 after:inline-block">
            <span class="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full lg:h-12 lg:w-12 shrink-0">
              <svg class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
          </li>
          <li class="flex w-full items-center" :class="currentStep >= 2 ? 'text-primary-600 after:border-primary-200' : 'text-gray-400 after:border-gray-200'">
            <span class="flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0" :class="currentStep >= 2 ? 'bg-primary-100' : 'bg-gray-100'">
              <svg class="w-5 h-5 lg:w-6 lg:h-6" :class="currentStep >= 2 ? 'text-primary-600' : 'text-gray-400'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </li>
          <li class="flex items-center" :class="currentStep >= 3 ? 'text-primary-600' : 'text-gray-400'">
            <span class="flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0" :class="currentStep >= 3 ? 'bg-primary-100' : 'bg-gray-100'">
              <svg class="w-5 h-5 lg:w-6 lg:h-6" :class="currentStep >= 3 ? 'text-primary-600' : 'text-gray-400'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </li>
        </ol>
      </div>
      
      <!-- Step 1: Personal vs Family Mode -->
      <div v-if="currentStep === 1" class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">How will you use LifeHubOrganizer?</h3>
        
        <div class="space-y-4">
          <div 
            class="p-5 border rounded-lg cursor-pointer"
            :class="selectedMode === 'personal' ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-300'"
            @click="selectedMode = 'personal'"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="ml-3">
                <h4 class="text-sm font-medium text-gray-900">Personal Use</h4>
                <p class="text-sm text-gray-500">Just for me - I'll organize my own events, documents, and health data.</p>
              </div>
              <div class="ml-auto">
                <input 
                  type="radio" 
                  name="mode" 
                  :checked="selectedMode === 'personal'"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
              </div>
            </div>
          </div>
          
          <div 
            class="p-5 border rounded-lg cursor-pointer"
            :class="selectedMode === 'family' ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-300'"
            @click="selectedMode = 'family'"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-3">
                <h4 class="text-sm font-medium text-gray-900">Family Use</h4>
                <p class="text-sm text-gray-500">For my family - We'll share calendars, documents, and coordinate together.</p>
              </div>
              <div class="ml-auto">
                <input 
                  type="radio" 
                  name="mode" 
                  :checked="selectedMode === 'family'"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <button
            type="button"
            @click="goToNextStep"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Continue
          </button>
        </div>
      </div>
      
      <!-- Step 2: Family Setup (only if family mode selected) -->
      <div v-if="currentStep === 2" class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ selectedMode === 'family' ? 'Create Your Family' : 'Features Setup' }}
        </h3>
        
        <div v-if="selectedMode === 'family'" class="space-y-4">
          <div>
            <label for="family-name" class="block text-sm font-medium text-gray-700">Family Name</label>
            <input 
              type="text" 
              id="family-name" 
              v-model="familyInfo.name"
              placeholder="e.g. The Smith Family"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label for="family-description" class="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea 
              id="family-description" 
              v-model="familyInfo.description"
              placeholder="A brief description of your family"
              rows="3" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            ></textarea>
          </div>
          
          <div class="rounded-md bg-blue-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 flex-1 md:flex md:justify-between">
                <p class="text-sm text-blue-700">
                  You'll be the admin of this family. You can invite family members in the next step.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="space-y-4">
          <!-- Feature toggles for personal mode -->
          <div class="rounded-md bg-blue-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 flex-1 md:flex md:justify-between">
                <p class="text-sm text-blue-700">
                  You're using LifeHubOrganizer in personal mode. You can customize your features below.
                </p>
              </div>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-4">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="feature-health-tracking"
                  name="feature-health-tracking"
                  type="checkbox"
                  v-model="features.healthTracking"
                  class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="feature-health-tracking" class="font-medium text-gray-700">Enable Health Tracking</label>
                <p class="text-gray-500">Track your health data with cycle tracking and analysis.</p>
              </div>
            </div>
            
            <div class="mt-4 flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="feature-personal-events"
                  name="feature-personal-events"
                  type="checkbox"
                  v-model="features.personalEvents"
                  class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="feature-personal-events" class="font-medium text-gray-700">Enable Personal Events</label>
                <p class="text-gray-500">Manage personal events and work schedule.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-between">
          <button
            type="button"
            @click="goToPreviousStep"
            class="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back
          </button>
          <button
            type="button"
            @click="goToNextStep"
            class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {{ selectedMode === 'family' ? 'Continue' : 'Finish Setup' }}
          </button>
        </div>
      </div>
      
      <!-- Step 3: Invite Members (only for family mode) -->
      <div v-if="currentStep === 3" class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Invite Family Members</h3>
        
        <div class="space-y-4">
          <div v-for="(member, index) in familyMembers" :key="index" class="flex items-center space-x-2">
            <input 
              type="email" 
              v-model="member.email"
              placeholder="Enter email address"
              class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <select 
              v-model="member.role"
              class="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button 
              v-if="index > 0"
              type="button" 
              @click="removeMember(index)"
              class="p-2 text-red-600 hover:text-red-800"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          <button
            type="button"
            @click="addMember"
            class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add another member
          </button>
          
          <div class="rounded-md bg-yellow-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-yellow-700">
                  Email invitations will be sent to these addresses. They'll need to create accounts to join your family.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-between">
          <button
            type="button"
            @click="goToPreviousStep"
            class="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back
          </button>
          <button
            type="button"
            @click="completeSetup"
            :disabled="submitting"
            class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ submitting ? 'Processing...' : 'Complete Setup' }}
          </button>
        </div>
      </div>
      
      <!-- Success Step -->
      <div v-if="currentStep === 4" class="mt-8 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="mt-3 text-lg font-medium text-gray-900">Setup Completed!</h3>
        <p class="mt-2 text-sm text-gray-500">
          {{ selectedMode === 'family' 
            ? 'Your family has been created and invitations have been sent.' 
            : 'Your personal settings have been saved.' }}
        </p>
        <div class="mt-5">
          <button
            type="button"
            @click="goToDashboard"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
      
      <!-- Error Message -->
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-4 mt-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/services/supabase';
import { familyService } from '@/services/family';
import { useAuthStore } from '@/stores/auth';
import { useUserPreferencesStore } from '@/stores/userPreferences';

// Setup state
const currentStep = ref(1);
const selectedMode = ref('personal');
const submitting = ref(false);
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();
const userPreferencesStore = useUserPreferencesStore();

// Family information
const familyInfo = ref({
  name: '',
  description: ''
});

// Family members
const familyMembers = ref([
  { email: '', role: 'member' }
]);

// Feature toggles for personal mode
const features = ref({
  healthTracking: true,
  healthPrivacy: false,
  personalEvents: true,
  workSchedule: true
});

// Navigation methods
function goToNextStep() {
  if (currentStep.value === 1) {
    currentStep.value = 2;
  } else if (currentStep.value === 2) {
    if (selectedMode.value === 'family') {
      // Validate family name
      if (!familyInfo.value.name.trim()) {
        errorMessage.value = 'Please enter a family name';
        return;
      }
      currentStep.value = 3;
    } else {
      // Complete setup for personal mode
      completeSetup();
    }
  }
}

function goToPreviousStep() {
  currentStep.value--;
  errorMessage.value = ''; // Clear any error messages when going back
}

// Member management
function addMember() {
  familyMembers.value.push({ email: '', role: 'member' });
}

function removeMember(index: number) {
  familyMembers.value.splice(index, 1);
}

function goToDashboard() {
  router.push('/');
}

// Create a family in the database
async function createFamily() {
  if (!authStore.user) {
    throw new Error('User not authenticated');
  }

  // Create family record
  const { data: familyData, error: familyError } = await familyService.createFamily({
    name: familyInfo.value.name,
    description: familyInfo.value.description,
    created_by: authStore.user.id
  });

  if (familyError) throw familyError;
  
  // Add the current user as an admin
  const { error: memberError } = await familyService.addFamilyMember({
    family_id: familyData.id,
    user_id: authStore.user.id,
    role: 'admin'
  });

  if (memberError) throw memberError;
  
  // Filter out empty emails
  const validMembers = familyMembers.value.filter(member => member.email.trim());
  
  // Process invitations for family members
  const invitationErrors = [];
  for (const member of validMembers) {
    try {
      await familyService.inviteFamilyMember({
        email: member.email,
        role: member.role,
        family_id: familyData.id,
        invited_by: authStore.user.id
      });
    } catch (error) {
      console.error(`Failed to invite ${member.email}:`, error);
      invitationErrors.push(`${member.email}: ${error.message || 'Unknown error'}`);
    }
  }
  
  // If there were any invitation errors, we still created the family successfully
  // but we should inform the user that some invitations failed
  if (invitationErrors.length > 0) {
    console.warn('Some invitations failed to send:', invitationErrors);
    // In a real app, you might want to display these errors to the user
    // or retry sending the invitations
  }
  
  return familyData;
}

// Save user preferences
async function saveUserPreferences() {
  // Update feature toggles in the user preferences store
  await userPreferencesStore.updateFeatures({
    healthTracking: features.value.healthTracking,
    healthPrivacy: features.value.healthPrivacy,
    personalEvents: features.value.personalEvents,
    workSchedule: features.value.workSchedule
  });
}

// Finish the setup process
async function completeSetup() {
  errorMessage.value = '';
  submitting.value = true;
  
  try {
    // If family mode, create the family
    if (selectedMode.value === 'family') {
      // Basic validation for family members
      const validEmails = familyMembers.value.every(member => 
        !member.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)
      );
      
      if (!validEmails) {
        errorMessage.value = 'Please enter valid email addresses for all members';
        submitting.value = false;
        return;
      }
      
      await createFamily();
    }
    
    // In both modes, save user preferences
    await saveUserPreferences();
    
    // Show success step
    currentStep.value = 4;
    
  } catch (error: any) {
    console.error('Error during setup:', error);
    errorMessage.value = error.message || 'An unexpected error occurred during setup';
  } finally {
    submitting.value = false;
  }
}
</script>