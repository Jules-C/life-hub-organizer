// src/services/__tests__/auth.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../auth';
import { supabase } from '../supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

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

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Create a mock User with minimum required properties
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: {
      first_name: 'John',
      last_name: 'Doe'
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: '2023-01-01'
  } as User;

  describe('signIn', () => {
    it('should sign in a user successfully', async () => {
      // Setup the mock response
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: {} as Session },
        error: null
      });

      // Call the service method
      const result = await authService.signIn('test@example.com', 'password');

      // Assertions
      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      });
    });

    it('should handle sign in errors', async () => {
      // Create a mock error
      const mockError = {
        message: 'Invalid login credentials',
        status: 400
      } as AuthError;
      
      // Setup the mock response with an error
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      });

      // Call the service method
      const result = await authService.signIn('test@example.com', 'wrong-password');

      // Assertions
      expect(result.user).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe('signUp', () => {
    it('should register a new user successfully', async () => {
      // Setup the mock response
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: {} as Session },
        error: null
      });

      // Call the service method with proper parameter structure
      const result = await authService.signUp({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      });

      // Assertions
      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            first_name: 'John',
            last_name: 'Doe'
          }
        }
      });
    });

    it('should handle registration errors', async () => {
      // Create a mock error
      const mockError = {
        message: 'Email already in use',
        status: 400
      } as AuthError;
      
      // Setup the mock response with an error
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      });

      // Call the service method
      const result = await authService.signUp({
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      });

      // Assertions
      expect(result.user).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      // Setup the mock response
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      // Call the service method
      const user = await authService.getCurrentUser();

      // Assertions
      expect(user).toEqual(mockUser);
      expect(supabase.auth.getUser).toHaveBeenCalled();
    });

    it('should handle errors when getting current user', async () => {
      const mockError = new Error('Session expired');
      
      // Setup the mock response with an error
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: { message: 'Session expired' } as AuthError
      });

      // Call and expect the service method to throw
      await expect(authService.getCurrentUser()).rejects.toThrow('Session expired');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      // Create a mock updated user
      const updatedUser = {
        ...mockUser,
        user_metadata: {
          ...mockUser.user_metadata,
          first_name: 'Updated',
          last_name: 'Name'
        }
      };
      
      // Setup the mock response
      vi.mocked(supabase.auth.updateUser).mockResolvedValue({
        data: { user: updatedUser },
        error: null
      });

      // Call the service method
      const result = await authService.updateProfile({
        firstName: 'Updated',
        lastName: 'Name'
      });

      // Assertions
      expect(result.user).toEqual(updatedUser);
      expect(result.error).toBeNull();
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        data: {
          first_name: 'Updated',
          last_name: 'Name',
          avatar_url: undefined
        }
      });
    });

    it('should handle profile update errors', async () => {
      // Create a mock error
      const mockError = {
        message: 'Update failed',
        status: 400
      } as AuthError;
      
      // Setup the mock response with an error
      vi.mocked(supabase.auth.updateUser).mockResolvedValue({
        data: { user: null },
        error: mockError
      });

      // Call the service method
      const result = await authService.updateProfile({
        firstName: 'Updated',
        lastName: 'Name'
      });

      // Assertions
      expect(result.user).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      // Setup the mock response
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

      // Call the service method
      await authService.signOut();
      
      // Assertions
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out errors', async () => {
      // Create a mock error
      const mockError = new Error('Network error');
      
      // Setup the mock response with an error
      vi.mocked(supabase.auth.signOut).mockRejectedValue(mockError);

      // Call and expect the service method to throw
      await expect(authService.signOut()).rejects.toThrow('Network error');
    });
  });

  describe('getSession', () => {
    it('should get the current session', async () => {
      const mockSession = { expires_at: 12345 } as Session;
      
      // Setup the mock response
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null
      });

      // Call the service method
      const result = await authService.getSession();
      
      // Assertions
      expect(result.data.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it('should handle errors when getting session', async () => {
      // Create a mock error
      const mockError = {
        message: 'Session error',
        status: 400
      } as AuthError;
      
      // Setup the mock response with an error
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: mockError
      });

      // Call the service method
      const result = await authService.getSession();
      
      // Assertions
      expect(result.data.session).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });
});