import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUserPreferencesStore } from '@/stores/userPreferences';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
      {
        path: '/onboarding',
        name: 'onboarding',
        component: () => import('@/views/auth/FamilyOnboardingView.vue'),
        meta: { requiresAuth: true }
      },
    {
      path: '/documents',
      name: 'documents',
      component: () => import('@/views/documents/DocumentsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/calendar/CalendarView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/personal-events',
      name: 'personal-events',
      component: () => import('@/views/calendar/PersonalEventsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/health/cycle-tracking',
      name: 'cycle-tracking',
      component: () => import('@/views/health/CycleTrackingView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/settings/SettingsView.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const userPreferencesStore = useUserPreferencesStore();
  
  // Wait for auth to initialize on first navigation
  if (!from.name) {
    await authStore.initialize();
    await userPreferencesStore.initialize();
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if trying to access protected route
    next({ name: 'login' });
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Redirect to home if trying to access guest route while logged in
    next({ name: 'home' });
  } else if (to.name === 'cycle-tracking' && !userPreferencesStore.isHealthTrackingEnabled) {
    // Redirect to home if health tracking is disabled
    console.warn('Health tracking feature is disabled. Enable it in Settings > Features.');
    next({ name: 'home' });
  } else if (to.name === 'personal-events' && !userPreferencesStore.isPersonalEventsEnabled) {
    // Redirect to home if personal events is disabled
    console.warn('Personal events feature is disabled. Enable it in Settings > Features.');
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
