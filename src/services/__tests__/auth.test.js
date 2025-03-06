import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authService } from '../auth'
import { supabase } from '../supabase'

vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      updateUser: vi.fn()
    }
  }
}))

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: {
      first_name: 'John',
      last_name: 'Doe'
    }
  }

  describe('signUp', () => {
    it('should successfully register a new user', async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const result = await authService.signUp(
        'test@example.com',
        'password123',
        'John',
        'Doe'
      )

      expect(result.user).toEqual(mockUser)
      expect(result.error).toBeNull()
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            first_name: 'John',
            last_name: 'Doe'
          }
        }
      })
    })

    it('should handle registration errors', async () => {
      const mockError = new Error('Email already exists')
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null },
        error: mockError
      })

      const result = await authService.signUp(
        'existing@example.com',
        'password123',
        'John',
        'Doe'
      )

      expect(result.user).toBeNull()
      expect(result.error).toBe(mockError)
    })
  })

  describe('signIn', () => {
    it('should successfully sign in user', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const result = await authService.signIn(
        'test@example.com',
        'password123'
      )

      expect(result.user).toEqual(mockUser)
      expect(result.error).toBeNull()
    })

    it('should handle invalid credentials', async () => {
      const mockError = new Error('Invalid login credentials')
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null },
        error: mockError
      })

      const result = await authService.signIn(
        'test@example.com',
        'wrongpassword'
      )

      expect(result.user).toBeNull()
      expect(result.error).toBe(mockError)
    })
  })

  describe('signOut', () => {
    it('should successfully sign out user', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null })
      await authService.signOut()
      expect(supabase.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const user = await authService.getCurrentUser()
      expect(user).toEqual(mockUser)
    })

    it('should handle get user errors', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: new Error('Session expired')
      })

      const user = await authService.getCurrentUser()
      expect(user).toBeNull()
    })
  })

  describe('updateProfile', () => {
    it('should successfully update user profile', async () => {
      const updates = {
        firstName: 'John Updated',
        lastName: 'Doe Updated'
      }

      const updatedUser = {
        ...mockUser,
        user_metadata: {
          first_name: updates.firstName,
          last_name: updates.lastName
        }
      }

      vi.mocked(supabase.auth.updateUser).mockResolvedValue({
        data: { user: updatedUser },
        error: null
      })

      const result = await authService.updateProfile(mockUser.id, updates)
      expect(result.user).toEqual(updatedUser)
      expect(result.error).toBeNull()
    })
  })
})