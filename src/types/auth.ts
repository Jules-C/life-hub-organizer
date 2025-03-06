// src/types/auth.ts
import type { User, Session, AuthError } from '@supabase/supabase-js';
import type { ServiceResponse } from '@/test-utils/response-adapters';

// Basic auth interfaces
export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

// Response types for authentication services
export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export interface UserResponse {
  data: {
    user: User | null;
  };
  error: AuthError | null;
}

export interface AuthUserResponse {
  data: {
    user: { id: string; email: string; } | null;
  };
  error: AuthError | null;
}

export interface SessionResponse {
  data: {
    session: Session | null;
  };
  error: AuthError | null;
}

// Enhanced types for Supabase responses
export interface AuthTokenResponsePassword {
  data: {
    user: User | null;
    session: Session | null;
    weakPassword?: null;
  };
  error: AuthError | null;
}

// User sign-up request
export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Profile update request
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

// Helper functions to create properly typed responses
export function createAuthResponse(user: User | null = null, session: Session | null = null, error: AuthError | null = null): AuthResponse {
  return { user, session, error };
}

export function createUserResponse(user: User | null = null, error: AuthError | null = null): UserResponse {
  return { data: { user }, error };
}

export function createSessionResponse(session: Session | null = null, error: AuthError | null = null): SessionResponse {
  return { data: { session }, error };
}

// Type guard to check if an object is an AuthError
export function isAuthError(obj: any): obj is AuthError {
  return obj && typeof obj === 'object' && 'message' in obj && 'status' in obj;
}
