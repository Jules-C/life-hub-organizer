// src/services/__tests__/auth.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../auth';
import { supabase } from '../supabase';
// Import types we need
import type { User, Session, AuthError } from '@supabase/supabase-js';
import type { AuthResponse } from '@/types/auth';

// Use any for mock response types to avoid compatibility issues
type SupabaseMockResponse = any;

// Mock the Supabase client
vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
      updateUser: vi.fn()
    }
  }
}));

// Create properly typed mock responses that are compatible with mock functions
function createAuthMockResponse(user: User | null = null, session: Session | null = null, error: AuthError | null = null): SupabaseMockResponse {
  return {
    data: { user, session },
    error
  };
}

function createUserMockResponse(user: User | null = null, error: AuthError | null = null): SupabaseMockResponse {
  return {
    data: { user },
    error
  };
}

function createSessionMockResponse(session: Session | null = null, error: AuthError | null = null): SupabaseMockResponse {
  return {
    data: { session },
    error
  };
}

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signIn', () => {
    it('should sign in a user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          first_name: 'Test',
          last_name: 'User'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01'
      } as User;

      const mockResponse = createAuthMockResponse(mockUser, {} as Session);
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockResponse);

      const result = await authService.signIn('test@example.com', 'password');

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      });
    });

    it('should handle sign in errors', async () => {
      const mockError = {
        message: 'Invalid login credentials',
        status: 400
      } as AuthError;
      
      const mockResponse = createAuthMockResponse(null, null, mockError);
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockResponse);

      const result = await authService.signIn('test@example.com', 'wrong-password');

      expect(result.user).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe('signUp', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'new@example.com',
        user_metadata: {
          first_name: 'New',
          last_name: 'User'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01'
      } as User;

      const mockResponse = createAuthMockResponse(mockUser, {} as Session);
      vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse);

      const result = await authService.signUp({
        email: 'new@example.com',
        password: 'password',
        firstName: 'New',
        lastName: 'User'
      });

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password',
        options: {
          data: {
            first_name: 'New',
            last_name: 'User'
          }
        }
      });
    });

    it('should handle registration errors', async () => {
      const mockError = {
        message: 'Email already in use',
        status: 400
      } as AuthError;
      
      const mockResponse = createAuthMockResponse(null, null, mockError);
      vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse);

      const result = await authService.signUp({
        email: 'existing@example.com',
        password: 'password',
        firstName: 'Existing',
        lastName: 'User'
      });

      expect(result.user).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'current@example.com',
        user_metadata: {
          first_name: 'Current',
          last_name: 'User'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01'
      } as User;

      const mockResponse = createUserMockResponse(mockUser);
      vi.mocked(supabase.auth.getUser).mockResolvedValue(mockResponse);

      const user = await authService.getCurrentUser();

      expect(user).toEqual(mockUser);
      expect(supabase.auth.getUser).toHaveBeenCalled();
    });

    it('should handle errors when getting current user', async () => {
      const mockError = {
        message: 'Session expired',
        status: 401
      } as AuthError;
      
      const mockResponse = createUserMockResponse(null, mockError);
      vi.mocked(supabase.auth.getUser).mockResolvedValue(mockResponse);

      await expect(authService.getCurrentUser()).rejects.toThrow('Session expired');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        user_metadata: {
          first_name: 'Updated',
          last_name: 'User'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01'
      } as User;

      const mockResponse = createUserMockResponse(mockUser);
      vi.mocked(supabase.auth.updateUser).mockResolvedValue(mockResponse);

      const result = await authService.updateProfile({
        firstName: 'Updated',
        lastName: 'User'
      });

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        data: {
          first_name: 'Updated',
          last_name: 'User'
        }
      });
    });

    it('should handle profile update errors', async () => {
      const mockError = {
        message: 'Update failed',
        status: 400
      } as AuthError;
      
      const mockResponse = createUserMockResponse(null, mockError);
      vi.mocked(supabase.auth.updateUser).mockResolvedValue(mockResponse);

      const result = await authService.updateProfile({
        firstName: 'Updated',
        lastName: 'User'
      });

      expect(result.user).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

      await authService.signOut();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out errors', async () => {
      const mockError = new Error('Network error');
      vi.mocked(supabase.auth.signOut).mockRejectedValue(mockError);

      await expect(authService.signOut()).rejects.toThrow('Network error');
    });
  });

  describe('getSession', () => {
    it('should get the current session', async () => {
      const mockSession = { expires_at: 12345 } as Session;
      
      const mockResponse = createSessionMockResponse(mockSession);
      vi.mocked(supabase.auth.getSession).mockResolvedValue(mockResponse);

      const session = await authService.getSession();
      expect(session).toEqual(mockResponse);
    });

    it('should handle errors when getting session', async () => {
      const mockError = {
        message: 'Session error',
        status: 400
      } as AuthError;
      
      const mockResponse = createSessionMockResponse(null, mockError);
      vi.mocked(supabase.auth.getSession).mockResolvedValue(mockResponse);

      const result = await authService.getSession();
      expect(result.error).toEqual(mockError);
    });
  });
});
