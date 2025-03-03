<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-primary-600">LifeHubOrganizer</h1>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              to="/"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="$route.name === 'home' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
            >
              Dashboard
            </router-link>
            <router-link
              to="/documents"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="$route.name === 'documents' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
            >
              Documents
            </router-link>
            <router-link
              to="/calendar"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="$route.name === 'calendar' || $route.name === 'personal-events' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
            >
              Calendar
            </router-link>
            <!-- Only show Health link if feature is enabled -->
            <router-link
              v-if="isHealthTrackingEnabled"
              to="/health/cycle-tracking"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="$route.name === 'cycle-tracking' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'"
            >
              Health
            </router-link>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <div class="ml-3 relative">
            <div class="flex items-center space-x-3">
              <router-link
                to="/settings"
                class="text-gray-500 hover:text-gray-700"
              >
                Settings
              </router-link>
              <button
                @click="handleLogout"
                class="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        <!-- Mobile menu button -->
        <div class="flex items-center sm:hidden">
          <button 
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Icon when menu is closed -->
            <svg 
              v-if="!mobileMenuOpen"
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!-- Icon when menu is open -->
            <svg 
              v-else
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu, show/hide based on menu state -->
    <div 
      v-show="mobileMenuOpen" 
      class="sm:hidden"
    >
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          to="/"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="$route.name === 'home' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          @click="closeMobileMenu"
        >
          Dashboard
        </router-link>
        <router-link
          to="/documents"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="$route.name === 'documents' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          @click="closeMobileMenu"
        >
          Documents
        </router-link>
        <router-link
          to="/calendar"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="$route.name === 'calendar' || $route.name === 'personal-events' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          @click="closeMobileMenu"
        >
          Calendar
        </router-link>
        
        <!-- Only show Personal Events if feature is enabled -->
        <router-link
          v-if="isPersonalEventsEnabled"
          to="/personal-events"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium pl-6"
          :class="$route.name === 'personal-events' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          @click="closeMobileMenu"
        >
          - Personal Events
        </router-link>
        
        <!-- Only show Health link if feature is enabled -->
        <router-link
          v-if="isHealthTrackingEnabled"
          to="/health/cycle-tracking"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="$route.name === 'cycle-tracking' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          @click="closeMobileMenu"
        >
          Health
        </router-link>
        
        <router-link
          to="/settings"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
          @click="closeMobileMenu"
        >
          Settings
        </router-link>
        <button
          @click="handleLogout"
          class="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

// Define props with default values
interface Props {
  isHealthTrackingEnabled?: boolean;
  isPersonalEventsEnabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isHealthTrackingEnabled: true,
  isPersonalEventsEnabled: true
});

// Set up reactive state
const mobileMenuOpen = ref(false);

// Set up stores and router
const authStore = useAuthStore();
const router = useRouter();

// Methods
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

async function handleLogout() {
  const { success } = await authStore.logout();
  if (success) {
    router.push('/login');
  }
}
</script>
