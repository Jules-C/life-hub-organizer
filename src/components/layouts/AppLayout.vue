<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation bar -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-primary-600">LifeHubOrganizer</h1>
            </div>
            
            <!-- Navigation links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                to="/" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-primary-500 text-primary-700': isActive('/') }"
              >
                Dashboard
              </router-link>
              
              <router-link 
                to="/calendar" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-primary-500 text-primary-700': isActive('/calendar') }"
              >
                Calendar
              </router-link>
              
              <router-link 
                to="/health" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-primary-500 text-primary-700': isActive('/health') }"
                v-if="isHealthTrackingEnabled"
              >
                Health
              </router-link>
              
              <router-link 
                to="/documents" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-primary-500 text-primary-700': isActive('/documents') }"
              >
                Documents
              </router-link>
            </div>
          </div>
          
          <!-- User menu -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <!-- Notifications dropdown -->
            <div class="ml-3 relative">
              <button
                @click="showNotifications = !showNotifications"
                class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span class="sr-only">View notifications</span>
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                
                <!-- Notification badge -->
                <span v-if="notificationCount > 0" class="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white text-center">
                  {{ notificationCount }}
                </span>
              </button>
              
              <!-- Notifications dropdown -->
              <div
                v-if="showNotifications"
                class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              >
                <div class="px-4 py-2 border-b border-gray-200">
                  <h3 class="text-sm font-medium text-gray-900">Notifications</h3>
                </div>
                
                <div v-if="notifications.length > 0" class="max-h-60 overflow-y-auto">
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                    <p class="text-xs text-gray-500">{{ notification.message }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ formatDate(notification.created_at) }}</p>
                  </div>
                </div>
                
                <div v-else class="px-4 py-4 text-center text-sm text-gray-500">
                  No new notifications
                </div>
              </div>
            </div>
            
            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div>
                <button
                  @click="showProfileMenu = !showProfileMenu"
                  class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <span class="sr-only">Open user menu</span>
                  <div v-if="user?.user_metadata?.avatar_url" class="h-8 w-8 rounded-full overflow-hidden">
                    <img :src="user.user_metadata.avatar_url" alt="User avatar" class="h-full w-full object-cover" />
                  </div>
                  <div v-else class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-primary-800">
                      {{ userInitials }}
                    </span>
                  </div>
                </button>
              </div>
              
              <!-- Profile dropdown menu -->
              <div
                v-if="showProfileMenu"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              >
                <div class="px-4 py-2 border-b border-gray-200">
                  <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                  <p class="text-sm text-gray-500">{{ user?.email }}</p>
                </div>
                
                <router-link
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showProfileMenu = false"
                >
                  Settings
                </router-link>
                
                <button
                  @click="logout"
                  class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
          
          <!-- Mobile menu button -->
          <div class="-mr-2 flex items-center sm:hidden">
            <button
              @click="showMobileMenu = !showMobileMenu"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                v-if="!showMobileMenu"
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <svg
                v-else
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link
            to="/"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="isActive('/') ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'"
            @click="showMobileMenu = false"
          >
            Dashboard
          </router-link>
          
          <router-link
            to="/calendar"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="isActive('/calendar') ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'"
            @click="showMobileMenu = false"
          >
            Calendar
          </router-link>
          
          <router-link
            v-if="isHealthTrackingEnabled"
            to="/health"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="isActive('/health') ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'"
            @click="showMobileMenu = false"
          >
            Health
          </router-link>
          
          <router-link
            to="/documents"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="isActive('/documents') ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'"
            @click="showMobileMenu = false"
          >
            Documents
          </router-link>
        </div>
        
        <div class="pt-4 pb-3 border-t border-gray-200">
          <!-- User info -->
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div v-if="user?.user_metadata?.avatar_url" class="h-10 w-10 rounded-full overflow-hidden">
                <img :src="user.user_metadata.avatar_url" alt="User avatar" class="h-full w-full object-cover" />
              </div>
              <div v-else class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span class="text-sm font-medium text-primary-800">
                  {{ userInitials }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ userName }}</div>
              <div class="text-sm font-medium text-gray-500">{{ user?.email }}</div>
            </div>
            <button
              @click="showMobileNotifications = !showMobileNotifications"
              class="ml-auto bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span class="sr-only">View notifications</span>
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              
              <!-- Notification badge -->
              <span v-if="notificationCount > 0" class="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white text-center">
                {{ notificationCount }}
              </span>
            </button>
          </div>
          
          <!-- Mobile notifications -->
          <div v-if="showMobileNotifications" class="mt-3 space-y-1 px-2">
            <div v-if="notifications.length > 0" class="max-h-60 overflow-y-auto rounded-md bg-white shadow-md">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                <p class="text-xs text-gray-500">{{ notification.message }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatDate(notification.created_at) }}</p>
              </div>
            </div>
            
            <div v-else class="px-4 py-4 text-center text-sm text-gray-500 bg-white rounded-md shadow-md">
              No new notifications
            </div>
          </div>
          
          <!-- Mobile profile menu -->
          <div class="mt-3 space-y-1">
            <router-link
              to="/settings"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              @click="showMobileMenu = false"
            >
              Settings
            </router-link>
            <button
              @click="logout"
              class="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main content -->
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <slot></slot>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="text-center text-sm text-gray-500">
          <p>&copy; {{ currentYear }} LifeHubOrganizer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUserPreferencesStore } from '@/stores/userPreferences';

