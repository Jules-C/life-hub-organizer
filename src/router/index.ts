// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import type { Features } from '@/types/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({ showSpinner: false });

// Feature guard factory
function featureGuard(feature: keyof Features) {
  return async (to: any, from: any, next: any) => {
    const userPreferencesStore = useUserPreferencesStore();
    await userPreferencesStore.initialize();
    
    if (!userPreferencesStore.features[feature]) {
      console.warn(`Feature ${feature} is disabled. Enable it in Settings > Features.`);
      next({ name: 'home' });
      return;
    }
    next();
  };
}

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
    // Redirect legacy routes to unified calendar
    {
      path: '/personal-events',
      redirect: to => {
        // Use query params to set initial filter
        return {
          path: '/calendar',
          query: { filter: 'personal' }
        };
      }
    },
    {
      path: '/health/cycle-tracking',
      redirect: to => {
        return {
          path: '/calendar',
          query: { filter: 'health' }
        };
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/settings/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/ErrorView.vue')
    },
    // Catch-all 404 route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  // Start progress bar
  NProgress.start();

  const authStore = useAuthStore();
  const userPreferencesStore = useUserPreferencesStore();
  
  try {
    // Initialize stores on first navigation
    if (!from.name) {
      await Promise.all([
        authStore.initialize(),
        userPreferencesStore.initialize()
      ]);
    }

    // Handle auth requirements
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      // Save intended destination
      authStore.setRedirectPath(to.fullPath);
      next({ name: 'login' });
      return;
    }

    if (to.meta.requiresGuest && authStore.isAuthenticated) {
      next({ name: 'home' });
      return;
    }

    // Handle query parameters for calendar filters
    if (to.path === '/calendar' && to.query.filter) {
      // This will be handled in the calendar component
      // to activate the corresponding filter
    }

    next();
  } catch (error) {
    console.error('Navigation guard error:', error);
    next({
      name: 'error',
      query: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        from: to.fullPath
      }
    });
  }
});

router.afterEach(() => {
  // Complete progress bar
  NProgress.done();
});

export default router;