// src/stores/__tests__/auth.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../auth';
import { authService } from '@/services/auth';
import type { User, AuthError } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/user';

// Define the return type for auth service methods
interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

// Create a mock implementation
vi.mock('@/services/auth', () => ({
  authService: {
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getCurrentUser: vi.fn(),
    getSession: vi.fn(),
    updateProfile: vi.fn()
  }
}));

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  // Create a partial User object that satisfies the type requirements
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {
      first_name: 'Test',
      last_name: 'User'
    },
    aud: 'authenticated',
    created_at: ''
  } as User;

  // Create a mock error that satisfies AuthError
  const mockAuthError = {
    message: 'Invalid credentials',
    status: 400
  } as AuthError;

  describe('initialize', () => {
    it('should set user if getCurrentUser returns a user', async () => {
      vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);

      const store = useAuthStore();
      await store.initialize();

      expect(store.user).toEqual(mockUser);
      expect(store.isAuthenticated).toBe(true);
    });

    it('should handle initialization error gracefully', async () => {
      vi.mocked(authService.getCurrentUser).mockRejectedValue(new Error('Failed to get user'));

      const store = useAuthStore();
      await store.initialize();

      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('should successfully log in user', async () => {
      const mockResponse: AuthResponse = { user: mockUser, error: null };
      vi.mocked(authService.signIn).mockResolvedValue(mockResponse);

      const store = useAuthStore();
      const result = await store.login('test@example.com', 'password');

      expect(result.success).toBe(true);
      expect(store.user).toEqual(mockUser);
      expect(store.isAuthenticated).toBe(true);
    });

    it('should handle login failure', async () => {
      const mockResponse: AuthResponse = { 
        user: null, 
        error: mockAuthError
      };
      vi.mocked(authService.signIn).mockResolvedValue(mockResponse);

      const store = useAuthStore();
      const result = await store.login('test@example.com', 'wrong-password');

      expect(result.success).toBe(false);
      expect(result.error).toBe(mockAuthError.message);
      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should successfully log out user', async () => {
      vi.mocked(authService.signOut).mockResolvedValue();

      const store = useAuthStore();
      store.user = mockUser;

      const result = await store.logout();

      expect(result.success).toBe(true);
      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });

    it('should handle logout failure', async () => {
      vi.mocked(authService.signOut).mockRejectedValue(mockAuthError);

      const store = useAuthStore();
      store.user = mockUser;

      const result = await store.logout();

      expect(result.success).toBe(false);
      expect(result.error).toBe(mockAuthError.message);
    });
  });

  describe('register', () => {
    it('should successfully register new user', async () => {
      const mockResponse: AuthResponse = { user: mockUser, error: null };
      vi.mocked(authService.signUp).mockResolvedValue(mockResponse);

      const store = useAuthStore();
      const result = await store.register(
        'test@example.com',
        'password',
        'John',
        'Doe'
      );

      expect(result.success).toBe(true);
      expect(store.user).toEqual(mockUser);
      expect(store.isAuthenticated).toBe(true);
    });

    it('should handle registration failure', async () => {
      const mockResponse: AuthResponse = { 
        user: null, 
        error: mockAuthError
      };
      vi.mocked(authService.signUp).mockResolvedValue(mockResponse);

      const store = useAuthStore();
      const result = await store.register(
        'existing@example.com',
        'password',
        'John',
        'Doe'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe(mockAuthError.message);
      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should successfully update user profile', async () => {
      const mockUpdatedUser = { 
        ...mockUser,
        user_metadata: {
          first_name: 'John Updated',
          last_name: 'Doe Updated'
        }
      };
      
      const mockResponse: AuthResponse = { 
        user: mockUpdatedUser, 
        error: null 
      };
      
      vi.mocked(authService.updateProfile).mockResolvedValue(mockResponse);

      const store = useAuthStore();
      store.user = mockUser;

      const profileData: UserProfile = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: mockUser.email || ''
      };

      const result = await store.updateProfile(profileData);

      expect(result.success).toBe(true);
      expect(store.user).toEqual(mockUpdatedUser);
    });
  });
});