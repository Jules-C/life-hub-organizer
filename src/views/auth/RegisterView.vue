<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Join LifeHubOrganizer and start organizing your family's life
        </p>
        
        <!-- Invitation notification when joining via invitation -->
        <div v-if="invitation" class="mt-4 rounded-md bg-blue-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-blue-700">
                You've been invited to join a family. Fill out the form below to accept the invitation.
              </p>
            </div>
          </div>
        </div>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="first-name" class="sr-only">First name</label>
            <input
              id="first-name"
              name="firstName"
              type="text"
              required
              v-model="firstName"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="First name"
            />
          </div>
          <div>
            <label for="last-name" class="sr-only">Last name</label>
            <input
              id="last-name"
              name="lastName"
              type="text"
              required
              v-model="lastName"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Last name"
            />
          </div>
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              :disabled="invitationEmail !== ''"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              v-model="password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
              Already have an account? Sign in
            </router-link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span v-if="loading">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
            <span v-else>{{ invitation ? 'Create account & accept invitation' : 'Create account' }}</span>
          </button>
        </div>
        
        <div v-if="errorMessage" class="mt-3 text-sm text-center text-red-500">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { familyService } from '@/services/family';

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Check for invitation token
const invitation = ref<string | null>(null);
const invitationEmail = ref('');

onMounted(async () => {
  // Check for invitation token in URL
  const token = route.query.token as string;
  if (token) {
    invitation.value = token;
    
    // Here you would typically verify the token and get the invitation details
    // For example, get the email associated with the invitation
    // This would be a server/database call in a real implementation
    try {
      // Simulated verification - in a real app, you'd call an API endpoint
      // const response = await verifyInvitationToken(token);
      // invitationEmail.value = response.email;
      
      // For now, we'll just use a placeholder
      invitationEmail.value = '';
      
      // Pre-fill the email if it's available
      if (invitationEmail.value) {
        email.value = invitationEmail.value;
      }
    } catch (error) {
      console.error('Failed to verify invitation token:', error);
      errorMessage.value = 'Invalid or expired invitation. Please request a new one.';
    }
  }
});

async function handleRegister() {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    // Register the user
    const { success, error } = await authStore.register(
      email.value,
      password.value,
      firstName.value,
      lastName.value
    );
    
    if (!success) {
      throw new Error(error || 'Failed to create account');
    }
    
    // If there's an invitation token, process it
    if (invitation.value) {
      const { success: inviteSuccess, error: inviteError } = await familyService.acceptInvitation(invitation.value);
      
      if (!inviteSuccess) {
        throw new Error(inviteError?.message || 'Failed to accept invitation');
      }
      
      // Redirect to the dashboard (skip onboarding)
      router.push('/');
    } else {
      // Regular flow - go to onboarding
      router.push('/onboarding');
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to create account. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>