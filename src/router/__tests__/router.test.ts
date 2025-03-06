// src/router/__tests__/router.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/stores/auth';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import router from '../index';
import { setActivePinia, createPinia } from 'pinia';
import type { RouteLocationNormalized } from 'vue-router';
import type { Features } from '@/types/router';
import { createMockRoute, createMockNext } from '@/test-utils/router-test-helpers';

// Mock the stores
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn()
}));

vi.mock('@/stores/userPreferences', () => ({
  useUserPreferencesStore: vi.fn()
}));

// Define our mocked store interfaces
interface MockAuthStore {
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  setRedirectPath?: (path: string) => void;
}

interface MockPreferencesStore {
  initialize: () => Promise<void>;
  features: Features;
}

describe('Router Guards', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('Authentication Guard', () => {
    it('should redirect to login if accessing protected route while not authenticated', async () => {
      const mockAuthStore: MockAuthStore = {
        isAuthenticated: false,
        initialize: vi.fn().mockResolvedValue(undefined),
        setRedirectPath: vi.fn()
      };

      const mockPreferencesStore: MockPreferencesStore = {
        initialize: vi.fn().mockResolvedValue(undefined),
        features: {
          healthTracking: false,
          healthPrivacy: false,
          personalEvents: true,
          workSchedule: false
        }
      };

      // Cast the mock functions to the right type
      vi.mocked(useAuthStore).mockReturnValue(mockAuthStore as any);
      vi.mocked(useUserPreferencesStore).mockReturnValue(mockPreferencesStore as any);

      const to = createMockRoute({ 
        name: 'home',
        meta: { requiresAuth: true },
        fullPath: '/home'
      });
      
      const from = createMockRoute({ name: undefined });
      const next = createMockNext();

      // Get the beforeEach guard directly from the router
      // Use a simple approach to test the router guard
      const guard = router.beforeEach as any;
      
      // Call the guard function directly
      await guard(to, from, next);

      expect(mockAuthStore.setRedirectPath).toHaveBeenCalledWith('/home');
      expect(next).toHaveBeenCalledWith({ name: 'login' });
    });

    it('should redirect to home if accessing guest route while authenticated', async () => {
      const mockAuthStore: MockAuthStore = {
        isAuthenticated: true,
        initialize: vi.fn().mockResolvedValue(undefined)
      };

      const mockPreferencesStore: MockPreferencesStore = {
        initialize: vi.fn().mockResolvedValue(undefined),
        features: {
          healthTracking: false,
          healthPrivacy: false,
          personalEvents: true,
          workSchedule: false
        }
      };

      vi.mocked(useAuthStore).mockReturnValue(mockAuthStore as any);
      vi.mocked(useUserPreferencesStore).mockReturnValue(mockPreferencesStore as any);

      const to = createMockRoute({ 
        name: 'login',
        meta: { requiresGuest: true }
      });
      
      const from = createMockRoute({ name: 'home' });
      const next = createMockNext();

      // Use a simple approach to test the router guard
      const guard = router.beforeEach as any;
      
      // Call the guard function directly
      await guard(to, from, next);

      expect(next).toHaveBeenCalledWith({ name: 'home' });
    });
  });

  describe('Feature Guards', () => {
    it('should prevent access to health tracking if feature is disabled', async () => {
      const mockPreferencesStore: MockPreferencesStore = {
        initialize: vi.fn().mockResolvedValue(undefined),
        features: {
          healthTracking: false,
          healthPrivacy: false,
          personalEvents: true,
          workSchedule: false
        }
      };

      const mockAuthStore: MockAuthStore = {
        isAuthenticated: true,
        initialize: vi.fn().mockResolvedValue(undefined)
      };

      vi.mocked(useAuthStore).mockReturnValue(mockAuthStore as any);
      vi.mocked(useUserPreferencesStore).mockReturnValue(mockPreferencesStore as any);

      const route = router.getRoutes().find(r => r.name === 'cycle-tracking');
      expect(route).toBeDefined();
      
      if (route?.beforeEnter) {
        // Handle the case where beforeEnter might be an array or a function
        const guard = typeof route.beforeEnter === 'function' 
          ? route.beforeEnter 
          : Array.isArray(route.beforeEnter) 
            ? route.beforeEnter[0] 
            : undefined;
            
        if (guard) {
          const to = createMockRoute({ name: 'cycle-tracking' });
          const from = createMockRoute({ name: 'home' });
          const next = createMockNext();
          
          // Call the guard function directly
          // Call the guard function directly
          const guardFn = guard as any;
          await guardFn(to, from, next);
          
          expect(next).toHaveBeenCalledWith({ name: 'home' });
        }
      }
    });

    it('should allow access to health tracking if feature is enabled', async () => {
      const mockPreferencesStore: MockPreferencesStore = {
        initialize: vi.fn().mockResolvedValue(undefined),
        features: {
          healthTracking: true,
          healthPrivacy: false,
          personalEvents: true,
          workSchedule: false
        }
      };

      const mockAuthStore: MockAuthStore = {
        isAuthenticated: true,
        initialize: vi.fn().mockResolvedValue(undefined)
      };

      vi.mocked(useAuthStore).mockReturnValue(mockAuthStore as any);
      vi.mocked(useUserPreferencesStore).mockReturnValue(mockPreferencesStore as any);

      const route = router.getRoutes().find(r => r.name === 'cycle-tracking');
      expect(route).toBeDefined();
      
      if (route?.beforeEnter) {
        // Handle the case where beforeEnter might be an array or a function
        const guard = typeof route.beforeEnter === 'function' 
          ? route.beforeEnter 
          : Array.isArray(route.beforeEnter) 
            ? route.beforeEnter[0] 
            : undefined;
            
        if (guard) {
          const to = createMockRoute({ name: 'cycle-tracking' });
          const from = createMockRoute({ name: 'home' });
          const next = createMockNext();
          
          // Call the guard function directly
          // Call the guard function directly
          const guardFn = guard as any;
          await guardFn(to, from, next);
          
          expect(next).toHaveBeenCalled();
        }
      }
    });
  });

  describe('Error Handling', () => {
    it('should redirect to error page on initialization failure', async () => {
      const mockAuthStore: MockAuthStore = {
        isAuthenticated: false,
        initialize: vi.fn().mockRejectedValue(new Error('Failed to initialize'))
      };

      const mockPreferencesStore: MockPreferencesStore = {
        initialize: vi.fn().mockResolvedValue(undefined),
        features: {
          healthTracking: false,
          healthPrivacy: false,
          personalEvents: true,
          workSchedule: false
        }
      };

      vi.mocked(useAuthStore).mockReturnValue(mockAuthStore as any);
      vi.mocked(useUserPreferencesStore).mockReturnValue(mockPreferencesStore as any);

      const to = createMockRoute({ 
        name: 'home',
        fullPath: '/home'
      });
      
      const from = createMockRoute({ name: undefined });
      const next = createMockNext();

      // Use a simple approach to test the router guard
      const guard = router.beforeEach as any;
      
      // Call the guard function directly
      await guard(to, from, next);

      expect(next).toHaveBeenCalledWith({
        name: 'error',
        query: {
          message: 'Failed to initialize',
          from: '/home'
        }
      });
    });
  });
});