// Stores
const authStore = useAuthStore();
const preferencesStore = useUserPreferencesStore();
const route = useRoute();
const router = useRouter();

// Component state
const showMobileMenu = ref(false);
const showProfileMenu = ref(false);
const showNotifications = ref(false);
const showMobileNotifications = ref(false);

// Mock notifications - in a real app, these would come from a notification service
const notifications = ref([
  {
    id: '1',
    title: 'Family Calendar Update',
    message: 'Jane added a new event to the family calendar',
    created_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: '2',
    title: 'Health Reminder',
    message: 'Don\'t forget to log your health data today',
    created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
]);

// Computed properties
const user = computed(() => authStore.user);
const userName = computed(() => {
  if (!user.value) return '';
  
  const firstName = user.value.user_metadata?.first_name || '';
  const lastName = user.value.user_metadata?.last_name || '';
  
  return firstName && lastName ? `${firstName} ${lastName}` : user.value.email?.split('@')[0] || '';
});

const userInitials = computed(() => {
  if (!user.value) return '';
  
  const firstName = user.value.user_metadata?.first_name || '';
  const lastName = user.value.user_metadata?.last_name || '';
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  
  // Fallback to email
  const email = user.value.email || '';
  return email ? email[0].toUpperCase() : '';
});

const notificationCount = computed(() => notifications.value.length);
const currentYear = computed(() => new Date().getFullYear());
const isHealthTrackingEnabled = computed(() => preferencesStore.isHealthTrackingEnabled);

// Methods
function isActive(path: string): boolean {
  // Exact match for home
  if (path === '/' && route.path === '/') return true;
  
  // Prefix match for other paths
  return path !== '/' && route.path.startsWith(path);
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffHours < 1) {
    return 'Just now';
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}

async function logout() {
  try {
    const result = await authStore.logout();
    
    if (result.success) {
      // Close menus
      showProfileMenu.value = false;
      showMobileMenu.value = false;
      
      // Redirect to login
      router.push({ name: 'login' });
    } else {
      console.error('Logout failed:', result.error);
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

// Close dropdowns when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  
  // Close profile menu if clicking outside
  if (showProfileMenu.value && !target.closest('[data-dropdown="profile"]')) {
    showProfileMenu.value = false;
  }
  
  // Close notifications if clicking outside
  if (showNotifications.value && !target.closest('[data-dropdown="notifications"]')) {
    showNotifications.value = false;
  }
}

// Set up event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
