// src/router/__tests__/router.test.ts
import { describe, it, expect, vi } from 'vitest';
import { useAuthStore } from '@/stores/auth';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { createRouter, createMemoryHistory } from 'vue-router';
import router from '../index';

vi.mock('@/stores/auth');
vi.mock('@/stores/userPreferences');

describe('Router Guards', () => {
  describe('Authentication', () => {
    it('should redirect unauthenticated users to login', async () => {
      const mockRouterPush = vi.fn();
      
      // Setup mocks
      vi.mocked(useAuthStore).mockReturnValue({
        isAuthenticated: false,
        setRedirectPath: vi.fn(),
        initialize: vi.fn().mockResolvedValue(undefined)
      } as any);
      
      vi.mocked(useUserPreferencesStore).mockReturnValue({
        initialize: vi.fn().mockResolvedValue(undefined),
        features: {}
      } as any);
      
      // Create test router
      const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: router.getRoutes()
      });
      
      // Override methods
      testRouter.push = mockRouterPush;
      
      // Try to navigate to protected route
      await testRouter.push('/home');
      
      // Check if redirect happened
      expect(mockRouterPush).toHaveBeenCalledWith(expect.objectContaining({
        name: 'login'
      }));
    });
  });
});